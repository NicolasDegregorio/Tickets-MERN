import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
require('dotenv').config()

const app = express();




// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mongo Db
const uri =  'mongodb+srv://nicodeg:uefuoFLTz3ZUdTcU@nicodeg.5lpqt.mongodb.net/sigef?retryWrites=true&w=majority'

const options = {useNewUrlParser: true, useCreateIndex: true}

mongoose.connect(uri, options).then(
    () => { console.log('Conectado a DB') },
    err => { console.log(err) }
  );

// Rutas
app.use('/api', require('./routes/ticket'));
app.use('/users', require('./routes/user'));
app.use('/institutions', require('./routes/institution'));
app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.set('puerto', process.env.PORT || 5000);
app.listen(app.get('puerto'), () => {
  console.log('Example app listening on port'+ app.get('puerto'));
});