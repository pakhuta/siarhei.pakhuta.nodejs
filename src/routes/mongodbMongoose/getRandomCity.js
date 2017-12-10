import * as Mongodb from '../../services/mongoDB';

export default async function getRandomCityMongoose(req, res) {
    let randomCity = await Mongodb.Mongoose.getRandomCity();
    res.send(randomCity);
}
