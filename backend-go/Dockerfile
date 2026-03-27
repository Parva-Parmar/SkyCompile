FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy source code and download dependencies
COPY . .
RUN go mod tidy

# Build the Go app
RUN go build -o skycompile-go .

# Run stage
FROM alpine:latest
RUN apk add --no-cache bash curl
WORKDIR /app
COPY --from=builder /app/skycompile-go .
EXPOSE 8082
CMD ["./skycompile-go"]
