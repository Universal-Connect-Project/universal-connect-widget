const config = require('../config');
const CryptoJS = require("crypto-js");
const crypto = require('crypto');

function hmac(text, key){
  let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, CryptoJS.enc.Base64.parse(key));
  hmac.update(text);
  return CryptoJS.enc.Base64.stringify(hmac.finalize());
}

function buildSophtronAuthCode(httpMethod, url, apiUserID, secret){
  let authPath = url.substring(url.lastIndexOf('/')).toLowerCase();
  let text = httpMethod.toUpperCase() + '\n' + authPath;
  let b64Sig = hmac(text, secret);
  let authString = 'FIApiAUTH:' + apiUserID + ':' + b64Sig + ':' + authPath;
  return authString;
}

const algorithm = config.CryptoAlgorithm;

function encrypt(text, keyHex, ivHex) {
  if (!text) {
    return '';
  }
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex'); 
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

function decrypt(text, keyHex, ivHex) {
  if (!text) {
    return '';
  }  
  const key = Buffer.from(keyHex, 'hex'); 
  const iv = Buffer.from(ivHex, 'hex'); 
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function decodeAuthToken(input){
  try{
    let str = Buffer.from(input, 'base64').toString('utf-8');
    let arr = str.split(';');
    if(arr.length !== 3){
      return input;
    }
    return {
      provider: arr[0],
      token: arr[1],
      iv: arr[2]
    }
  }catch(err){
    return input;
  }
}

function mapJobType(input){
  switch (input) {
    case 'agg':
    case 'aggregation':
    case 'aggregate':
    case 'add':
    case 'utils':
    case 'util':
    case 'demo':
    case 'vc_transactions':
    case 'vc_transaction':
      return 'aggregate';
    case 'all':
    case 'everything':
    case 'aggregate_all':
    case 'aggregate_everything':
    case 'agg_all':
    case 'agg_everything':
      return 'aggregate_identity_verification';
    case 'fullhistory':
    case 'aggregate_extendedhistory':
      return 'aggregate_extendedhistory';
    case 'auth':
    case 'bankauth':
    case 'verify':
    case 'verification':
    case 'vc_account':
    case 'vc_accounts':
      return 'verification';
    case 'identify':
    case 'vc_identity':
      return 'aggregate_identity';
    default:
      return 'aggregate'
  }
}

fileReadCache = {
  content: '',
  time: new Date('1900-01-01')
}

module.exports = {
  encrypt,
  decrypt,
  hmac,
  buildSophtronAuthCode,
  decodeAuthToken,
  mapJobType,
}
