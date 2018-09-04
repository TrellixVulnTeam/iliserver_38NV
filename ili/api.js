'use strict';

const express = require('express');
const bodyParser = require('body-parser');

function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * GET /api/ili/usuario/:cemexId/:n_empleado
 *
 * Retrieve a user.
 */
router.get('/usuario/:cemex_id/:n_empleado', (req, res, next) => {

  getModel().readUsuario(req.params.cemex_id, req.params.n_empleado, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"Error" : false, "Message" : "Success", "UsersNumber" : entity.length, "Users" : entity});
  });
});

/**
 * PUT /api/ili/usuario/tipo_empleado
 *
 * Update el tipo de empleado de usuario.
 */
router.put('/usuario/tipo_empleado', (req, res, next) => {

  getModel().actualizarTipoEmpleado(req.body.tipo_empleado, req.body.cemex_id , (err, entity) => {
    if (err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
      return;
    }
    res.json({"Error" : false, "Message" : "Actualizado el tipo de empleado para el CemexId: " + req.body.cemex_id});
  });
});


/**
 * GET /api/ili/curso/:CATEGORIA_id
 *
 */
router.get('/curso/:CATEGORIA_id', (req, res, next) => {

  getModel().cargarCursos(req.params.CATEGORIA_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
    res.json({"Error" : false, "Message" : "Cursos cargados satisfactoriamente", "Cursos" : entities});
  });
});

/**
 * GET /api/ili/modulos/:CURSO_id
 *
 */
router.get('/modulos/:CURSO_id', (req, res, next) => {

  getModel().cargarModulos(req.params.CURSO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "Módulos cargados satisfactoriamente", "Modulos" : entities});
  });
});

/**
 * GET /api/ili/preguntasbinarias/:MODULO_id
 *
 */
router.get('/preguntasbinarias/:MODULO_id', (req, res, next) => {

  getModel().cargarPreguntasBinarias(req.params.MODULO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "preguntas cargadas satisfactoriamente", "preguntas" : entities, "Tipo" : "Binaria"});
  });
});

/**
 * GET /api/ili/preguntasmultiples/:MODULO_id
 *
 */
router.get('/preguntasmultiples/:MODULO_id', (req, res, next) => {

  getModel().cargarPreguntasMultiples(req.params.MODULO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "preguntas cargadas satisfactoriamente", "preguntas" : entities, "Tipo" : "Multiple"});
  });
});

/**
 * GET /api/ili/preguntasrelacion/:MODULO_id
 *
 */
router.get('/preguntasrelacion/:MODULO_id', (req, res, next) => {
  
  getModel().cargarPreguntasRelacion(req.params.MODULO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "preguntas cargadas satisfactoriamente", "preguntas" : entities, "Tipo" : "Relacion"});
  });
});

/**
 * GET /api/ili/tips/:MODULO_id
 *
 */
router.get('/tips/:MODULO_id', (req, res, next) => {

  getModel().cargarTips(req.params.MODULO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "Tips cargados satisfactoriamente", "tips" : entities});
  });
});

/**
 * PUT /api/ili/puntaje
 *
 */
router.put("/puntaje", (req, res, next) => {

  getModel().actualizarPuntaje(req.body.valor, req.body.MODULO_id, req.body.USUARIO_id, (err, entities) => {
    if (err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query", "err" : err.message});
      return;
    }
     res.json({"Error" : false, "Message" : "Creado/Actualizado el puntaje para el id del usuario: " + req.body.USUARIO_id});
  });
});

/**
 * GET /api/ili/ranking/:CURSO_id
 *
 */
router.get('/ranking/:CURSO_id', (req, res, next) => {

  getModel().cargarRankingCurso(req.params.CURSO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "Ranking cargado satisfactoriamente", "Ranking" : entities});
  });
});

/**
 * GET /api/ili/rankingTotal
 *
 */
router.get('/rankingTotal', (req, res, next) => {

  getModel().cargarRankingTotal((err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "Ranking total cargado satisfactoriamente", "Ranking" : entities});
  });
});

/**
 * GET /api/ili/cursosUsuario/:USUARIO_id
 *
 */
router.get('/cursosUsuario/:USUARIO_id', (req, res, next) => {

  getModel().cursosUsuario(req.params.USUARIO_id, (err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "Cursos del usuario cargados satisfactoriamente", "Cursos" : entities});
  });
});

/**
 * GET /api/ili/cursos
 *
 */
router.get('/cursos', (req, res, next) => {

  getModel().cursos((err, entities) => {
    if (err) {
      next(err);
      return;
    }
     res.json({"Error" : false, "Message" : "Cursos cargados satisfactoriamente", "Cursos" : entities});
  });
});

/**
 * GET /api/ili/modulosCursoConPuntaje/:USUARIO_id/:CURSO_id
 *
 */
router.get('/modulosCursoConPuntaje/:USUARIO_id/:CURSO_id', (req, res, next) => {

  getModel().modulosCursoConPuntaje(req.params.USUARIO_id, req.params.CURSO_id, (err, entities) => {
    if (err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
      return;
    }
     res.json({"Error" : false, "Message" : "Módulos del curso cargados satisfactoriamente", "Modulos" : entities});
  });
});

/**
 * GET /api/ili/usuarios
 *
 */
router.get('/usuarios', (req, res, next) => {

  getModel().usuarios((err, entities) => {
    if (err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query", "err" : err.message});
      return;
    }
     res.json({"Error" : false, "Message" : "Usuarios cargados satisfactoriamente", "Usuarios" : entities});
  });
});

/**
 * PUT /api/ili/asignacionCursos
 *
 */
router.put("/asignacionCursos", (req, res, next) => {

  getModel().asignacionCursos(req.body.ASIGNACIONES_CURSOS, (err, entities) => {
    if (err) {
      res.json({"Error" : true, "Message" : "Error en la asignación. Contacta al administrador de la App.", "err" : err.message});
      return;
    }
     res.json({"Error" : false, "Message" : "Cursos asignados correctamente"});
  });
});

/**
 * GET /api/ili/avanceCursosAsignados/:USUARIO_id
 *
 */
router.get('/avanceCursosAsignados/:USUARIO_id', (req, res, next) => {

  getModel().avanceCursosAsignados(req.params.USUARIO_id, (err, entities) => {
    if (err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query"});
      return;
    }
     res.json({"Error" : false, "Message" : "Avance de los cursos cargados satisfactoriamente", "Avance" : entities});
  });
});

/**
 * GET /api/ili/appVersion
 *
 */
router.get('/appVersion', (req, res, next) => {
    res.json({"version" : "0.0.8"});
});

module.exports = router;
