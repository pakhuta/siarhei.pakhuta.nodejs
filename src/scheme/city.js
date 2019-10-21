import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    capital: {
        type: Boolean,
        required: true,
        validate: {
            validator(isCapital) {
                if (!isCapital) {
                    return true;
                }

                return new Promise(resolve => {
                    mongoose.model('cities')
                        .find({ country: this.country, capital: true })
                        .exec((err, cities) => {
                            resolve(!cities.length);
                        });
                });
            },
            message: 'Invalid value of field "capital"'
        },
    },
    location: {
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    },
    lastModifiedDate: { type: Date, default: Date.now }
});

export default CitySchema;
