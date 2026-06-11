FROM golang:1.21 AS builder

WORKDIR /app

# Copy source code and download dependencies
COPY . .
RUN go mod tidy

# Build the Go app
RUN go build -o skycompile-go .

# Run stage - Use a full Ubuntu environment so it acts like a real Linux terminal
FROM ubuntu:22.04

# Avoid timezone prompts during apt-get
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    wget \
    git \
    bubblewrap \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    default-jdk \
    vim \
    nano \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /workspace

WORKDIR /app
COPY --from=builder /app/skycompile-go .
EXPOSE 8082
CMD ["./skycompile-go"]
