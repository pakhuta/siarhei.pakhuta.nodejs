const config = require('./config');
const models = require('./models');

console.log(`Application: "${config.name}" has been started`);

let user1 = new models.User();
let product1 = new models.Product();
