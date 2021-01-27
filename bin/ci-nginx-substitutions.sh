#!/bin/sh

# FOR CI ONLY - update environment variables before building NGINX container

set -e

# replace the 'example.com' placeholder in the nginx-config website file with the actual domain
sed -i "s|example\.com|$DOMAIN|g" .ci/"$DEFAULT_NGINX_CONF"
# replace the 'connect-src' domain in Content-Security-Policy with the api-url
sed -i "s|http:\/\/ssm-dev\.ornl\.gov:8080|$API_URL|g" .ci/nginx-conf/security.conf
