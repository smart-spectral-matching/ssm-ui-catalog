#!/bin/sh

# FOR CI ONLY - update environment variables before running "yarn run build"
# $1 should be provided and should equal the branch name the current CI job is using

set -euo pipefail

# environment variables
sed -i "s~^[[:space:]]*REACT_APP_API_URL[[:space:]]*=.*~REACT_APP_API_URL=/api~g" .env
sed -i "s~^[[:space:]]*REACT_APP_API_DOCS_URL[[:space:]]*=.*~REACT_APP_API_DOCS_URL=/api/swagger-ui/~g" .env
sed -i "s~^[[:space:]]*REACT_APP_MACHINE_LEARNING_URL[[:space:]]*=.*~REACT_APP_MACHINE_LEARNING_URL=/machine-learning/training/~g" .env
# robots.txt - disallow all crawlers if not in production
[ "$1" == "main" ] || printf "User-agent: *\nDisallow: /\n" > public/robots.txt
