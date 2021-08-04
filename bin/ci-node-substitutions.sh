#!/bin/sh

# FOR CI ONLY - update environment variables before running "yarn run build"
# $1 should be provided and should equal the branch name the current CI job is using

set -euo pipefail

cd "$(dirname "$0")/.." || exit 1

# Change whatever value the provided env key has to the provided env value
# $1 = environment variable key
# $2 = new environment variable value
change_env_var() {
  sed -i "s~^[[:space:]]*$1[[:space:]]*=.*~$1=$2~g" .env
}

# environment variables
change_env_var "REACT_APP_API_URL" "/api"
change_env_var "REACT_APP_API_DOCS_URL" "/api/swagger-ui/"
change_env_var "REACT_APP_MACHINE_LEARNING_URL" "/machine-learning/notebooks/"
# robots.txt - disallow all crawlers if not in production
[ "$1" = "main" ] || printf "User-agent: *\nDisallow: /\n" > public/robots.txt
