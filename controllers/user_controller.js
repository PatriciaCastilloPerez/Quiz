var models = require('../models/models.js');

var users = {admin: {id:1, username:'admin', password:'1234'},
            pepe: {id:2, username:'pepe', password:'5678'}
}
exports.autenticar = function(login, password, callback) {
	if(users[login]) {
    if(password == users[login].password) {
      callback(null, users[login]);
    } else {
      callback(new Error('password erronea'));
    }
  } else {
    callback(new Error('El usuario no existe'));
  }
};


// GET /user/:id/edit
exports.edit = function(req, res) {
  res.render('user/edit', { user: req.user, errors: []});
};            // req.user: instancia de user cargada con autoload

// GET /user
exports.new = function(req, res) {
    var user = models.User.build( // crea objeto user 
        {username: "", password: ""}
    );
    res.render('user/new', {user: user, errors: []});
};

// POST /user
exports.create = function(req, res) {
    var user = models.User.build( req.body.user );

    user
    .validate()
    .then(
        function(err){
            if (err) {
                res.render('user/new', {user: user, errors: err.errors});
            } else {
                user // save: guarda en DB campos username y password de user
                .save({fields: ["username", "password"]})
                .then( function(){
                    // crea la sesión para que el usuario acceda ya autenticado y redirige a /
                    req.session.user = {id:user.id, username:user.username};
                    res.redirect('/');
                }); 
            }
        }
    ).catch(function(error){next(error)});
};

// PUT /user/:id
exports.update = function(req, res, next) {
  req.user.username  = req.body.user.username;
  req.user.password  = req.body.user.password;

  req.user
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('user/' + req.user.id, {user: req.user, errors: err.errors});
      } else {
        req.user     // save: guarda campo username y password en DB
        .save( {fields: ["username", "password"]})
        .then( function(){ res.redirect('/');});
      }     // Redirección HTTP a /
    }
  ).catch(function(error){next(error)});
};

// DELETE /user/:id
exports.destroy = function(req, res) {
  req.user.destroy().then( function() {
    // borra la sesión y redirige a /
    delete req.session.user;
    res.redirect('/');
  }).catch(function(error){next(error)});
};