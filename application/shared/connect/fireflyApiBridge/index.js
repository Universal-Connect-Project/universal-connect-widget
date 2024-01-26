const { ConnectApi } = require('../../../server/connect/connectApi');
const config = require('../../../server/config');

let context = {
  user_id: config.MxDemoUserId
};
let api = new ConnectApi({context})

async function sendStubData(fileName){
  return new Promise((resolve, reject) => {
    const data = require(`services/stubs/${fileName}`)
    resolve(data)
  })
}
const stub = {
  loadMaster: () => sendStubData('data_master'),
  loadTransactionRules: () => sendStubData('transaction_rules'),
  instrumentation: () => sendStubData('instrumentation'),
  loadUserFeatures: () => sendStubData('user_features'),
  createAnalyticsSession: () => sendStubData('analytics_sessions'),
  loadJob: (guid) => Promise.resolve({
    guid,
    job_type: 0, // must
  }),
  //loadPopularInstitutions: () => sendStubData('favorite'),
  
  extendSession: () => Promise.resolve(''),
  loadOffer: () => Promise.resolve(''),
  dismissOffer: () => Promise.resolve(''),
  loadAgreement: () => Promise.resolve(''),
  createNewFeatureVisit: () => Promise.resolve(''),
  closeFeatureVisit: () => Promise.resolve(''),
  sendAnalyticsPageview: () => Promise.resolve(''),
  sendAnalyticsEvent: () => Promise.resolve(''),
  closeAnalyticsSession: () => Promise.resolve(''),
  logout: () => Promise.resolve(''),
}
let bridge = {...stub};
for(const name of Object.getOwnPropertyNames(Object.getPrototypeOf(api))){
  bridge[name] = () => api[name]
}
module.exports = new Proxy(bridge, {
  get(target, prop) {
    if(stub[prop]){
      return async function(){
        console.log(`Calling stub method: ${prop}`)
        const ret = await stub[prop].apply(null, arguments)
        console.log(JSON.stringify(ret))
        return ret;
      }
    }
    if(api[prop]){
      return async function(){
        console.log(`Calling api method: ${prop}`)
        try{
          const ret = await api[prop].apply(api, arguments)
          //console.log(JSON.stringify(ret))
          switch(prop){
            case 'loadTransactionRules':
              return ret.transaction_rules
            case 'addMember':
              return ret;
            case 'loadMemberByGuid':
            case 'updateMember':
              return ret.member;
            case 'loadMembers':
              return ret;
            case 'getInstitutionCredentials':
            case 'getMemberCredentials':
              return ret.credentials;
            case 'loadAccountsByMember':
              return ret.accounts;
            case 'loadAccounts':
              return {
                accounts: ret.accounts,
                members: ret.members,
              }
            case 'loadInstitutionByGuid':
            case 'loadInstitutionByCode':
              return {
                ...ret.institution,
                // Remove extra level of nesting
                credentials: ret.institution.credentials.map(credential => credential.credential),
              }
            case 'loadJob':
              return ret.job;
            };
          return ret;
        }catch(err){
          console.log(err.message || JSON.stringify(err));
        }
      }
    }
    if(prop !== '$$typeof'){
      console.log(`Unstubbed method retrieved ${prop}`)
    }
    return function() {
      console.log(`Unstubbed method called ${prop}`)
      return Promise.resolve('')
    }
  }
})
