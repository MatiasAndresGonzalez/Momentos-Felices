import { Router } from 'express';

import {
    loginCliente,
    registrarCliente,
    refreshTokenCliente,
    obtenerPerfilCliente,
    actualizarPerfilCliente,
    loginAdmin,
    obtenerPerfilAdmin,
    refreshTokenAdmin,
} from '../controllers/auth.controller.js';

import {
    verificarAdmin,
    verificarCliente,
} from '../middleware/auth.js';

const router = Router();

router.post('/client/registro', registrarCliente);

router.post('/client/login', loginCliente);

router.get('/client/refresh', verificarCliente, refreshTokenCliente);

router.get('/client/perfil', verificarCliente, obtenerPerfilCliente);

router.put('/client/perfil', verificarCliente, actualizarPerfilCliente);

router.post('/admin/login', loginAdmin);

router.get('/admin/refresh', verificarAdmin, refreshTokenAdmin);

router.get('/admin/perfil', verificarAdmin, obtenerPerfilAdmin);

export default router;