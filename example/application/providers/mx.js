const {mxProd} = require('../configuration')
const MxVcClient = require('../serviceClients/mxClient/vc.ts');
const vcClient = new MxVcClient(mxProd)

console.log('---------------', mxProd)
module.exports = async function GetVc(
  connection_id,
  type,
  userId
){
  console.log('GetVc', connection_id, type, userId)
  let path = '';
    switch (type) {
      case 'identity':
        path = `users/${userId}/member/${connection_id}/customers?fields[customer]=customerId,name,addresses,email,telephones,accounts`;
        break;
      case 'accounts':
      case 'banking':
        path =  `users/${userId}/members/${connection_id}/accounts`;
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
        // console.log(vc)
        return vc;
      });
    }
    return null;
}
