# You can use this file in development if you'd like (mostly for Content-Security-Policy testing)
# the docker build context should be the .ci/ directory, not the project root
FROM nginx:stable-alpine

# developers should just use the default, CI needs to change for named domains + SSL/TLS
# if you want to use HTTPS locally, you're on your own for now
ARG DEFAULT_NGINX_CONF=default-localhost.conf

# get rid of all the default HTML and NGINX files, we won't be needing them
# note that /etc/nginx/conf.d/default.conf is a unique file in NGINX Docker
RUN rm -rf /usr/share/nginx/html/*
RUN rm -f /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY ${DEFAULT_NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY nginx-conf/* /etc/nginx/conf.d/

COPY build/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]