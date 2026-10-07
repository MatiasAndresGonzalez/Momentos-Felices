import sequelize from '../config/database.js';

// Importamos solo los modelos iniciales
import Client from './client.model.js';
import Admin from './admin.model.js';
import Rol from './rol.model.js';
import Product from './product.model.js';
import RefreshToken from './refresh-token.model.js';
import Category from './category.model.js';


Rol.hasMany(Admin, {
    foreignKey: 'idRol',
    as: 'Admin',
});
Admin.belongsTo(Rol, {
    foreignKey: 'idRol',
    as: 'rol',
});

export {
    sequelize,
    Client,
    Admin,
    Rol,
    Product,
    RefreshToken,
    Category
};

export default {
    sequelize,
    Client,
    Admin,
    Rol,
    Product,
    RefreshToken,
    Category
};