import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { RefreshToken, Client, Admin, Rol } from '../models/index.js';
import { JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
const createRefresh = async (userId, userType) => {
  const token = crypto.randomBytes(48).toString('hex');
  await RefreshToken.create({ token, userId, userType, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  return token;
};
const createAccess = (user, userType) => {
  const secret = userType === 'client' ? JWT_SECRET_CLIENT : JWT_SECRET_ADMIN;
  const payload = userType === 'client'
    ? { id: user.id, email: user.email, type: 'client' }
    : { id: user.id, email: user.email, type: 'admin', idRol: user.idRol, rol: user.rol?.nombre };
  return jwt.sign(payload, secret, { expiresIn: '15m' });
};
export const issueSession = async (user, userType) => ({ token: createAccess(user, userType), refreshToken: await createRefresh(user.id, userType) });
export const refreshSession = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ estado: false, mensaje: 'Refresh token requerido' });
    const session = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!session || session.expiresAt <= new Date()) {
      if (session) await session.destroy();
      return res.status(401).json({ estado: false, mensaje: 'Refresh token inválido o expirado' });
    }
    const Model = session.userType === 'client' ? Client : Admin;
    const user = await Model.findByPk(session.userId, session.userType === 'admin' ? { include: { model: Rol, as: 'rol' } } : undefined);
    if (!user) return res.status(401).json({ estado: false, mensaje: 'Usuario no encontrado' });
    const token = createAccess(user, session.userType);
    res.json({ estado: true, token, userType: session.userType, usuario: session.userType === 'client'
      ? { id: user.id, nombre: user.nombre, email: user.email, telefono: user.telefono }
      : { id: user.id, nombre: user.nombre, email: user.email, idRol: user.idRol, rol: user.rol.nombre } });
  } catch (error) { res.status(500).json({ estado: false, mensaje: 'Error al renovar sesión', error: error.message }); }
};
export const logoutSession = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await RefreshToken.destroy({ where: { token: refreshToken } });
    res.json({ estado: true, mensaje: 'Sesión cerrada correctamente' });
  } catch (error) { res.status(500).json({ estado: false, mensaje: 'Error al cerrar sesión', error: error.message }); }
};
