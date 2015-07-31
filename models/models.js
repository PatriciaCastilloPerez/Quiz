var path = require('path');

//Cargar ORM
var Sequelize = require('sequelize');


//Usar DB SQLite
var sequelize = new Sequelize(null, null, null, {dialect: 'sqlite', storage: 'quiz.sqlite'});

//Import def de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //Export de la def de tabla Quiz

//Creación e inicialización de la tabla de preguntas en DB
sequelize.sync().success(function() {
	Quiz.count().success(function(count){
		if(count === 0 ) {Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma'}).success(function(){console.log('DB inicializada')}); };
	});
});