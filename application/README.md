# Quick How-to

## FIRST: Get familia with [dotenv](https://www.npmjs.com/package/dotenv)
- Create your config file `/application/.env` `/example/application/.env`

## SECOND: There are 3 services to start to get a widget demo running locally.
### The Dev server
*This is not required in production but needed in local development*
  1. In `/application`, run `npm ci`.
  2. Start react dev server by running `npm run dev`. This will serve the client side code (browser) through port `3000` but won't handle end-to-end development.

### The API server
  1. Run `npm run keys` in `/application` to generate a new set of `key` and `IV` values.
  2. Fill in the `CryptoKey` and `CryptoIv` in your newly created `application/.env` file with the generated `key` and `IV`.
  3. Sign up a UCP client account: [here](https://ucp-login.sophtron-prod.com/) (the `Click here to login` link navigates to the aws hosted login page where sign up option is available).
  4. Generate and view your client secrets once registered and logged in
  5. Fill in the `UcpAuthClientId`, `UcpAuthClientSecret` and `UcpAuthEncryptionKey` in the `application/.env` file with the values provided by login page.
  6. Start the API server by running `npm run server` in `/application`. At this stage, the API server is running and the widget is available at `http://localhost:8080`.

  *Please remember that secrets are passed through environment variables instead of hardcoded in the js file.*
  DO NOT put any credentials in any of the js files. this way it will get accidentially committed and leaked to public
  USE `.evn` FILE

  *UCP credentials are required for authentication and secret exchange, storage (redis-like session cache) and analytics services.*
  
  *The `CryptoKey` and `CryptoIv` values are for encrypting the session token in order to not rely on cookies. They must be shared across server instances if there are multiple instances.*

## Demo Website

*To get a working demo locally, you need to act as a client (who embeds the widget within their own domain). An [example demo website](../example/README.md) is provided to demonstrate this.*

  1. Acquire credentials for one of the supported aggregators (currently MX or Sophtron). To sign up with MX, go [here](https://dashboard.mx.com/sign_up).
  2. Fill in the relevant credentials in `example/application/.env` file by following config options in [example/application/config.js](../example/application/config.js) (e.g., if you want to see `mx bank` working in the widget, `MxClientId` and `MxApiSecret` must be provided).
  3. Fill in the `UcpClientId`, `UcpClientSecret` and `UcpEncryptionKey` in the `example/application/.env` file with the values provided by login page (the same values used in step 5 for the 'The API server' section).
  4. Run `npm ci` and `npm run start` in `example/application` folder to run the demo website.
  5. Open `http://localhost:8088/loader.html?env=http://localhost:8080` in a web browser.

*Please use `.env` to provide the api secrets using the keys in `config.js` as the variable names.*
DO NOT put any credentials in any of the js files. this way it will get accidentially committed and leaked to public
USE `.env` FILE

*A hosted example can be found [here](https://ucp-demo.sophtron-prod.com/loader.html?env=https://ucp-widget.sophtron-prod.com).*

## List of banks to test with 
- Sophtron: Sophtron Bank
- MX: MX Bank
- Finicity: Finbank
- Akoya: mikomo