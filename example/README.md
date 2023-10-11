# A demo server as an example of embeding the universal-connect-widget

- Fill in the required credentials in [application/config.js](application/config.js).
  `NOTE: please use envrionment variables to provide the api secrets` variable names are the keys in the `config.js`
- Build and run the docker image.
- Or `npm i` and `npm run start` in `application` folder to get the server up
- Browse `http://localhost:8088/loader.html?env=<url to the hosted widget>`
- An hosted example can be found [here](https://demo.sophtron.com/loader.html?env=https://universalwidget.sophtron-prod.com)
