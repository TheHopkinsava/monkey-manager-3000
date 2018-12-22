const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express()
const models = require('./models');
const path = require('path');
const pug = require('pug');
const Sequelize = require('sequelize');

// Decode json and x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Add a bit of logging
app.use(morgan('short'))

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

models.singe.belongsTo(models.enclo);
models.enclo.hasMany(models.singe, { as: "Singes" });

// Get all the users defined
//app.get('/', function (req, res) {
//  models.User.findAll()
//    .then((users) => {
//      res.render('index')
//    })
//})


//avoir les enclos et les singes
app.get('/', function(req, res) {
    var m_singes = [];
    var m_Enclos = [];

    models.singe.findAll()
        .then((singe) => {
            m_singes = singe;
        })
    models.enclo.findAll()
        .then((enclo) => {
            
            m_Enclos = enclo;
        })
        .then(() => {
            res.render('index', { singe: m_singes, enclo: m_Enclos });
        })
        
})

app.get('/getsinges', function(req, res) {
  models.singe.findAll()
    .then((singe) => {
      res.render('getsinge')
    })
    .catch((err) => {
      res.json(err)
    })
})
//creation du singe
app.get('/createsinge', function(req, res) {
    res.render('createsinge')
})

app.post('/postsinge', function (req, res) {
    models.singe.create({
      nomSinge: req.body.nomSinge,
      age: req.body.age,
      espece:req.body.espece,
      poidSinge: req.body.poidSinge,
      sexe:req.body.sexe,
      couleur:req.body.couleur
  })
    .then((singe) => {
        res.render('creationsingefait')
    })
    .catch((err) => {
      res.json(err)
    })
})
app.get('/getsingespm', function (req, res) {
    models.singe.findAll()
        .then((singe) => {
           res.json(singe)
        })

})

app.put('/modifysinge', function(req, res) {
    const promises = [];

    req.body.mutations
      .forEach((item) => {

        promises.push(
          models.singe.update(
            item.data,
            {
              where: {
                id: item.id
              }
            }
          )
        )

      })

      Promise.all(promises)
        .then((response) => {
          res.json(response);
        })
        .catch((err) => {
          res.json(err)
        })
})
app.put('/singemodify/:id', function (req, res) {
    models.singe.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((singe) => {
            res.json(singe)
        })
        
})

app.get('/modifysinge', function(req, res) {
    const promises = [];

    req.body.mutations
      .forEach((item) => {

          promises.push(
            models.singe.update(
              item.data,
              {
                  where: {
                      id: item.id
                  }
              }
            )
          )

      })

    Promise.all(promises)
      .then((response) => {
          res.render('modifsinge')
      })
      .catch((err) => {
          res.json(err)
      })
})


app.delete('/deletesinge', function(req, res) {
  models.singe.destroy({
    where: {
      id: req.body.ids
    }
  })
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      res.json(err)
    })
})

app.get('/postsinge/:id', function(req, res) {
  models.singe.findOne({
    id: req.params.id
  })
    .then((gremelin) => {
      res.render('creationsinge')
    })
    .catch((err) => {
      res.json(err)
    })
})
//modification du singe
app.get('/modifysinge/:id', function (req, res) {
    res.render('modifsinge')
})
app.post('/modifysinge/:id', function (req, res) {
    models.singe.update(
    req.body,
    {
        where: {
            id: req.params.id
        }
    }, { nomSinge: req.body.nomSinge, poidSinge: req.body.poidSinge, espece: req.body.espece,age : req.body.age,sexe:req.body.sexe,couleur:req.body.couleur })
    .then((singe) => {
        res.render('modiffaitsinge', { singe: singe } )
    })
    .catch((err) => {
        res.json(err)
    })
})
//detail du singe
app.get('/getsinge/:id', function (req, res) {
     models.singe.findOne({ where: { id: req.params.id } })
         .then((singe) => {
             res.render('getsinge', { singe: singe });
        })
         .catch((err) => {
            res.json(err)
        })
})

