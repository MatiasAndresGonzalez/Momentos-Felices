import { Router } from 'express';
const router = Router();


import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/client.controller.js';

import { verificarAdmin } from '../middleware/auth.js';

router.get('/', verificarAdmin, obtener);

router.get('/:id', verificarAdmin, obtenerPorId);

router.post('/', verificarAdmin, crear);

router.put('/:id', verificarAdmin, actualizar);

router.delete('/:id', verificarAdmin, eliminar);

export default router;