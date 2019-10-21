# Node.js training

### Pakhuta Siarhei

## Application start
1. `npm install` - install application dependencies
1. `npm run postgres` - pull a Postgres Docker image and run it
1. `npm run migrate` - run a script to fill postgres database
1. `npm run mongodb` - pull a MongoDB Docker image and run it
1. `npm start` - start an application

## Application stop
1. `npm run postgres:stop` - stop a Postgres Docker container
1. `npm run mongodb:stop` - stop a MongoDB Docker container

## Development
* `npm run eslint` - run a script for checking code style
* `npm run build` - build an application to the `/dist` folder
