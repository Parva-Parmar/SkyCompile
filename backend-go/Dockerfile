FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy source code and download dependencies
COPY . .
RUN go mod tidy

# Build the Go app
RUN go build -o main .

# Run stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8082
CMD ["./main"]
