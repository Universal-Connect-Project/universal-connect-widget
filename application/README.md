# Quick How-to

There are 3 services to start to get a widget demo running locally.
## The dev server (this is not required in production but needed in local development)
  1. In `/application`, run `npm install`.
  2. Start react dev server by running `npm run dev`. This will serve the client side code (browser) through port `3000` but won't handle end-to-end development.
## The API server
  1. Run `npm run keys` in `/application` to generate a new set of `key` and `IV` values.
  2. Fill in the `CryptoKey` and `CryptoIv` in the [application/server/config.js](server/config.js) file with the generated `key` and `IV`.
  3. Sign up with Sophtron [here](https://sophtron.com/account/register).
  4. Fill in the `SophtronClientId` and `SophtronClientSecret` in the [application/server/config.js](server/config.js) file with the values provided by Sophtron.
  5. Start the API server by running `npm run server` in `/application`. At this stage, the API server is running and the widget is available at `http://localhost:8080`.

  *Please remember that secrets are passed through environment variables instead of hardcoded in the js file.*

  *Sophtron credentials are required for authentication and secret exchange, storage (redis-like session cache) and analytics services.*
  
  *The `CryptoKey` and `CryptoIv` values are for encrypting the session token in order to not rely on cookies. They must be shared across server instances if there are multiple instances.*
## Demo Website

*To get a working demo locally, you need to act as a client (who embeds the widget within their own domain). An [example demo website](../example/README.md) is provided to demonstrate this.*

  1. Aquire credentials for one of the supported aggregators (currently MX or Sophtron). To sign up with MX, go [here](https://dashboard.mx.com/sign_up).
  2. Fill in the relavant credentials in [example/application/config.js](../example/application/config.js) (e.g., if you want to see `mx bank` working in the widget, `MxClientId` and `MxApiSecret` must be provided).
  3. Fill in the `SophtronApiUserId` and `SophtronApiUserSecret` in the [example/application/config.js](../example/application/config.js) file with the values provided by Sophtron (the same values used in step 4 for the The API server).
  3. Run `npm install` and `npm run start` in `example/application` folder to run the demo website.
  5. Open `http://localhost:8088/loader.html?env=http://localhost:8080` in a web browser.

*Please use envrionment variables to provide the api secrets using the keys in `config.js` as the variable names.*

*A hosted example can be found [here](https://demo.sophtron.com/loader.html?env=https://universalwidget.sophtron-prod.com).*

## List of banks to test with 
- Sophtron: Sophtron Bank
- MX: MX Bank
- Finicity: Finbank
- Akoya: mikomo