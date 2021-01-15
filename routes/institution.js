import express from 'express'
import institutionController from '../controllers/institutions/institution'
import middlewares from '../middlewares/autenticacion'

const router = express.Router();

router.get('/institutions', institutionController.getInstitutions);

router.post('/institutions',middlewares.verificarAuth, middlewares.isAdmin, institutionController.addInstitution);

router.put('/institutions/:id', middlewares.verificarAuth, middlewares.isAdmin, institutionController.updateInstitution);

router.post('/institutions/delete/many',middlewares.verificarAuth, middlewares.isAdmin, institutionController.deleteInstitutions);


module.exports = router;
