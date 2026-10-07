import jwt from 'jsonwebtoken';

import {
    JWT_SECRET_CLIENT,
    JWT_SECRET_ADMIN,
} from '../utils/auth.js';

import { Client } from '../models/index.js';
import { Admin } from '../models/index.js';
import { Rol } from '../models/index.js';

export const verificarToken = (secret) => (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith('Bearer ')
        ) {

            return res.status(401).json({
                estado: false,
                mensaje:
                    'No se proporcionó un token de autenticación',
            });
        }

        const token =
            authHeader.split(' ')[1];

        const payload =
            jwt.verify(
                token,
                secret
            );

        req.user = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            estado: false,
            mensaje:
                'Token inválido o expirado',
            error: error.message,
        });
    }
};

export const verificarCliente = (req, res, next) => {

    verificarToken(JWT_SECRET_CLIENT)(req, res,
        async (err) => {

            if (err) {
                return next(err);
            }

            try {

                if (
                    !req.user ||
                    req.user.type !== 'client'
                ) {

                    return res.status(403).json({
                        estado: false,
                        mensaje:
                            'Acceso permitido sólo a clientes',
                    });
                }

                const cliente =
                    await Client.findByPk(
                        req.user.id
                    );


                if (!cliente) {

                    return res.status(403).json({
                        estado: false,
                        mensaje:
                            'Cliente no encontrado',
                    });
                }

                req.cliente = cliente;

                next();
            } catch (error) {
                console.error(
                    'Error en verificarUsuario:',
                    error
                );
                return res.status(500).json({
                    estado: false,
                    mensaje:
                        'Error al verificar usuario',
                    error: error.message,
                });
            }
        }
    );
};

export const verificarAdmin = (req, res, next) => {

    verificarToken(
        JWT_SECRET_ADMIN
    )(req, res,
        async (err) => {

            if (err) {
                return next(err);
            }

            try {

                if (
                    !req.user ||
                    req.user.type !== 'admin'
                ) {

                    return res.status(403).json({
                        estado: false,
                        mensaje:
                            'Acceso solo para administradores',
                    });
                }

                const admin =
                    await Admin.findByPk(
                        req.user.id, {
                include: {
                    model: Rol,
                    as: 'rol',
                },
            });


                if (!admin || !admin.rol) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Usuario o rol no encontrado',
                });
            }

            const rol = admin.rol.nombre.toUpperCase();
            if (!['SUPERADMIN', 'GESTOR', 'AUDITOR'].includes(rol)) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'El usuario no tiene permisos de administrador',
                });
            }

                req.admin = admin;

                next();
            } catch (error) {

                console.error(
                    'Error en verificarAdmin:',
                    error
                );
                return res.status(500).json({
                    estado: false,
                    mensaje:
                        'Error al verificar administrador',
                    error: error.message,
                });
            }
        }
    );
};

export const verificarRolAdmin = (req, res, next) => {
    if (!req.admin || !req.admin.rol) {
        return res.status(403).json({
            estado: false,
            mensaje: 'No se pudo verificar el rol del usuario',
        });
    }

    const rol = req.admin.rol.nombre.toUpperCase();
    if (rol !== 'SUPERADMIN') {
        return res.status(403).json({
            estado: false,
            mensaje: 'Esta acción requiere permisos de SUPERADMIN',
        });
    }

    next();
};