import * as models from './models';
import config from './config';

console.log(`Application: "${config.name}" has been started`);

let user1 = new models.User();
let product1 = new models.Product();
let dirWatcher = new models.DirWatcher();
let importer = models.Importer;

dirWatcher.on('dirwatcher:changed', path => {
    importer.import(path)
        .then(jsonData => {
            console.log(jsonData);
        })
        .catch(console.log);

    try {
        console.log(importer.importSync(path));
    } catch (err) {
        console.log(err);
    }
});

dirWatcher.watch('data', 3000);
