import * as Mongodb from '../../services/mongoDB';

export default async function getRandomCityNative(req, res) {
    let randomCity;

    try {
        let mongodb = new Mongodb.MongodbNative();
        randomCity = await mongodb.getRandomCity();
    } catch (err) {
        randomCity = null;
    }

    res.send(randomCity);
}
