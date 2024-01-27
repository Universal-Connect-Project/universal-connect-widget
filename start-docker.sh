#!/bin/env bash

docker run -p8080:8080 -e Env=dev --env-file ${BASH_SOURCE%/*}/.env uvcs