# Building the application
FROM golang:1.18-alpine

# Installing dependencies
RUN apk add curl git yarn && sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /bin
WORKDIR /go/src/tldrprogress

# Caching go packages
COPY go.mod go.sum ./
RUN go mod download

# Caching yarn packages
COPY resources/package.json resources/yarn.lock resources/
RUN cd resources && yarn

# Building the application
COPY . .
RUN /bin/task build

# Packing the built application in a small container
FROM alpine:latest

WORKDIR /tldrprogress/
VOLUME /tldrprogress/keys/

COPY --from=0 /go/src/tldrprogress/out/update /bin/tldrprogress
CMD ["/bin/tldrprogress"]
