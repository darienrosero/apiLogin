import { allowedOrigins } from "../config/config.js";

export const validateCors = (req, res, next) => {
    const { origin } = req.headers;

    if (!origin) {
        return res.status(400).json({ message: 'Origin header missing' });
    }
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    } else {
        res.status(403).json({ message: 'Origen no permitido' });
    }
};
 