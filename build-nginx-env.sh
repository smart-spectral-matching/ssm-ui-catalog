#!/bin/sh
# util script for development only, run in project root directory

set -e

cd "$(dirname "$0")" || exit 1

if [ ! -d "build" ] ; then
    echo "Error: no build output exists. Run 'yarn run build' to generate build output"
    exit 1
fi

rm -rf .ci/build || true
# TODO sloppy handling for Docker users' volumes
mv build .ci/build || { sudo chown -R "$USERNAME" . && mv build .ci/build; }
docker build -f .ci/Dockerfile.nginx -t datastreams-fe-nginx .ci
echo "You can now run 'docker run [OPTIONS] datastreams-fe-nginx:latest [COMMAND] [ARG...]'"
echo "One flag you will probably want to include is '-p 80:80'"