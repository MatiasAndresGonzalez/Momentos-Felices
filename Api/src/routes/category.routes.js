import { Router } from 'express';
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../controllers/category.controller.js';
import { verificarAdmin, verificarRolCatalogo } from '../middleware/auth.js';

const router = Router();

router.get('/', listarCategorias);
router.get('/:id', obtenerCategoria);
router.post('/', verificarAdmin, verificarRolCatalogo, crearCategoria);
router.put('/:id', verificarAdmin, verificarRolCatalogo, actualizarCategoria);
router.delete('/:id', verificarAdmin, verificarRolCatalogo, eliminarCategoria);

export default router;
