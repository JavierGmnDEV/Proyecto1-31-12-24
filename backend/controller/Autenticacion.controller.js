const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Administracion = require('../models/Administracion.model');
const Profesor = require('../models/Profesor.model');
const Estudiante = require('../models/Estudiante.model');
require('dotenv').config();
const jwt = require('jsonwebtoken'); 

// Función para generar el JWT
const generarJWT = (user, role) => {
    let payload = {
      user: {
        usuario: user.Usuario,
        contrasenia: user.Contraseña,
        role: role,
      },
    };
  
    if (role === 'Profesor') {
      payload.user.anio = user.Año;
      payload.user.centro_id = user.Centro_ID;
      payload.user.id = user.Profesor_ID; // Guardar ID de Profesor
    }
    if (role === 'Estudiante') {
      payload.user.anio = user.Año;
      payload.user.centro_id = user.Centro_ID;
      payload.user.id = user.Estudiante_ID; // Guardar ID de Estudiante
    }
  
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Login para Administrador
const loginAdministrador = async (req = request, res = response) => {
  const { usuario, contrasenia } = req.query;

  try {
    const admin = await Administracion.findOne({ where: { Usuario: usuario } });
    if (!admin) {
      return res.status(400).json({
        msg: 'Usuario o contraseña incorrectos - Administrador',
      });
    }

    if (contrasenia !== admin.Contraseña) {
      return res.status(400).json({
        msg: 'Usuario o contraseña incorrectos - Administrador',
      });
    }
    
    const token = generarJWT(admin, 'Administrador');
    
    res.json({
      msg: 'Login exitoso - Administrador',
      Usuario: admin.Usuario,
      role: 'Administrador',
      id: admin.id,
      token
    });
  } catch (error) {
    
    return res.status(500).json({
      msg: 'Error en el servidor, por favor contacte con el administrador',
    });
  }
};

// Login para Estudiante
const loginEstudiante = async (req = request, res = response) => {
  const { usuario, contrasenia } = req.query;

  try {
    const estudiante = await Estudiante.findOne({ where: { Usuario: usuario } });
    if (!estudiante) {
      return res.status(400).json({
        msg: 'Usuario o contraseña incorrectos - Estudiante',
      });
    }

    if (contrasenia !== estudiante.Contraseña) {
      return res.status(400).json({
        msg: 'Usuario o contraseña incorrectos - Estudiante',
      });
    }
    
    const token = generarJWT(estudiante, 'Estudiante');

    res.json({
      msg: 'Login exitoso - Estudiante',
      usuario: estudiante.Usuario,
      anio: estudiante.Año,
      centro_id: estudiante.Centro_ID,
      role: 'Estudiante',
      id: estudiante.Estudiante_ID, // Devolver ID de Estudiante
      token
    });
  } catch (error) {
    
    return res.status(500).json({
      msg: 'Error en el servidor, por favor contacte con el administrador',
    });
  }
};

// Login para Profesor
const loginProfesor = async (req = request, res = response) => {
  const { usuario, contrasenia } = req.query;

  try {
    const profesor = await Profesor.findOne({ where: { Usuario: usuario } });
    if (!profesor) {
      return res.status(400).json({
        msg: 'Usuario o contraseña incorrectos - Profesor',
      });
    }

    if (contrasenia !== profesor.Contraseña) {
      return res.status(400).json({
        msg: 'Usuario o contraseña incorrectos',
      });
    }
    
    const token = generarJWT(profesor, 'Profesor');

    res.json({
      msg: 'Login exitoso - Profesor',
      usuario: profesor.Usuario,
      anio: profesor.Año,
      centro_id: profesor.Centro_ID,
      role: 'Profesor',
      id: profesor.Profesor_ID, // Devolver ID de Profesor
      token
    });
  } catch (error) {
   
    return res.status(500).json({
      msg: 'Error en el servidor, por favor contacte con el administrador',
    });
  }
};

module.exports = {
  loginAdministrador,
  loginEstudiante,
  loginProfesor,
};
