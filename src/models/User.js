const mongoose = require('mongoose')
const { Schema} = mongoose
const bcrypt = require('bcryptjs') //encriptar contraseña

const UserSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}

})

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash;
}
//tomar contraseña y compararla con la base de datos
// //Se usa la funcion normal porque si se usa la flecha no se puede llamar a las propiedades del 
//useSchema
UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

module.exports= mongoose.model('User', UserSchema)