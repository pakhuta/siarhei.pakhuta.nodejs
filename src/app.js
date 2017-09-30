import * as models from './models';
import * as services from './services';
import config from './config';

console.log(`Application: "${config.name}" has been started`);

let user1 = new models.User();
let product1 = new models.Product();
let dirWatcher = new services.DirWatcher();
let importer = services.Importer;

console.log(user1, product1);

dirWatcher.on('dirwatcher:changed', async path => {
    try {
        console.log(await importer.import(path));
    } catch (err) {
        console.log(err);
    }
});

dirWatcher.on('dirwatcher:changed', path => {
    try {
        console.log(importer.importSync(path));
    } catch (err) {
        console.log(err);
    }
});

dirWatcher.watch(`${__dirname}/data`, 3000);
