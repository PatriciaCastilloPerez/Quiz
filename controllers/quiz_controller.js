
exports.question = function(req, res){
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};
exports.answer = function(req, res){
	if(req.query.respuesta === 'Roma') {
		res.render('quizes/answer', {pregunta: 'Correcto'});
	} else {
		res.render('quizes/answer', {pregunta: 'Incorrecto'});
	}
};