'use strict';

const extend = require('lodash').assign;
const mysql = require('mysql');
const config = require('../config');

const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: 'bdili'
};

const optionsPool = {
  connectionLimit : 100,
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: 'bdili'
};

if (config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production') {
  // options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`;
  optionsPool.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`;
}

const connection = mysql.createConnection(options);
const pool = mysql.createPool(optionsPool);

// ******************************* USUARIOS *******************************

// Traer un usuario específico con cemexId y n_empleado
function readUsuario (cemexId, n_empleado, cb) {
  var query = "SELECT * FROM `usuario` WHERE cemex_id = ? AND n_empleado = ? LIMIT 1";
  var table = [cemexId, n_empleado];
  query = mysql.format(query,table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}

// [START update Tipo_empleado]
function actualizarTipoEmpleado (tipoEmpleado, cemexId, cb) {

  var query =  'UPDATE `usuario` SET tipo_empleado = ? WHERE cemex_id = ?';
  var table = [tipoEmpleado, cemexId];
  query = mysql.format(query,table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();        
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });  
}
// [END update]    


 // ******************************* JUEGO *******************************


// [START list]
function cargarCursos (idCategoria, cb) {

  var query = "SELECT * FROM `curso` WHERE CATEGORIA_id = ?";
  var table = [idCategoria];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]


// [START list]
function cargarModulos (idModulo, cb) {

  var query = "SELECT * FROM `modulo` WHERE CURSO_id = ?";
  var table = [idModulo];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cargarPreguntasBinarias (idModulo, cb) {

  var query = "SELECT * FROM pregunta_binaria , pregunta WHERE pregunta.MODULO_id = ? AND pregunta.id = pregunta_binaria.PREGUNTA_id";
  var table = [idModulo];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cargarPreguntasMultiples (idModulo, cb) {

  var query = "SELECT * FROM pregunta_multiple , pregunta WHERE pregunta.MODULO_id = ? AND pregunta.id = pregunta_multiple.PREGUNTA_id";
  var table = [idModulo];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cargarPreguntasRelacion (idModulo, cb) {

  var query = "SELECT * FROM pregunta_relacion , pregunta WHERE pregunta.MODULO_id = ? AND pregunta.id = pregunta_relacion.PREGUNTA_id";
  var table = [idModulo];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cargarTips(idModulo, cb) {

  var query = "SELECT tip.id, tip.contenido, tip.imagen, tip.PREGUNTA_id FROM tip , pregunta WHERE pregunta.MODULO_id = ? AND pregunta.id = tip.PREGUNTA_id";
  var table = [idModulo];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START update puntaje]
function actualizarPuntaje(valor, MODULO_id, USUARIO_id, cb) {

  var query =  'INSERT INTO `puntaje` (valor, MODULO_id, USUARIO_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE valor=?, MODULO_id=?, USUARIO_id=?';
  var table = [valor, MODULO_id, USUARIO_id, valor, MODULO_id, USUARIO_id];
  query = mysql.format(query,table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();        
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });  
}
// [END update]

// [START list]
function cargarRankingCurso(idCurso, cb) {

  var query = "SELECT usuario.nombre, usuario.apellido, SUM(puntaje.valor) as valorPuntaje FROM puntaje INNER JOIN usuario ON puntaje.USUARIO_id=usuario.n_documento INNER JOIN modulo ON puntaje.MODULO_id=modulo.id WHERE modulo.CURSO_id=? GROUP BY usuario.n_documento, usuario.nombre, usuario.apellido ORDER BY valorPuntaje DESC";
  var table = [idCurso];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cargarRankingTotal(cb) {

  var query = "SELECT usuario.nombre, usuario.apellido, SUM(puntaje.valor) as valorPuntaje FROM puntaje INNER JOIN usuario ON puntaje.USUARIO_id=usuario.n_documento INNER JOIN modulo ON puntaje.MODULO_id=modulo.id GROUP BY usuario.n_documento, usuario.nombre, usuario.apellido ORDER BY valorPuntaje DESC";
  var table = [];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cursosUsuario(idUsuario, cb) {

  var query = "SELECT curso.id, curso.nombre, curso.imagen FROM puntaje INNER JOIN modulo ON puntaje.MODULO_id=modulo.id INNER JOIN curso ON modulo.CURSO_id=curso.id WHERE puntaje.USUARIO_id=? GROUP BY curso.id, curso.nombre";
  var table = [idUsuario];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function cursos(cb) {

  var query = "SELECT * FROM curso";
  var table = [];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function modulosCursoConPuntaje(idUsuario, idCurso, cb) {

  var query = "SELECT modulo.CURSO_id, puntaje.MODULO_id, modulo.nombre, puntaje.valor, usuario.n_documento as 'USUARIO_id' FROM puntaje INNER JOIN usuario ON puntaje.USUARIO_id = usuario.n_documento INNER JOIN modulo ON puntaje.MODULO_id = modulo.id WHERE puntaje.USUARIO_id = ? AND modulo.CURSO_id = ? ORDER BY puntaje.MODULO_id";
  var table = [idUsuario, idCurso];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function usuarios(cb) {

  var query = "SELECT id, nombre, apellido, n_documento, cargo, vicepresidencia FROM usuario ORDER BY apellido";
  var table = [];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function asignacionCursos(asignaciones, cb) {

  var query = "INSERT IGNORE INTO USUARIO_CURSO (USUARIO_id, CURSO_id) VALUES ?";
  var table = [asignaciones];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

// [START list]
function avanceCursosAsignados(idUsuario, cb) {

  var query = "SELECT m.CURSO_id, c.nombre, ( SUM(p.valor)/ (COUNT(m.id)) ) as progreso , c.imagen FROM modulo m LEFT JOIN puntaje p ON m.id = p.MODULO_id AND p.USUARIO_id = ? INNER JOIN USUARIO_CURSO us ON m.CURSO_id = us.CURSO_id AND us.USUARIO_id = ? INNER JOIN curso c ON m.CURSO_id = c.id GROUP BY m.CURSO_id";
  var table = [idUsuario, idUsuario];
  query = mysql.format(query, table);

  pool.getConnection(function(err, connection) {
    connection.query( query,
      (err, results) => {
        connection.release();
        if (err) {
          cb(err);
          return;
        }
        cb(null, results);
      });
   });
}
// [END list]

module.exports = {
  //list: list,
  readUsuario : readUsuario,
  actualizarTipoEmpleado : actualizarTipoEmpleado,
  cargarCursos : cargarCursos,
  cargarModulos : cargarModulos,
  cargarPreguntasBinarias : cargarPreguntasBinarias,
  cargarPreguntasMultiples : cargarPreguntasMultiples,
  cargarPreguntasRelacion : cargarPreguntasRelacion,
  cargarTips: cargarTips,
  actualizarPuntaje : actualizarPuntaje,
  cargarRankingCurso : cargarRankingCurso,
  modulosCursoConPuntaje : modulosCursoConPuntaje,
  cursosUsuario : cursosUsuario,
  cursos : cursos,
  cargarRankingTotal : cargarRankingTotal,
  usuarios : usuarios,
  asignacionCursos : asignacionCursos,
  avanceCursosAsignados : avanceCursosAsignados
};

if (module === require.main) {
  const prompt = require('prompt');
  prompt.start();

  prompt.get(['user', 'password'], (err, result) => {
    if (err) {
      return;
    }
    console.log("Ok, ili");
  });
}

