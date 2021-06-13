# fabrikClient (fabrikclient)

A demokratiefabrik Vue-js Client installed and configured by Quasar-CLI

## Install the dependencies
```bash
yarn install
quasar upgrade
```

## Environment Variables
- Env variables in /.quasar.env.json (QENV module)

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
QENV=production quasar dev
```

### Lint the files
```bash
yarn esling --fix
```


### Build the app for production
Note: is done automatically within the Dockerfile.
```bash
quasar build

```

# DOCKER

## Builds

> docker build -f Dockerfile -t demokratiefabrik/fabrikclient .
> docker push demokratiefabrik/fabrikclient:latest
(or push it via portainer)

## Runs
> docker run --publish 80:80 --detach --name fabrikClient demokratiefabrik/fabrikclient:latest
