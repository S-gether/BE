const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const Swagger = require("../handler/swagger");
const fs = require('fs');
const path = require('path');

const apiDocIndexes = {}
fs.readdirSync(path.join(__dirname,"/api"))
    .forEach(folder => {
      const indexFile = require(`../docs/api/${folder}/index`);
      Object.keys(indexFile).forEach( key => {
        apiDocIndexes[key] = indexFile[key];
      });
		});


class ApiDocs {
  #apiDocOption;
  #swagger;

  constructor() {
    /**this.#apiDocOption = {
      ...auth,
    }; */
    this.#apiDocOption = 
    {
      ...apiDocIndexes
    };

    this.#swagger = new Swagger();
  }

  init() {
    this.#swagger.addAPI(this.#apiDocOption);
  }

  getSwaggerOption() {
    const { apiOption, setUpoption } = this.#swagger.getOption();

    const specs = swaggerJsDoc(apiOption);

    return {
      swaggerUI,
      specs,
      setUpoption,
    };
  }
}

module.exports = ApiDocs;