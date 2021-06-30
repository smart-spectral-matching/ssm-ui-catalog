# You can use this file in development if you'd like (mostly for Content-Security-Policy testing)
# the docker build context should be the .ci/ directory, not the project root
FROM code.ornl.gov:4567/rse/datastreams/ssm/frontend/search-upload-ui/nginx:stable-alpine

# get rid of all the default HTML and NGINX files, we won't be needing them
# note that /etc/nginx/conf.d/default.conf is a unique file in NGINX Docker
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx-conf/* /etc/nginx/conf.d/

COPY build/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
