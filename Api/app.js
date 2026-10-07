
import express from "express";
import cors from "cors";
import routes from './src/routes/index.js';
import sequelize from './src/config/database.js';
import 'dotenv/config';

if (!process.env.JWT_SECRET_ADMIN) {
    throw new Error('Falta configurar JWT_SECRET_ADMIN en el archivo .env');
}

if (!process.env.JWT_SECRET_CLIENT) {
    throw new Error('Falta configurar JWT_SECRET_CLIENT en el archivo .env');
}

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
];

const corsOptions = {
    
    origin: (origin, callback) => {
        
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`Origen no permitido por CORS: ${origin}`);
        return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', routes);

const PUERTO = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        
        // await sequelize.sync( { alter: true } );
        
    await sequelize.authenticate();
console.log('Conexión a la base de datos establecida correctamente.');

await sequelize.sync();
console.log('Tablas sincronizadas correctamente.');

app.listen(PUERTO, () => {
    console.log('Servidor iniciado correctamente en el puerto:', PUERTO);
});
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

iniciarServidor();