app.delete('/deletesinge/:id', function(req, res) {
  models.singe.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((singe) => {
      res.json(singe)
    })
    .catch((err) => {
      res.json(err)
    })
})
//suppression du singe
app.get('/deletesinge/:id', function(req, res) {
    models.singe.destroy({
        where: {
            id: req.params.id
        }
    })
      .then((response) => {
          res.render("suppressionsinge")
      })
      .catch((err) => {
          res.json(err)
      })
})
//liersinge
app.get('/liersinge/:id', function(req, res){
    var m_Enclos = [];


    models.enclo.findAll()
        .then((enclo) => {

            m_Enclos = enclo;
        })
        .then(() => {
            res.render('liensinge', { id_singe: req.params.id, enclo: m_Enclos });
        })
})

app.get('/liersingeenclos/:id_singe/:id_enclos', function(req, res){
    var Enclos;
    var singe;
    models.singe.findOne({ where: { id: req.params.id_singe } })
        .then((singe) => {
            singe = singe;
        })
    models.enclo.findOne({ where: { id: req.params.id_enclos } })
        .then((enclo) => {
            Enclos = enclo;

            enclo.addSinges(singe);

        })
        .then(() => {


            res.render('liensingeenclos');
        })
})

//creationenclos
app.get('/createenclos', function (req, res) {
    res.render('createenclos')
})

app.post('/postenclos', function (req, res) {
    models.enclo.create({
        NomEnclos: req.body.NomEnclos,
        TypeEnclos: req.body.TypeEnclos,
        Taille: req.body.Taille
    })

        .then(() => {
            res.render('createnclosfait')
        })
})




app.post('/postenclo', function (req, res) {
    models.enclo.create({
        nomEnclos: req.body.nomEnclos,
        typeEnclos: req.body.typeEnclos
    })
        .then((enclo) => {
            res.json(enclo);
        })
        .catch((err) => {
            res.json(err)
        })
})

app.put('/putenclo', function (req, res) {
    const promises = [];

    req.body.mutations
        .forEach((item) => {

            promises.push(
                models.enclo.update(
                    item.data,
                    {
                        where: {
                            id: item.id
                        }
                    }
                )
            )

        })

    Promise.all(promises)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})

app.get('/putenclo', function (req, res) {
    const promises = [];

    req.body.mutations
        .forEach((item) => {
            promises.push(
                models.enclo.update(
                    item.data,
                    {
                        where: {
                            id: item.id
                        }
                    }, {nomEnclos: req.body.nomEnclos, typeEnclos: req.body.typeEnclos,Taille: req.body.Taille})
                )
            

        })

    Promise.all(promises)
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})

app.delete('/deleteenclo', function (req, res) {
    models.enclo.destroy({
        where: {
            id: req.body.ids
        }
    })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            res.json(err)
        })
})
app.get('/deleteenclo', function (req, res) {
    models.enclo.destroy({
        where: {
            id: req.body.ids
        }
    })
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            res.json(err)
        })
})


app.put('/modifyenclo/:id', function (req, res) {
    models.enclo.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        })
        .then((enclo) => {
            res.json(enclo)
        })
        .catch((err) => {
            res.json(err)
        })
})
//modification enclos
app.get('/modifenclos/:id', function (req, res) {
    res.render('modifenclos', {id: req.params.id})
})
app.post('/modifyenclo/:id', function (req, res) {
    models.enclo.update(
        req.body,
        {
            where: {
                id: req.params.id
            }
        }, {NomEnclos: req.body.NomEnclos, TypeEnclos: req.body.TypeEnclos})
        .then((enclo) => {
            res.render('modiffaitenclos')
        })
        .catch((err) => {
            res.json(err)
        })
})

app.delete('/deleteenclo/:id', function (req, res) {
    models.enclo.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((response) => {
            res.json(response);
        })
        .catch((err) => {
            res.json(err)
        })
})
//suppressionenclos
app.get('/deleteenclo/:id', function (req, res) {
    models.enclo.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((response) => {
            res.render("suppressionenclos")
        })
        .catch((err) => {
            res.json(err)
        })
})

//vue detail enclos
app.get('/enclos/:id', function (req, res) {
    models.enclo.findOne({ where: { id: req.params.id } })
        .then((enclo) => {
            enclo.getsinges().then(associatedTasks => {
                 res.render('getenclo', {enclo : enclo, singe : associatedTasks})
             })
         })
})


// Synchronize models
models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   * 
   * Listen only when database connection is sucessfull
   */
  app.listen(3000, function() {
    console.log('Express server listening on port !');
  });
});
