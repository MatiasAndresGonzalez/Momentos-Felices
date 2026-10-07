import { Router } from 'express';
const router = Router();

import { verificarAdmin, verificarRolAdmin } from '../middleware/auth.js';
import {
    listarAdministradores,
    obtenerAdministradorPorId,
    crearAdministrador,
    actualizarAdministrador,
    eliminarAdministrador,
    listarRoles,
} from '../controllers/admin.controller.js';

// La administración de usuarios y roles queda reservada exclusivamente al SUPERADMIN.
router.get('/roles', verificarAdmin, verificarRolAdmin, listarRoles);
router.get('/', verificarAdmin, verificarRolAdmin, listarAdministradores);
router.get('/:id', verificarAdmin, verificarRolAdmin, obtenerAdministradorPorId);
router.post('/', verificarAdmin, verificarRolAdmin, crearAdministrador);
router.put('/:id', verificarAdmin, verificarRolAdmin, actualizarAdministrador);
router.delete('/:id', verificarAdmin, verificarRolAdmin, eliminarAdministrador);

export default router;
