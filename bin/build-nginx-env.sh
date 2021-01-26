#!/bin/sh
# util script for development only, run in project root directory
# NOTE: always run outside Docker environment

set -e

if [ "$(id -u)" -eq 0 ]; then
  echo "Do not run as root or inside the Docker file"
  exit 1
fi

cd "$(dirname "$0")/.." || exit 1

if [ ! -d "build" ] ; then
    echo "Error: no build output exists. Run 'yarn run build' to generate build output"
    exit 1
fi

rm -rf .ci/build || true
# TODO sloppy handling for Docker users' volumes
mv build .ci/build || { sudo chown -R "$USERNAME" . && mv build .ci/build; }
docker build -f .ci/nginx.Dockerfile -t datastreams-fe-nginx .ci
echo "You can now run 'docker run [OPTIONS] datastreams-fe-nginx:latest [COMMAND] [ARG...]'"
echo "One flag you will probably want to include is '-p 80:80'"