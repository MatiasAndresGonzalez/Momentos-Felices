import { compararPassword,
    generarToken,
    JWT_SECRET_CLIENT, JWT_SECRET_ADMIN
} from '../utils/auth.js';

import { Client,
    Admin,
    Rol,
} from '../models/index.js';
import { issueSession } from './session.controller.js';


export const loginCliente = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y password',
            });
        }

        const cliente = await Client.findOne({ where: { email } });

        if (!cliente) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',  
            });
        }

        const passwordValido = await compararPassword(password, cliente.password);

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        const sesion = await issueSession(cliente, 'client');

        res.json({
            estado: true,
            mensaje: 'Login de cliente exitoso',
            token: sesion.token,
            refreshToken: sesion.refreshToken,
            usuario: {
                id: cliente.id,
                nombre: cliente.nombre,
                email: cliente.email,
                telefono: cliente.telefono,
            },
        });
    } catch (error) {
        console.error('Error en login cliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

export const registrarCliente = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar nombre, email y password',
            });
        }

        const existe = await Client.findOne({ where: { email } });

        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El email ya está registrado',
            });
        }

        const cliente = await Client.create({ nombre, email, password, telefono });

        const token = generarToken({
            id: cliente.id,
            email: cliente.email,
            type: 'client',
        }, JWT_SECRET_CLIENT);

        res.status(201).json({
            estado: true,
            mensaje: 'Registro de cliente exitoso',
            token,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                email: cliente.email,
                telefono: cliente.telefono,
            },
        });
    } catch (error) {
        console.error('Error en registrar cliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al registrar cliente',
            error: error.message,
        });
    }
};

export const refreshTokenCliente = async (req, res) => {
    try {
        const cliente = req.cliente;

        const token = generarToken({
            id: cliente.id,
            email: cliente.email,
            type: 'client',
        }, JWT_SECRET_CLIENT);

        res.json({
            estado: true,
            mensaje: 'Token validado y renovado correctamente',
            token,
            cliente: {
                    id: cliente.id,
                    nombre: cliente.nombre,
                    email: cliente.email,
                    telefono: cliente.telefono,
                },
        });
    } catch (error) {
        console.error('Error en refreshToken cliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al validar o renovar token',
            error: error.message,
        });
    }
};

export const obtenerPerfilCliente = async (req, res) => {
    try {
        const cliente = await Client.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
        });

        if (!cliente) {
            return res.status(404).json({
                estado: false,
                mensaje: 'cliente no encontrado',
            });
        }

        res.json({
            estado: true,
            data: cliente,
        });
    } catch (error) {
        console.error('Error al obtener perfil del cliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener perfil',
            error: error.message,
        });
    }
};

export const actualizarPerfilCliente = async (req, res) => {
    try {
        const cliente = await Client.findByPk(req.user.id);

        if (!cliente) {
            return res.status(404).json({
                estado: false,
                mensaje: 'cliente no encontrado',
            });
        }

        const { nombre, email, telefono, password } = req.body;

        if (email && email !== cliente.email) {
            const existeEmail = await Client.findOne({ where: { email } });
            if (existeEmail && existeEmail.id !== cliente.id) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'El email ya se encuentra registrado por otro cliente',
                });
            }
        }

        const campos = {};
        if (nombre !== undefined) campos.nombre = nombre;
        if (email !== undefined) campos.email = email;
        if (telefono !== undefined) campos.telefono = telefono;
        if (password && password.trim() !== '') {
            campos.password = password;
        }

        await cliente.update(campos);

        res.json({
            estado: true,
            mensaje: 'Perfil actualizado correctamente',
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                email: cliente.email,
                telefono: cliente.telefono,
            },
        });
    } catch (error) {
        console.error('Error al actualizar perfil del cliente:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar perfil',
            error: error.message,
        });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y password',
            });
        }

        const admin = await Admin.findOne({
            where: { email },
            include: {
                model: Rol,
                as: 'rol'
            }
        });

        if (!admin || !admin.rol) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas o rol no asignado',
            });
        }

        const rol = admin.rol.nombre.toUpperCase();

        if (!['SUPERADMIN', 'GESTOR', 'AUDITOR'].includes(rol)) {
            return res.status(403).json({
                estado: false,
                mensaje: 'El usuario no tiene permisos para acceder al panel',
            });
        }

        const passwordValido = await compararPassword(
            password,
            admin.password
        );

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        const sesion = await issueSession(admin, 'admin');

        res.json({
            estado: true,
            mensaje: 'Login de administrador exitoso',
            token: sesion.token,
            refreshToken: sesion.refreshToken,
            usuario: {
                id: admin.id,
                nombre: admin.nombre,
                email: admin.email,
                idRol: admin.idRol,
                rol: admin.rol.nombre
            },
        });

    } catch (error) {
        console.error('Error en loginAdmin:', error);

        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

export const refreshTokenAdmin = async (req, res) => {
    try {
        const admin = req.admin;

        const token = generarToken({
            id: admin.id,
            email: admin.email,
            type: 'admin',
            idRol: admin.idRol,
            rol: admin.rol.nombre,
        }, JWT_SECRET_ADMIN);

        res.json({
            estado: true,
            mensaje: 'Token de administrador validado y renovado',
            token,
            usuario: {
                id: admin.id,
                nombre: admin.nombre,
                email: admin.email,
                idRol: admin.idRol,
                rol: admin.rol.nombre,
            },
        });
    } catch (error) {
        console.error('Error en refreshTokenAdmin:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al renovar token de administrador',
            error: error.message,
        });
    }
};

export const obtenerPerfilAdmin = async (req, res) => {
    try {
        const admin = req.admin;

        if (!admin) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Administrador no encontrado',
            });
        }

        res.json({
            estado: true,
            data: {
                id: admin.id,
                nombre: admin.nombre,
                email: admin.email,
                idRol: admin.idRol,
                rol: admin.rol.nombre,
            },
        });
    } catch (error) {
        console.error('Error al obtener perfil de administrador:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener perfil de administrador',
            error: error.message,
        });
    }
};
