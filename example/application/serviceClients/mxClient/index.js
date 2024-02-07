const logger = require("../../infra/logger");
const http = require("../../infra/http");
const MxBaseClient = require("./base.ts");

module.exports = class MxClient extends MxBaseClient {
  constructor(apiConfig) {
    super(apiConfig);
  }
};
