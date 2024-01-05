
const {sophtron} = require('../configuration')
const SophtronVcClient = require('../serviceClients/sophtronClient/vc');
const vcClient = new SophtronVcClient(sophtron)
module.exports = {
  GetSophtronVc: async function(
    connection_id,
    type,
    userId,
    account_id
  ){
    let path = '';
    switch (type) {
      case 'identity':
        path = `customers/${userId}/members/${connection_id}/identity?filters=name,addresses`;
        break;
      case 'accounts':
      case 'banking':
        path = `customers/${userId}/members/${connection_id}/accounts`;
        break;
      case 'transactions':
        path = `customers/${userId}/accounts/${account_id}/transactions`;
      default:
        break;
    }
    if (path) {
      return vcClient.getVC(path).then((vc) => {
        // for data security purpose when doing demo, should remove the connection once vc is returned to client.
        // clearConnection(vc, connection_id, userId);
        // console.log(vc)
        return vc;
      });
    }
    return null;
  }
}

