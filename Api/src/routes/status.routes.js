import { Router } from 'express';
const router = Router();

router.get('/estado', (req, res) => {
    res.json({
        estado: true
    });
});

export default router;