
exports.question = function(req, res){
	res.render('quizes/questions', {pregunta: 'Capital de Italia'});
};
exports.answer = function(req, res){
	if(req.query.respuesta === 'Roma') {
		res.render('quizes/answers', {respuesta: 'Correcto'});
	} else {
		res.render('quizes/answers', {respuesta: 'Incorrecto'});
	}
};