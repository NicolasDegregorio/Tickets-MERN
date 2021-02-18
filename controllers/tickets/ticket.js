// importar el modelo nota
import Ticket from '../../models/ticket';
import User from '../../models/user';
import mongoose from 'mongoose'

// Agregar un ticket
const addTicket = async(req, res) => {
  const body = req.body; 
  console.log(body) 
  try {
    const ticketDb = await Ticket.create(body);
    const newTicket = await ticketDb.populate('team._user').populate('institution').execPopulate()
    console.log(newTicket)
    res.status(200).json(newTicket); 
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

// Ver una nota
const getTicket = async(req, res) => {
  const _id = req.params.id;
  try {
    const ticketDb = await Ticket.findOne({_id}).populate('team._user').populate('comments._user').populate('institution');
    console.log(ticketDb[0])
    res.json(ticketDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

// Get con todos los documentos
const getTickets =  async(req, res) => {
  const usuarioId = req.query.usuarioId
  console.log(usuarioId)
  try {
    const user = await User.find({_id: usuarioId })
    const today = new Date()
    console.log(user[0].role)
    if (user[0].role === 'Admin') {
      const ticketDb = await Ticket.find().populate('team._user').populate('institution');
      const ticketsAll = await Ticket.countDocuments()
      const ticketsSolved = await Ticket.countDocuments({ status: 'Solucionado' })
      const ticketsUnsolved = await Ticket.countDocuments({status : 'Sin Solucionar'})
      const ticketsExpired = await Ticket.countDocuments({status : 'Sin Solucionar', end_date : {$lte: today}})
      res.json({data: ticketDb, ticketsSolved: ticketsSolved, ticketsUnsolved: ticketsUnsolved, ticketsAll: ticketsAll, ticketsExpired: ticketsExpired });
    }
    if (user[0].role === 'User') {
      const ticketDb = await Ticket.find({'team._user': usuarioId}).populate('team._user').populate('institution');
      const ticketsAll = await Ticket.countDocuments({'team._user': usuarioId})
      const ticketsSolved = await Ticket.countDocuments({ 'team._user': usuarioId, status: 'Solucionado' })
      const ticketsUnsolved = await Ticket.countDocuments({'team._user': usuarioId, status : 'Sin Solucionar'})
      const ticketsExpired = await Ticket.countDocuments({'team._user': usuarioId, status : 'Sin Solucionar', end_date : {$lte: today}})
      res.json({data: ticketDb, ticketsSolved: ticketsSolved, ticketsUnsolved: ticketsUnsolved, ticketsAll: ticketsAll, ticketsExpired: ticketsExpired });
    }
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

const getResolvedTickets = async (req,res) =>{
  try {
    const tickets = await Ticket.find({$and:[{'status': "Sin Solucionar"}, {'solution': { $ne: "" }}]}).populate('team._user')
    const countTickets = await Ticket.countDocuments({'solution': { $ne: "" }}).populate('team._user')
    res.json({data: tickets, count: countTickets  });
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
}

// tickets agrupados entre un rango de fechas
const rangeDate = async (req,res) =>{
  const ObjectId = mongoose.Types.ObjectId;
  const usuarioId = req.query.usuarioId;
  const start_date = new Date(req.query.startDate);
  const end_date = new Date(req.query.endDate);
  const role = req.query.role;
  
  try {
      const ticketDb = await Ticket.aggregate(
        [
          role === 'Admin'?
          {
            $match:{
                      start_date : {$gte : start_date, $lte: end_date}
            }
          }
          :
          {
            $match:{
                      team:  {$elemMatch: {_user : ObjectId(usuarioId)}},
                      start_date : {$gte : start_date, $lte: end_date}
            }
          },
          {
            $group:{
              _id : {anio: {$year : "$start_date"}, mes: {$month: "$start_date"}} ,
              solucionado: {
                            "$sum": {
                                  "$cond":[
                                      { "$eq":["$status", "Solucionado"]},1,0
                                    ]
                              }    
                            },
              noSolucionado: {
                "$sum": {
                      "$cond":[
                          { "$eq":["$status", "Sin Solucionar"]},1,0
                        ]
                  }    
                }
            } 
          }     
        ]
      )
      console.log(usuarioId)
    res.json(ticketDb)
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error: error
    })
  }

}


// Get con todos los documentos paginados
const paginate = async(req, res) => {
  try {
    const skip = parseInt(req.query.skip)
    const limit = parseInt(req.query.limit)
    const ticketDb = await Ticket.find().skip(skip).limit(limit)
    res.json(ticketDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

//  eliminar una nota
const deleteTicket = async(req, res) => {
  const ids = req.body;
  try {
    await Ticket.deleteMany(
      {
        _id: {$in: ids},
      })
    res.status(200).json({mensaje: "Tickets Borrados Exitosamente"});  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

const updateTicket =  async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  console.log(body)
  try {
    const ticketDb = await Ticket.findByIdAndUpdate(
      _id,
      body,
      {new: true}
    );
    const ticketUpdate = await ticketDb.populate('team._user').populate('institution').execPopulate()
    console.log(ticketUpdate)
    res.json(ticketDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
};

const addComment = async (req,res ) => {
  const ticketId = req.body.ticketId
  const userId = req.body.userId
  const comment = req.body.comment

  try {
    const commentPush = await Ticket.findOneAndUpdate(
      {_id: ticketId},
        { $push: {"comments":
          {"_user" : userId, "comment": comment}
        }},
      {new: true}
    ).populate('comments._user')
    res.json(commentPush)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error
    })
  }
}

const deleteComment = async (req,res) => {
  const ticketId = req.query.ticketId
  const commentId = req.query.commentId
  console.log(commentId)
  try {
    await Ticket.update(
      {_id: ticketId},
        { $pull: {comments:
          {"_id" :  commentId}
        }}
    )
    res.status(200).json({
      mensaje: "Comentario Eliminado Correctamente"
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error
    })
  }
}

const addMembersTeam = async (req,res) => {
  const ticketId = req.body.ticketId
  const membersTeam = req.body.members
  console.log(membersTeam)
  try {
    const membersPush  = await Ticket.findOneAndUpdate(
      {_id: ticketId},
        { $push: {"team":
          membersTeam.map( member => 
            ({"_user" :  member._id , role: 'Support'})
          )
        }},
      {new: true}
    ).populate('team._user')
    res.json(membersPush)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error
    })
  }
}

const deleteMemberTeam = async (req,res) => {
  const ticketId = req.query.ticketId
  const userId = req.query.userId
  console.log(userId)
  try {
    const membersDelete  = await Ticket.findOneAndUpdate(
      {_id: ticketId},
        { $pull: {team:
          {"_user" :  userId, "role" : "Support"}
        }},
      {new: true}
    ).populate('team._user')
    res.json(membersDelete)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error
    })
  }
}
const solvedTicket = async (req,res) =>{
  const solution = req.body.solution
  const ticketId = req.body.ticketId
  
  try {
    await Ticket.updateOne(
      {_id : ticketId},
      {$set: {"solution": solution}}
    )
    res.status(200).json({
      mensaje: "Situacion del Ticket Actualizada Correctamente"
    })  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
}

const closeTicket = async (req,res) => {
  const ticketId = req.body.ticketId
  try {
    await Ticket.updateOne(
      {_id : ticketId},
      {$set: {"status": "Solucionado"}}
    )
    res.status(200).json({
      mensaje: "Situacion del Ticket Actualizada Correctamente"
    })  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }

}
module.exports = { addTicket, getTicket, getTickets, deleteTicket, updateTicket, addComment, rangeDate, addMembersTeam, deleteMemberTeam, deleteComment, solvedTicket , closeTicket, getResolvedTickets };
