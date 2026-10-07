import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    idRol: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Admins',
    timestamps: false,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password) {
                admin.password = await encriptarPassword(admin.password);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('password')) {
                admin.password = await encriptarPassword(admin.password);
            }
        },
    },
});

export default Admin;