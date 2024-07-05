import { SECRET_KEY } from '../config/config.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import createModel from '../models/user.model.js'

export const register = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) return res.status(400).json({ message: 'Datos faltantes' })

            const nuevoRegistro = await createModel.create(username, password)

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

       const resultado = await createModel.where('username', username)
        
        if ( resultado.length === 0 ) return res.status(400).json({message: 'No se puede iniciar secion, falta el usuario o la contraseña'})

            const user = resultado[0]

            const math = await bcrypt.compare(password, user.password)

        if (!math) return res.status(400).json({message: 'El nombre de usuario o contraseña son incorrectos'})

            const token = jwt.sign({usuarioid: user.id}, SECRET_KEY, {expiresIn: '60m'})

            res.json({message: 'usuario autenticado', token }) 

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const dashboard = async (req, res) => {
    try {
        const {authorization} = req.headers
        const {usuarioid} = jwt.verify(authorization, SECRET_KEY)
        const resultado = await createModel.find(usuarioid)
        return res.json(resultado[0])
    } catch (error) {
        
        res.status(500).json({message: error.message})
    }
}
