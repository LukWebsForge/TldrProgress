# Building the application
FROM golang:1.16-alpine

RUN apk add curl yarn && sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /bin
WORKDIR /go/src/tldrprogress

COPY . .
RUN /bin/task build

# Packing the built application in a small container
FROM alpine:latest

WORKDIR /tldrprogress/
VOLUME /tldrprogress/keys/

COPY --from=0 /go/src/tldrprogress/out/update /bin/tldrprogress
CMD ["/bin/tldrprogress"]
