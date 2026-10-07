import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: DataTypes.STRING(512), allowNull: false, unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userType: { type: DataTypes.ENUM('client', 'admin'), allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
}, { tableName: 'refresh_tokens', timestamps: true });
export default RefreshToken;
