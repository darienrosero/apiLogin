import { SECRET_KEY } from '../config/config.js'
import { pool } from '../config/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        const { nombres, apellidos, phone, username, password } = req.body

        if (!nombres || !apellidos || !phone || !username || !password) return res.status(400).json({ message: 'Datos faltantes' })

            const hash = await bcrypt.hash(password, 10)

            const fecha = new Date()

        const [nuevoRegistro] = await pool.execute('INSERT INTO users (nombres, apellidos, phone, username, password, date_creation) VALUES(?,?,?,?,?,?)', [nombres, apellidos, username, username, hash, fecha.toISOString()])

        console.log(nuevoRegistro)

        if(nuevoRegistro.affectedRows !== 1 ) return res.status(400).json({message: 'no se puedo crear el registro'})

            res.json({message: 'usuario registrado' })

    } catch (error) {
        if (error?.errno === 1062) return res.status(400).json({message: 'El nombre de usuario ya existe'})
        return res.status(500).json({message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body

        const [resultado] = await pool.execute('SELECT * FROM users WHERE username = ?', [username])
        
        if ( resultado.length === 0 ) return res.status(400).json({message: 'Usuario no encontrado'})

            const user = resultado[0]

            const math = await bcrypt.compare(password, user.password)

        if (!math) return res.status(400).json({message: 'El nombre de usuario o contraseña son incorrectos'})

            const token = jwt.sign({usuarioid: user.id}, SECRET_KEY, {expiresIn: '5m'})

            res.json({message: 'usuario autenticado', token }) 

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const dashboard = async (req, res) => {
    try {
        const {authorization} = req.headers
        const {usuarioid} = jwt.verify(authorization, SECRET_KEY)
        const [resultado] = await pool.execute('SELECT id, nombres, apellidos, phone, username FROM users WHERE id = ?', [usuarioid])
        return res.json(resultado[0])
    } catch (error) {
        
        res.status(500).json({message: error.message})
    }
}
