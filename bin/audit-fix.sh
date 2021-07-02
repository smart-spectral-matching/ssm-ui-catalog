#!/bin/sh

# Probably only want to use this locally for now

# Yarn is better than NPM for the vast majority of use-cases, but NPM does have the useful 'npm audit fix', which Yarn lacks
# This is a way to use "npm audit fix" for a moment, while still maintaining general usage of yarn (as you should never use both together)

set -euo pipefail

cd "$(dirname "$0")/.." || exit 1

# fail fast if npm AND yarn are not installed
yarn --version
npm --version

mv yarn.lock yarn.lock.tmp
npm i --package-lock-only
npm audit fix || {
    echo "WARNING: unable to fix audit issues. resetting..."
    mv yarn.lock.tmp yarn.lock
    rm package-lock.json
}
rm yarn.lock.tmp
yarn import
rm package-lock.json
