# Quick How-to

## FIRST: Get familiar with [dotenv](https://www.npmjs.com/package/dotenv)
- Create your config file `/application/.env` `/example/application/.env`

## SECOND: There are 3 services to start to get a widget demo running locally.
### The Dev server
*This is not required in production but needed in local development*
  1. In `/application`, run `npm ci`.
  2. Start react dev server by running `npm run dev`. This will serve the client side code (browser) through port `3000` but won't handle end-to-end development.

### The API server
  1. Run `npm run keys` in `/application` to generate a new set of `key` and `IV` values.
  2. Fill in the `CryptoKey` and `CryptoIv` in your newly created `application/.env` file with the generated `key` and `IV`.
  3. Sign up a UCP client account: [here](https://login.universalconnectproject.org/) (the `Click here to login` link navigates to the aws hosted login page where sign up option is available).
  4. Generate and view your client secrets once registered and logged in
  5. Fill in the `UcpAuthClientId`, `UcpAuthClientSecret` and `UcpAuthEncryptionKey` in the `application/.env` file with the values provided by login page.
  6. Start the API server by running `npm run server` in `/application`. At this stage, the API server is running and the widget is available at `http://localhost:8080`.

  *Please remember that secrets are passed through environment variables instead of hardcoded in the js file.*
  DO NOT put any credentials in any of the js files. If you do so, it could accidentally get committed and leaked to public.
  USE `.env` FILE

  *UCP credentials are required for authentication and secret exchange, storage (redis-like session cache) and analytics services.*
  
  *The `CryptoKey` and `CryptoIv` values are for encrypting the session token in order to not rely on cookies. They must be shared across server instances if there are multiple instances.*

  * You might see an error about failure to connect redis, the widget doesn't rely on redis to start, but some providers logic require an redis intance, to fix this error you can either: 
  - start a local redis instance, this way it will be avaliable at localhost:6379 and the widget will use it
  - Or set in `.env` Env=dev, this way the redis client will use local in-mem object to handle the cache and remove the error, however, this is just for some testing, the cached values won't expire and also will be cleared on server restart. 
  * Running the docker container:
    if you encounter some strange errors, especially trying on windows, the environment setup could be tricky, you may choose to run the docker image instead. please scroll all the way down for the instruction on docker.

## Demo Website

*To get a working demo locally, you need to act as a client (who embeds the widget within their own domain). An [example demo website](../example/README.md) is provided to demonstrate this.*

  1. Acquire credentials for one of the supported aggregators (currently MX or Sophtron). To sign up with MX, go [here](https://dashboard.mx.com/sign_up).
  2. Fill in the relevant credentials in `example/application/.env` file by following config options in [example/application/config.js](../example/application/config.js) (e.g., if you want to see `mx bank` working in the widget, `MxClientId` and `MxApiSecret` must be provided).
  3. Fill in the `UcpClientId`, `UcpClientSecret` and `UcpEncryptionKey` in the `example/application/.env` file with the values provided by login page (the same values used in step 5 for the 'The API server' section).
  4. Run `npm ci` and `npm run start` in `example/application` folder to run the demo website.
  5. Open `http://localhost:8088/loader.html?env=http://localhost:8080` in a web browser.

*Please use `.env` to provide the api secrets using the keys in `config.js` as the variable names.*
DO NOT put any credentials in any of the js files. If you do so, it could accidentally get committed and leaked to public.
USE `.env` FILE

*A hosted example can be found [here](https://demo.universalconnectproject.org/loader.html?env=https://widget.universalconnectproject.org).*

## List of banks to test with 
- Sophtron: Sophtron Bank
- MX: MX Bank
- Finicity: Finbank
- Akoya: mikomo

# Running the docker container
- there is a Dockerfile that's used to build a docker image, 
  you can use `build.sh`, it does the build and tags the image with `uvcs`
- credentials needs to be configured through envrionment variables. to do it, use `-e` option to pass in
  you can use the `start-docker.sh`, it assumes the config is up to date with the `.env` file and mounts it to the container then start.
*in your `.env` file, make sure values are encloses by quotes `"` or `'`, this is a limitation by docker

# Using your own auth service
The widget is designed with flexiblity in mind. by default it's configured to authenticate client with `UCPAuthService`, however, clients who are hosting the widget in their own domain are free to switch to other auth client, 
So long as the auth provider implements the `SecretExchange` method and returns the aggregation provider credentials

for instance, take a look at the simplest [local](./server/serviceClients/authClient/local.js) auth provider, which returns the configurations from pre-configured environment variables, to enable it, simply set `AuthProvider` with value `local` in the `config.js` or `.env` file

To use your own auth service. follow the patterns in [authClient](./server/serviceClients/authClient) as example to call your own service endpoints

# Using multiple auth providers
Multiple auth method can be routed by client request too 
- The `authToken` is in the format of `<authProvider>;<token>;<iv>` , see `getAuthCode`method in the example app
- By leaving `AuthProvider` in the `config.js` empty, the widget will choose auth provider by using the `authProvider` value provided in the authToken passed in. 
