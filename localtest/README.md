# Introduction

## Set up

The vault role ID and secret needs to be set in the environment before running
any of the following commands:

```
export VAULT_ROLE_ID=...
export VAULT_SECRET_ID=...
```

## Run

```
docker-compose pull
docker-compose up -d
```

This will bring up the latest MC configured with a local postgres instance, and
configured to listen on port 9900.

### Running a specific version of MC

```
TAG=... docker-compose up -d
```

For example:
```
TAG=2019-12-31 docker-compose up -d
```

## Register Controllers

The sample below requires [httpie](https://httpie.org/),
[httpie-jwt](https://github.com/teracyhq/httpie-jwt-auth), and
[jq](https://stedolan.github.io/jq/).

```
export SUPERPASS=$( http --verify=false \
    POST https://127.0.0.1:9900/api/v1/login username=mexadmin password=mexadmin123 \
    | jq -r .token )

http --verify=false --auth-type=jwt --auth=$SUPERPASS \
    POST https://127.0.0.1:9900/api/v1/auth/controller/create \
    region=US address=mexplat-dev.ctrl.mobiledgex.net:55001
```

This is a one-time setup.  The MC database is persistent across docker-compose runs.
