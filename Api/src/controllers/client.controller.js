import { Client } from '../models/index.js';

export const obtener = async (req, res) => {
    try {

        const data = await Client.findAll();
        
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener clientes',
            error: error.message,
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {

        const id = parseInt(req.params.id, 10);

        const data = await Client.findByPk(id);

        if (!data) {

            return res.status(404).json({
                estado: false,
                mensaje: 'Cliente no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener cliente',
            error: error.message,
        });
    }
};

export const crear = async (req, res) => {
    try {

        const data = await Client.create(req.body);

        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear cliente',
            error: error.message,
        });
    }
};

export const actualizar = async (req, res) => {
    try {

        const id = parseInt(req.params.id, 10);

        const cliente = await Client.findByPk(id);

        if (!cliente) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Cliente no encontrado',
            });
        }

        await cliente.update(req.body);
        res.json({
            estado: true,
            data: cliente,
        });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar cliente',
            error: error.message,
        });
    }
};

export const eliminar = async (req, res) => {
    try {

        const id = parseInt(req.params.id, 10);

        const cliente = await Client.findByPk(id);

        if (!cliente) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Cliente no encontrado',
            });
        }

        await cliente.destroy();
        res.json({
            estado: true,
            mensaje: 'Cliente eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar cliente',
            error: error.message,
        });
    }
};