const {finicityProd, finicitySandbox} = require('../configuration')
const FinicityClient = require('../serviceClients/finicityClient');
const vcClient = new FinicityClient(finicityProd)
const { finicity: mapper } = require('../adapters')

module.exports = async function GetVc(
  connection_id,
  type,
  userId
){
  let accounts = await vcClient.getCustomerAccountsByInstitutionLoginId(userId, connection_id);
  let accountId = accounts?.[0].id;
  switch(type){
    case 'identity':
      let customer = await vcClient.getAccountOwnerDetail(userId, accountId);
      let identity = mapper.mapIdentity(userId, customer)
      return {credentialSubject: { customer: identity}};
    case 'accounts':
      return {credentialSubject: { accounts: accounts.map(mapper.mapAccount)}};
    case 'transactions':
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30))
      const transactions = await vcClient.getTransactions(userId, accountId, startDate, new Date());
      return {credentialSubject: {transactions: transactions.map((t) => mapper.mapTransaction(t, accountId))}};
  }
}