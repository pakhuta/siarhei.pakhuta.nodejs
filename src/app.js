import * as models from './models';
import config from './config';

console.log(`Application: "${config.name}" has been started`);

let user1 = new models.User();
let product1 = new models.Product();
