var models = require('../models/models.js');

exports.question = function(req, res){
	models.Quiz.findAll().success(function(quiz){
		res.render('quizes/questions', {pregunta: quiz[0].pregunta});
	})
};

exports.answer = function(req, res){
	models.Quiz.findAll().success(function(quiz){
		if(req.query.respuesta === quiz[0].respuesta) {
			res.render('quizes/answers', {respuesta: 'Correcto'});
		} else {
			res.render('quizes/answers', {respuesta: 'Incorrecto'});
		}
	});
};