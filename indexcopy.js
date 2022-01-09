const app = require('./app');
const fs = require('fs');
let data = {};

(async () => {
    data = await app.products({
        url: 'https://www.fitoagricola.net/tienda-online/Catalog/listing/herbicidas-agricolas-42273/1',
        subcategory: 'sfdsdfsdf',
        products: []
      })
    console.log(data)
        
})()
