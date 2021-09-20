# ORNL Smart Spectral Matching Search / Upload UI

Frontend for ORNL Smart Spectral Matching, built in React and able to be deployed as a static website.

## Building without Docker (preferred)

`yarn`

Make sure that you build before committing, because the formatter/linter relies on an NPM package.

### Requirements

-   NodeJS >= 10 (check from command line with `node -v`)
-   Yarn. NPM works in a pinch, but is not recommended. Do not commit package-lock.json to the repository.

## Building with Docker

You can either use the `docker-compose.yml` file provided, i.e. `docker-compose up -d --build` , or build images yourself from `node.Dockerfile` .

Note: Running from docker-compose will use `node_modules` and `build` as volumes, use `docker-compose down` with the `-v` flag to get rid of them.

The Docker environment will include `git`, please commit from there so the formatter/linter will run automatically.

Example:

```
docker login code.ornl.gov:4567
docker-compose up --build
```

## Adding dependencies

`yarn add <dependency>` (dependencies) or `yarn add -D <dependency>` (devDependencies)

Note that it doesn't strictly matter whether a dependency is `dev` or not when packaging for a static website, but it's best to put development tools in `devDependencies` and application tools in `dependencies` for organizational purposes anyways.

Removing dependencies: `yarn remove <dependency>`

## Running the application

`yarn start`

If you want to customize values for your own dev environment, create a file called `.env.local.development`

The application is available on `localhost:3000` by default and should refresh if you change files, even if you run the application in Docker.

## Testing

`yarn test` runs the Jest unit tests. All Jest unit tests should go in `src/__tests__`

### Auditing

Currently, any regular dependency will fail CI/CD. Dev dependencies are not checked in CI/CD, but if you get a `critical` severity level, your computer may be compromised.

If you have both NPM and Yarn installed, you can try running `bin/audit-fix.sh` to update some of the audit dependencies automatically.

## Using NGINX environment

To test the program in a fake production environment (for example: Content-Security-Policy):

-   `yarn run build` (can be done in or out of the Docker environment)
-   (if you are in a Docker environment, exit it here)
-   `bin/build-nginx-env.sh`
-   `docker run [OPTIONS] ssm-fe-nginx [COMMAND] [ARG...]`
