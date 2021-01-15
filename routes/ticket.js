import express from 'express';

// importar el controllador  ticket
import ticketController from '../controllers/tickets/ticket'
import pdf from '../controllers/tickets/pdf'

import middlewares from '../middlewares/autenticacion'


const router = express.Router();
// Agregar una nota
router.post('/nuevo-ticket', middlewares.verificarAuth, middlewares.isAdmin, ticketController.addTicket);

// Get un Solo Ticket
router.get('/ticket/:id', ticketController.getTicket);

// Get con todos los documentos
router.get('/ticket', middlewares.verificarAuth, ticketController.getTickets);

// ticket por rango de fechas
router.get('/range-date', middlewares.verificarAuth, ticketController.rangeDate);

//pdf
router.post('/pdf', pdf.prueba)

// Get con todos los documentos paginados
router.get('/paginate', async(req, res) => {
  try {
    const skip = parseInt(req.query.skip)
    const limit = parseInt(req.query.limit)
    const notaDb = await Nota.find().skip(skip).limit(limit)
    res.json(notaDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Delete eliminar una nota
router.post('/ticket/delete/many', middlewares.verificarAuth, middlewares.isAdmin, ticketController.deleteTicket);

// Actualizar ticket
router.put('/ticket/:id', middlewares.verificarAuth, middlewares.isAdmin, ticketController.updateTicket);

// Agregar Comentario a un Ticket
router.post('/ticket/comment', middlewares.verificarAuth, ticketController.addComment);

//Borra un comentario de un Ticket
router.delete('/ticket/comment/deleteComment', middlewares.verificarAuth, ticketController.deleteComment)

// Agrega un miembro al equipo encargado del Ticket
router.post('/ticket/team/addMembersTeam', ticketController.addMembersTeam)

// Elimina un Miembro del equipo encargado del Ticket
router.delete('/ticket/team/deleteMembersTeam', ticketController.deleteMemberTeam)

// modifica el campo solution por parte de un usuario para qu despues el administrador verifique si el ticket esta solucionado
router.post('/ticket/solution/change',middlewares.verificarAuth, ticketController.solvedTicket)
// Devuelve todos los tickets marcados como solucionado por el encargado, para su auditoria
router.get('/ticket/solution/pending', middlewares.verificarAuth, middlewares.isAdmin, ticketController.getResolvedTickets)
// ruta para que el administrador apruebe la solucion del ticket
router.post('/ticket/solution/aprobed', middlewares.verificarAuth, middlewares.isAdmin, ticketController.closeTicket)
// Exportamos la configuración de express app
module.exports = router;