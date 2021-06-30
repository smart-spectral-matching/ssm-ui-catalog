#!/bin/sh

# FOR CI ONLY - update environment variables before running "yarn run build"

set -e

# environment variables
sed -i "s~^[[:space:]]*REACT_APP_API_URL[[:space:]]*=.*~REACT_APP_API_URL=/api/~g" .env
# robots.txt - disallow all crawlers if not in production
[ "$CI_COMMIT_REF_NAME" == "main" ] || printf "User-agent: *\nDisallow: /\n" > public/robots.txt
