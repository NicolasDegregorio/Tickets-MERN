import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const institutionSchema = new Schema ({
    name: {type: String, required:[true, 'El Nombre Es Obligatorio']},
    address: {type: Object},
    cue: {type: Number}
})

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution