
const {sophtron} = require('../configuration')
const SophtronVcClient = require('../serviceClients/sophtronClient/vc');
const vcClient = new SophtronVcClient(sophtron)
module.exports = async  function GetVc(
    connection_id,
    type,
    userId
  ){
    let path = '';
    switch (type) {
      case 'identity':
        path = `customers/${userId}/members/${connection_id}/identity?filters=name,addresses`;
        break;
      case 'accounts':
        path = `customers/${userId}/members/${connection_id}/accounts`;
        break;
      case 'transactions':
        throw new Error('Not Implemented')
      default:
        break;
    }
    if (path) {
      return vcClient.getVC(path).then((vc) => {
        // for data security purpose when doing demo, should remove the connection once vc is returned to client.
        // clearConnection(vc, connection_id, userId);
        return vc;
      });
    }
    return null;
  }
