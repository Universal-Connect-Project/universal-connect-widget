const {akoyaProd, akoyaSandbox} = require('../configuration')
const AkoyaClient = require('../serviceClients/akoyaClient');
const vcClient = new AkoyaClient(akoyaProd)

module.exports = async function GetVc(
  connection_id,
  type,
  userId
){
  let token = await vcClient.getIdToken(userId)
  switch(type){
    case 'identity':
      let customer = await vcClient.getCustomerInfo(connection_id, token.id_token);
      return {credentialSubject: {customer}};
    case 'accounts':
      let accounts = await vcClient.getAccountInfo(connection_id, [], token.id_token);
      return {credentialSubject: {accounts}};
    case 'transactions':
      let allAccounts = await vcClient.getAccountInfo(connection_id, [], token.id_token);
      let accountId = (Object.values(allAccounts[0])[0]).accountId;
      const transactions = await vcClient.getTransactions(connection_id, accountId, token.id_token);
      return {credentialSubject: {transactions}};
  }
}
