import express from 'express'
import userController from '../controllers/users/user'
import middlewares from '../middlewares/autenticacion'

const router = express.Router();

router.post('/', userController.login );

router.get('/users', middlewares.verificarAuth, userController.getUsers);

router.post('/users', middlewares.verificarAuth, middlewares.isAdmin, userController.addUser);

router.put('/users/:id', middlewares.verificarAuth, middlewares.isAdmin, userController.updateUser);

router.post('/users/delete/many', middlewares.verificarAuth, middlewares.isAdmin, userController.deleteUsers);

// Exportamos la configuración de express app
module.exports = router;