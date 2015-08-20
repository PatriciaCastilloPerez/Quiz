var models = require('../models/models.js');

exports.ownershipRequired = function(req, res, next){
    var objQuizOwner = req.quiz.UserId;
    var logUser = req.session.user.id;
    var isAdmin = req.session.user.isAdmin;

    if (isAdmin || objQuizOwner === logUser) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res) {
	if(req.query.search) {
		var search = '%'+(req.query.search).replace(' ','%')+'%';
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
			//console.log("quizes: "+quizes.length);
	    if(quizes.length>0){
	    	res.render('quizes/index.ejs', { quizes: quizes, errors: []});
	    } else {
	    	res.render('quizes/index.ejs', { quizes: '', errors: []});
	    }
	  }).catch(function(error) { next(error);})
	} else {
		models.Quiz.findAll().then(function(quizes) {
	    res.render('quizes/index.ejs', { quizes: quizes, errors: []});
	  }).catch(function(error) { next(error);})
	}
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  console.log("res"+resultado)
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "", respuesta: "", tema: ""}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.validate().then(
    	function(err){
     		if (err) {
        		res.render('quizes/new', {quiz: quiz, errors: err.errors});
      		} else {
        		quiz // save: guarda en DB campos pregunta y respuesta de quiz
        		.save({fields: ["pregunta", "respuesta", "tema"]})
        		.then( function(){ res.redirect('/quizes')}) 
      		}      // res.redirect: Redirección HTTP a lista de preguntas
    	}
  	).catch(function(error){next(error)});
};

exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit', { quiz: quiz, errors: []});
};


exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};


exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};