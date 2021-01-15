import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const institutionSchema = new Schema ({
    name: {type: String, required:[true, 'El Nombre Es Obligatorio']},
    addres: {type: String},
    cue: {type: Number}
})

const Institution = mongoose.model('Intitution', institutionSchema);

export default Institution