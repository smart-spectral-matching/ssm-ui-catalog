# reusable for both developers and CI/CD
FROM code.ornl.gov:4567/rse/images/node:lts-alpine

# build flag for CI (set to "true" in CI/CD) - used by react-scripts. Don't set for development.
# If 'true', will fail on warnings
ARG ci
ENV CI=${ci}

WORKDIR /usr/local/src

# install git if not in "CI" mode, because we want Docker users to use our pre-commit Husky hook (NPM dependency) as well
RUN if [ -z "$CI" ] ; then apk add --no-cache git ; fi

# Run the next two lines first, so that we can save Docker cache as long as we don't change dependencies
COPY package.json .
COPY yarn.lock .

# Since this is strictly a static app (+ how react-scripts work), do not use the --production flag
# CI/CD needs several additional flags, most importantly --frozen-lockfile
RUN if [ -n "$CI" ] ; then yarn --non-interactive --no-progress --frozen-lockfile ; else yarn --non-interactive ; fi

# add `node_modules/.bin` to $PATH for CI/CD
ENV PATH /usr/local/src/node_modules/.bin:$PATH

COPY . .
