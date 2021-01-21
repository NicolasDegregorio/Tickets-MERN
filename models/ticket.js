import mongoose from 'mongoose';
const Schema = mongoose.Schema;



const ticketSchema = new Schema({
  institution: {type: Schema.Types.ObjectId, ref: 'Institution'},
  description: {type: String},
  team: [{
    _user :{
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {type: String, enum: ['Leader', 'Support'], required: [true, 'Rol Obligatorio']}
  }],
  start_date:{type: Date, default: Date.now},
  end_date:{type: Date},
  comments: [{
    _user :{
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: {type: String}
  }],
  solution:{type: String, default: ''},
  priority:  {type: String, enum: ['Alta', 'Media', 'Baja'], required: [true, 'Priodridad Obligatorio']},
  status: {type: String, enum: ['Solucionado', 'Sin Solucionar'], required: [true, 'Estado Obligatorio']}
});


ticketSchema.set('toObject', { virtuals: true })
ticketSchema.set('toJSON', { virtuals: true })


ticketSchema.virtual('active') 
  .get(function (){
    const today = new Date()
    const endDate = this.end_date;
    if (endDate > today){
      return true
    }
    else{
      return false
    }
  })
  

// Convertir a modelo
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;