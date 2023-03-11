const fs = require('fs');
const path = require('path');

const apiDocs = {}

fs.readdirSync(path.join(__dirname))
    .filter(file => file.indexOf('.') !== 0  && file.slice(-3) === ".js")
    .forEach(apiFile => {
      if (apiFile.split('.')[0] === "index") {
        console.log("pass index api");
      } else {
        const apiJsFile = require(`./${apiFile.split('.')[0]}`);
        apiDocs[Object.keys(apiJsFile)[0]] = apiJsFile[Object.keys(apiJsFile)[0]];
      }
		});


module.exports = apiDocs;