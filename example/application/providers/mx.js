
const {mxInt, mxProd} = require('../configuration')
const {MxVcClient} = require('../serviceClients/mxClient/vc.ts');
const intClient = new MxVcClient(mxInt);
const prodClient = new MxVcClient(mxProd);
const logger = require('../infra/logger.js');

async function getVC(
    vcClient,
    connection_id,
    type,
    userId,
    account_id
  ){
    let path = '';
    switch (type) {
      case 'identity':
        path = `users/${userId}/members/${connection_id}/customers?filters=name,addresses`;
        break;
      case 'accounts':
      case 'banking':
        path = `users/${userId}/members/${connection_id}/accounts`;
        break;
      case 'transactions':
        path = `users/${userId}/accounts/${account_id}/transactions`;
      default:
        break;
    }
    if (path) {
      logger.info(`Getting mx vc ${type}`, path);
      return vcClient.getVC(path).then((vc) => {
        // for data security purpose when doing demo, should remove the connection once vc is returned to client.
        // clearConnection(vc, connection_id, userId);
        // console.log(vc)
        return vc;
      });
    }
    return null;
  }
  module.exports = {
    GetMxIntVc: function(connection_id, type, userId, account_id){
      return getVC(intClient, connection_id, type, userId, account_id);
    },
    GetMxProdVc: function(connection_id, type, userId, account_id){
      return getVC(prodClient, connection_id, type, userId, account_id);
    }
  }
