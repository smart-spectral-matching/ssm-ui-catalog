#!/bin/sh

# File used to manage application runtime ENV variables

set -e

# cache file to only run this script once per run (in case of container restart)
readonly SCRIPT_CACHE_FILE="/tmp/ssm-env-config"
readonly SECURITY_CONF_FILE="/etc/nginx/conf.d/security.conf"

# check to see if user set a value for the environment variable
# $1 = literal environment variable name, $2 = environment variable value
warn_missing() {
  if [ -z "$2" ]; then echo "[WARNING]: $1 environment variable was not set, using default fallback"; fi
}

edit_security_conf() {
  REPLACEMENT_HOOK=$1
  REPLACEMENT_VALUE=$2
  case $REPLACEMENT_VALUE in
  "/"*)
    # absolute path, so don't need to add anything to CSP (just remove the hook)
    sed -i "s~[[:space:]]*{{$REPLACEMENT_HOOK}}~~g" $SECURITY_CONF_FILE
    ;;
  *)
    # need to add the URL to CSP (if it doesn't start with "/", assume it's a domain or IP)
    # IMPORTANT: if the URL variable has a path after its domain, you must make sure a trailing slash exists, or you will get CSP errors!
    sed -i "s~{{$REPLACEMENT_HOOK}}~${REPLACEMENT_VALUE%/}/~g" $SECURITY_CONF_FILE
    ;;
  esac
}

if [ ! -f $SCRIPT_CACHE_FILE ]; then
  touch $SCRIPT_CACHE_FILE

  # check if we have ipv6 available, stop listening if not
  if [ ! -f "/proc/net/if_inet6" ]; then
     echo "[INFO]: ipv6 not available"
     sed -i '/[::]:/d' /etc/nginx/conf.d/default.conf
  fi

  ###### ENV HANDLING ################

  # Step 1: Log out any unset variables - WRT deployment, this is probably an error. If testing locally, you can ignore this (as the defaults should be mimicing the config).
  warn_missing "API_URL" "$API_URL"
  warn_missing "ML_UI_URL" "$ML_UI_URL"
  warn_missing "ML_NOTEBOOKS_URL" "$ML_NOTEBOOKS_URL"
  warn_missing "OIDC_AUTH_URL" "$OIDC_AUTH_URL"
  warn_missing "OIDC_CLIENT_ID" "$OIDC_CLIENT_ID"
  warn_missing "OIDC_REDIRECT_URL" "$OIDC_REDIRECT_URL"
  warn_missing "FILE_CONVERTER_URL" "$OIDC_REDIRECT_URL"

  # Step 2: resolve variables here - resort to default values if runtime environment variables not set
  API_URL_RESOLVED=${API_URL:-"/api"}
  ML_UI_URL_RESOLVED=${ML_UI_URL:-"/machine-learning"}
  ML_NOTEBOOKS_URL_RESOLVED=${ML_NOTEBOOKS_URL:-"/machine-learning/notebooks/"}
 
  # Step 3: resolve Content-Security-Policy variables in NGINX files
  edit_security_conf "API_URL" "$API_URL_RESOLVED"
  edit_security_conf "OIDC_AUTH_URL" "$OIDC_AUTH_URL" 
  edit_security_conf "FILE_CONVERTER_URL" "$FILE_CONVERTER_URL" 

  # Step 4: add frontend configuration from Docker environment variables here
  cat<<!EOF! | tr -d '\n' > /usr/share/nginx/html/config.js
'use strict';window['config']={
apiUrl: '${API_URL_RESOLVED%/}',
mlUiUrl: '${ML_UI_URL_RESOLVED}',
mlNotebooksUrl: '${ML_NOTEBOOKS_URL_RESOLVED}',
oidcAuthUrl: '${OIDC_AUTH_URL}',
oidcClientId: '${OIDC_CLIENT_ID}',
oidcRedirctUrl: '${OIDC_REDIRECT_URL}',
fileConverterUrl: '${FILE_CONVERTER_URL}',
};
!EOF!
  ########### END ENV HANDLING ######################
else
  echo "[INFO]: already updated with env variables, will not update again"
fi
