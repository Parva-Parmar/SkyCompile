package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDKey contextKey = "userId"

// Basic Rate Limiting Structure
type clientLimiter struct {
	tokens int
	last   time.Time
}

var (
	limiters = make(map[string]*clientLimiter)
	limitMu  sync.Mutex
)

// RateLimiter enforces 100 requests per 10 seconds per IP, hardening against DDOS / Spam
func RateLimitMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ip := strings.Split(r.RemoteAddr, ":")[0]

		limitMu.Lock()
		limiter, exists := limiters[ip]
		if !exists {
			limiter = &clientLimiter{tokens: 100, last: time.Now()}
			limiters[ip] = limiter
		}

		now := time.Now()
		elapsed := now.Sub(limiter.last).Seconds()
		// Refill at 10 tokens per second up to 100
		limiter.tokens += int(elapsed * 10)
		if limiter.tokens > 100 {
			limiter.tokens = 100
		}
		limiter.last = now

		if limiter.tokens <= 0 {
			limitMu.Unlock()
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			return
		}
		limiter.tokens--
		limitMu.Unlock()

		// Enable CORS globally natively to replace Node's CORS middleware
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}

// AuthMiddleware decodes the JWT using the secret and injects User ID
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return RateLimitMiddleware(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Authorization header missing", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Split(authHeader, " ")[1]
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "super_secret_dev_key_123_upgraded_to_256_bits_for_skycompile!" // fallback if undefined in container
		}

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["userId"] == nil {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		userId := claims["userId"].(string)

		ctx := context.WithValue(r.Context(), userIDKey, userId)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
