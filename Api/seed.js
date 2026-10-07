import 'dotenv/config';

import sequelize from './src/config/database.js';
import Admin from './src/models/admin.model.js';
import Client from './src/models/client.model.js';
import Rol from './src/models/rol.model.js';

const crearAdmin = async () => {
    try {
        await sequelize.authenticate();

        console.log('Conectado a la base de datos.');

        // 1. Buscamos el rol o lo creamos si no existe
        let [rol] = await Rol.findOrCreate({
            where: { nombre: 'SUPERADMIN' },
            defaults: { descripcion: 'Administrador del sistema, Acceso total' }
        });
        
        const adminExistente = await Admin.findOne({
            where: {
                email: 'admin@tienda.com'
            }
        });

        if (adminExistente) {
            console.log('El administrador ya existe.');
            return;
        }

        const admin = await Admin.create({
            nombre: 'Administrador',
            email: 'admin@tienda.com',
            password: 'admin123',
            idRol: rol.id
        });

        console.log('Administrador creado correctamente.');

        console.log({
            id: admin.id,
            nombre: admin.nombre,
            email: admin.email,
            idRol: admin.idRol
        });

    } catch (error) {
        console.error('Error al crear administrador:', error);
    } finally {
        await sequelize.close();
    }
};

const crearCliente = async () => {
    try {
        await sequelize.authenticate();

        console.log('Conectado a la base de datos.');
        
        const clienteExistente = await Client.findOne({
            where: {
                email: 'cliente@tienda.com'
            }
        });

        if (clienteExistente) {
            console.log('El cliente ya existe.');
            return;
        }

        const cliente = await Client.create({
            nombre: 'Cliente1',
            email: 'cliente@tienda.com',
            password: 'cliente123',
        });

        console.log('Cliente creado correctamente.');

        console.log({
            id: cliente.id,
            nombre: cliente.nombre,
            email: cliente.email,
        });

    } catch (error) {
        console.error('Error al crear cliente:', error);
    } finally {
        await sequelize.close();
    }
};

crearAdmin();

crearCliente();

