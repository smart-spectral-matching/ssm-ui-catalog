#!/bin/sh

# File used to manage application runtime ENV variables

set -e

# cache file to only run this script once per run (in case of container restart)
readonly SCRIPT_CACHE_FILE="/tmp/ssm-env-config"

if [ ! -f $SCRIPT_CACHE_FILE ]; then
  touch $SCRIPT_CACHE_FILE

  # check if we have ipv6 available, stop listening if not
  if [ ! -f "/proc/net/if_inet6" ]; then
     echo "[INFO]: ipv6 not available"
     sed -i '/[::]:/d' /etc/nginx/conf.d/default.conf
  fi

  ###### ENV HANDLING ################

  # Step 1: Log out any unset variables - WRT deployment, this is probably an error. If testing locally, you can ignore this (as the defaults should be mimicing the config).
  if [ -z "$API_URL" ]; then echo "[WARNING]: API_URL environment variable was not set, using default fallback"; fi
  if [ -z "$ML_UI_URL" ]; then echo "[WARNING]: ML_UI_URL environment variable was not set, using default fallback"; fi
  if [ -z "$ML_NOTEBOOKS_URL" ]; then echo "[WARNING]: ML_NOTEBOOKS_URL environment variable was not set, using default fallback"; fi

  # Step 2: resolve variables here - resort to default values if runtime environment variables not set
  API_URL_RESOLVED=${API_URL:-"/api"}
  ML_UI_URL_RESOLVED=${ML_UI_URL:-"/machine-learning"}
  ML_NOTEBOOKS_URL_RESOLVED=${ML_NOTEBOOKS_URL:-"/machine-learning/notebooks/"}

  # Step 3: resolve Content-Security-Policy variables in NGINX files
  readonly SECURITY_CONF_FILE="/etc/nginx/conf.d/security.conf"
  case $API_URL_RESOLVED in
    "/"*)
      # absolute path, so don't need to add anything to CSP (just remove the hook)
      sed -i "s~[[:space:]]*{{API_URL}}~~g" $SECURITY_CONF_FILE
      ;;
    *)
      # need to add the URL to CSP (if it doesn't start with "/", assume it's a domain or IP)
      # IMPORTANT: if the URL variable has a path after its domain, you must make sure a trailing slash exists, or you will get CSP errors!
      sed -i "s~{{API_URL}}~${API_URL_RESOLVED%/}/~g" $SECURITY_CONF_FILE
      ;;
    esac

  # Step 4: add frontend configuration from Docker environment variables here
  cat<<!EOF! | tr -d '\n' > /usr/share/nginx/html/config.js
'use strict';window['config']={
apiUrl: '${API_URL_RESOLVED}',
mlUiUrl: '${ML_UI_URL_RESOLVED}',
mlNotebooksUrl: '${ML_NOTEBOOKS_URL_RESOLVED}',
};
!EOF!
  ########### END ENV HANDLING ######################
else
  echo "[INFO]: already updated with env variables, will not update again"
fi
