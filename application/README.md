# Quick How-to

There are 3 services to start to get a widget demo locally
1. Widget client dev server, this is not required in production (docker image) but needed in local development
  * start react dev server by `npm run dev`, this will serve client(browser) side code thorugh port `3000` but won't handle end-to-end development
2. The widget server side: 
  * NOTE: Please remember that secrets are passed through environment variables instead of hardcoded in the js file.
  * Sophtron credentials are required for the Auth (provide authentication and secret exchange), storage (redis-like session cache) and analytics services
  * Generate `CryptoKey` and `CryptoIv` with command `npm run keys` and put into the config, this is for encrypting session token, in order no to rely on cookies, this key must be shared across server instances if there are multiple or auto-scaled
  * Fill in the sophtron credentials and `CryptoKey` and `CryptoIv` in [application/config.js](../example/application/config.js)
  * start the bff server by `npm run server` in `application` folder
  * at this stage, the widget is started and accessible at `http://localhost:8080`, this is how a widget is hosted. while it needs authentication to use.
3. To get a working demo locally, You need to act as a client (who embeds the widget in there own domain), hence it is a seperate implementation, an [example demo website](../example/README.md) is provided
  * Fill in the required credentials in [example/application/config.js](../example/application/config.js). e.g.: if you want to see `mx bank` working in the widget, mx client id and secret must be provided
  `NOTE: please use envrionment variables to provide the api secrets` variable names are the keys in the `config.js`
  * Run `npm i` and `npm run start` in `example/application` folder to get the demo server up
  * Browse `http://localhost:8088/loader.html?env=http://localhost:8080`
  * An hosted example can be found [here](https://demo.sophtron.com/loader.html?env=https://universalwidget.sophtron-prod.com) too


  ## List of banks to test with 
  - Sophtron: Sophtron Bank
  - MX: MX Bank
  - Finicity: Finbank
  - Akoya: mikomo