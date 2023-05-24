#!/bin/sh

set -xe

docker run -d --name gateway \
  -p 9080:9080 \
  -e APISIX_STAND_ALONE=true \
  apache/apisix

docker cp apisix.yaml gateway:/usr/local/apisix/conf/