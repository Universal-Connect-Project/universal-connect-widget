const fs = require('fs');

async function readFile(path){
  return new Promise((resolve, reject) => {
    if(fileReadCache.content){
      let currentTime = new Date();
      var difference = currentTime.getTime() - fileReadCache.time.getTime(); 
      var resultInSeconds = Math.round(difference / 1000);
      if(resultInSeconds <= 30){
        resolve(fileReadCache.content)
        return
      }
    }
    fs.readFile(
      path, 
      'utf8', 
      (err, content) => {
        if(err){
          reject(err);
        }
        fileReadCache.time = new Date();
        resolve(content);
      }
    );
  })
}

module.exports = {
  readFile
}