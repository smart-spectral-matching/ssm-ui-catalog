#!/bin/sh

# FOR CI ONLY - update nginx config files before building NGINX container

set -e

# replace the 'connect-src' domain in Content-Security-Policy with the api-url
sed -i "s~\shttp:\/\/ssm-dev\.ornl\.gov~~g" .ci/nginx-conf/security.conf
