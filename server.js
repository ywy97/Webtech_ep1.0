const express = require('express'),
bodyParser = require('body-parser'),
Sequelize = require('sequelize')

const sequelize = new Sequelize('dbBibliografi','root','',{
    dialect: 'mysql',
    define: {
        timestamps:false
    }
})

const Bibliografie = sequelize.define('bibliografi', {
    autor : {
        type: Sequelize.STRING
    },
    titlu : {
        type : Sequelize.STRING
    },
    editura : {
        type : Sequelize.STRING
    }
})

Bibliografie.sync();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/create', (req,res,next) => {
    sequelize.sync({force:true})
     .then(() => res.status(201).send('created'))
    .catch((err) => next(err))
})

app.get('/bibliografi', (req,res,next)=> {
    Bibliografie.findAll()
    .then((bibliografi) => res.status(200).json(bibliografi))
    .catch((err) => next(err))
})

app.post('/bibliografi', (req, res) => {
  console.log(req.body.autor); 
  console.log(req.body.titlu); 
  console.log(req.body.editura); 
  Bibliografie.create(req.body)
    .then(() => res.status(201).send('created'))
    .catch((error) => {
      console.warn(error)
      res.status(500).send('some error...')
      
    })
})

app.get('/bibliografi/:id', (req, res, next) => {
  Bibliografie.findById(req.params.id) .then((bibliografi) => {
      if (bibliografi){
        res.status(200).json(bibliografi)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((err) => next(err))
})



app.put('/bibliografi/:id', (req, res, next) => {
  Bibliografie.findById(req.params.id)
    .then((bibliografi) => {
      if (bibliografi){
        return bibliografi.update(req.body, {fields : ['name', 'year', 'rating']})
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('modified')
      }
    })
    .catch((err) => next(err))
})

app.delete('/bibliografi/:id', (req, res, next) => {
  Bibliografie.findById(req.params.id)
    .then((bibliografi) => {
      if (bibliografi){
        return bibliografi.destroy()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('removed')
      }
    })
    .catch((err) => next(err))
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('some error')
})

app.listen(8080)