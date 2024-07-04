import { pool } from "../config/db.js"
import bcrypt from 'bcrypt'

const create = async (username, password) => {
    const hash = await bcrypt.hash(password, 10)
    const fecha = new Date()
    const [nuevoRegistro] = await pool.execute('INSERT INTO users (username, password, date_creation) VALUES(?,?,?)', [username, hash, fecha.toISOString()])

    return nuevoRegistro
}

const where = async (columna, valor) => {
    const [resultado] = await pool.execute(`SELECT * FROM users WHERE ${columna} = ?`, [valor])
    return resultado
}

const find = async (usuarioid) => {
    const [resultado] = await pool.execute('SELECT id, nombres, apellidos, phone, username FROM users WHERE id = ?', [usuarioid])
    return resultado
}

export default {create, where, find}