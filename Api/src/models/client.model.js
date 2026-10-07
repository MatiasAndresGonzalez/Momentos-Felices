import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Client = sequelize.define(
    'Client',
    {
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
        direccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'Clients',
        timestamps: false,

        hooks: {
            beforeCreate: async (client) => {
                if (client.password) {
                    client.password =
                        await encriptarPassword(
                            client.password
                        );
                }
            },

            beforeUpdate: async (client) => {
                if (client.changed('password')) {
                    client.password =
                        await encriptarPassword(
                            client.password
                        );
                }
            },
        },
    }
);

export default Client;