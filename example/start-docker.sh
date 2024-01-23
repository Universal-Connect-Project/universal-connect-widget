#!/bin/env bash

docker run -p8088:8080 -e Env=dev -e Port=8080 --env-file ${BASH_SOURCE%/*}/application/.env uvcs-demo