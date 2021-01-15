import jwt from 'jsonwebtoken'


const verificarAuth = (req, res, next) => {

  // Leer headers
  let token = req.headers.token;
  jwt.verify(token, process.env.API_KEY , (err, decoded) => {

    if(err) {
      return res.status(401).json({
        mensaje: 'Error de token',
        err
      })
    }

    // Creamos una nueva propiedad con la info del usuario
    req.usuario = decoded.data; //data viene al generar el token en login.js
    next();

  });

}

const isAdmin = (req, res, next) => {

  let rol = req.usuario.role;
  
  if(rol !== 'Admin'){
    return res.status(401).json({
      mensaje: 'Rol no autorizado!'
    })
  }
  
   next();

}



module.exports = {verificarAuth, isAdmin};