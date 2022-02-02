#!/bin/sh

# FOR CI ONLY - update nginx config files before building NGINX container

set -eu

cd "$(dirname "$0")/.." || exit 1

# replace the 'connect-src' domain in Content-Security-Policy with the api-url
sed -i "s~\shttp:\/\/ssm-dev\.ornl\.gov~~g" .ci/nginx-conf/security.conf
