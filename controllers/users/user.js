import bcrypt from 'bcrypt'
import User from '../../models/user'
import jwt from 'jsonwebtoken'


const addUser =  async (req,res) => {
  const saltRound = 10
  const body = {
      nombre : req.body.name,
      lastName : req.body.lastName,
      role: req.body.role,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRound)
  }

  try {
      const userDb = await User.create(body)
      return res.json(userDb)
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ocurrio un error',
          error
        })
  }
}

const updateUser = async (req, res) =>{
  const saltRound = 10
  const _id = req.params.id;
  const body = req.body;
  let user = {}
  if(body.password !== ''){
     user = {
      nombre : req.body.name,
      lastName : req.body.lastName,
      role: req.body.role,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRound)
    }
  }else{
     user = {
      nombre : req.body.name,
      lastName : req.body.lastName,
      role: req.body.role,
      email: req.body.email,
    }
  }
  try {
    const userDb = await User.findByIdAndUpdate(
      _id,
      user,
      {new: true}
    );
    res.status(200).json(userDb)
  } catch (error) {
    res.status(400).json({
      mensaje : "Ocurrio un error",
      error
    })
  }
}

const deleteUsers = async(req, res) => {
  const ids = req.body;
  try {
    await User.deleteMany(
      {
        _id: {$in: ids},
      })
    res.status(200).json({mensaje: "Usuarios Borrados Exitosamente"});  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

const login =  async(req, res) => {

    let body = req.body;
  
    try {
      // Buscamos email en DB
      const usuarioDB = await User.findOne({email: body.email});
  
      // Evaluamos si existe el usuario en DB
      if(!usuarioDB){
        return res.status(400).json({
          mensaje: 'Usuario o contraseña inválidos',
        });
      }
  
      // Evaluamos la contraseña correcta
      if( !bcrypt.compareSync(body.password, usuarioDB.password) ){
        return res.status(400).json({
          mensaje: 'Usuario o contraseña! inválidos',
        });
      }

      //token
      const token = jwt.sign({
        data: usuarioDB
        }, process.env.API_KEY, { expiresIn: process.env.TOKEN_EXPIRES_IN }) // Expira en 30 días
  
      // Pasó las validaciones
      return res.json({
        token: token,
        role: usuarioDB

      })
      
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      });
    }
  
  };

  const getUsers = async (req, res) => {
    try {
      const users = await User.find()
      return res.json(users)
    } catch (error) {
        return res.status(400).json({
          mensaje: "Ocurrio un Error",
          error
        })
    }


  };

  module.exports = {login, getUsers, addUser, updateUser, deleteUsers};