const config = require("../../config");
const logger = require("../../infra/logger");
const http = require("../../infra/http");
const MxBaseClient = require("./base.ts");
const MXClient = require("./index.js");

const CryptoJS = require("crypto-js");

module.exports = class MxVcClient extends MxBaseClient {
  constructor(apiConfig) {
    super(apiConfig);
  }

  async getVC(path) {
    // console.log("apiConfig", this.apiConfig);
    const encodedAuth = CryptoJS.enc.Utf8.parse(
      `${this.apiConfig.username}:${this.apiConfig.password}`,
    );
    const authHeader = "Basic " + CryptoJS.enc.Base64.stringify(encodedAuth);

    const headers = {
      Accept: "application/vnd.mx.api.v1beta+json",
      Authorization: authHeader,
    };
    const vcResponse = await http.get(
      `${this.apiConfig.vcEndpoint}vc/${path}`,
      headers,
    );
    return vcResponse?.verifiableCredential || vcResponse;
  }
};
