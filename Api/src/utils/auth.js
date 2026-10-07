import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const JWT_SECRET_CLIENT =
    process.env.JWT_SECRET_CLIENT;

export const JWT_SECRET_ADMIN =
    process.env.JWT_SECRET_ADMIN;

export const encriptarPassword = async (password) => {

    return bcrypt.hash(
        password,
        SALT_ROUNDS
    );
};

export const compararPassword = async (
    password,
    hash
) => {

    return bcrypt.compare(
        password,
        hash
    );
};

export const generarToken = (
    payload,
    secret = JWT_SECRET_CLIENT
) => {

    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: '24h',
        }
    );
};
