# You can use this file in development if you'd like (mostly for Content-Security-Policy testing)
# the docker build context should be the "deployment-ctx" directory, not the project root
FROM nginx:alpine

# remove the 'listen-for-IPV6' script, we will listen there by default
RUN rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# remove all NGINX default HTML and .conf files
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-conf/* /etc/nginx/conf.d/

# autotune worker processes, see https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/30-tune-worker-processes.sh
ENV NGINX_ENTRYPOINT_WORKER_PROCESSES_AUTOTUNE=1

# execute this before the other NGINX entrypoint scripts.
# see: https://github.com/nginxinc/docker-nginx/tree/master/mainline/alpine for the complete scripts list, and the behavior of the default entrypoint script
COPY 11-environment-variables.sh /docker-entrypoint.d/

# IMPORTANT: these are the business domain ENV variables which MUST be set at runtime
ENV API_URL=
ENV GATEWAY_URL=
ENV ML_UI_URL=
ENV ML_NOTEBOOKS_URL=
ENV OIDC_AUTH_URL=
ENV OIDC_CLIENT_ID=
ENV OIDC_REDIRECT_URL=
ENV FILE_CONVERTER_URL=

# we store the create-react-app build in this directory
COPY build/ /usr/share/nginx/html
