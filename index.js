const app = require('./app');
const fs = require('fs');
let data = {};

(async () => {
    data = await app.categories()
    for (let index = 0; index < data.categories.length; index++) {
        data.categories[index] = await app.subcategories(data.categories[index]);
        debugger;
    }

    console.log(data)
        
})()
