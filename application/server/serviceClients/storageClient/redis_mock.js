module.exports = {
  createClient(){
    return {
      connect(){
        return Promise.resolve('mocked')
      }
    }
  }
}