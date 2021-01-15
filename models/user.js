import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre : { type: String, required:[true, 'El nombre es obligatorio']},
    lastName: { type: String, required:[true, 'El Apellido es obligatorio']},
    email : {type: String, unique: true, required:[true, 'El email es obligatorio']},
    password: {type: String, required:[true, 'La contraseña es obligatoria']},
    role: {type: String, enum: ['Admin', 'User'], required: [true, 'Rol Obligatorio']}

})

// Eliminar pass de respuesta JSON
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }

const User = mongoose.model('User', userSchema)

export default User