const config = require('../../config');
const CryptoJS = require("crypto-js");

function buildSophtronAuthCode(httpMethod, url){
  var authPath = url.substring(url.lastIndexOf('/')).toLowerCase();
  var text = httpMethod.toUpperCase() + '\n' + authPath;
  let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, CryptoJS.enc.Base64.parse(config.SophtronApiUserSecret));
  hmac.update(text);
  var b64Sig = CryptoJS.enc.Base64.stringify(hmac.finalize());
  var authString = 'FIApiAUTH:' + config.SophtronApiUserId + ':' + b64Sig + ':' + authPath;
  return authString;
}

module.exports = {
  buildSophtronAuthCode,
}