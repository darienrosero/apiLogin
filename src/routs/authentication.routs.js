import { Router } from "express";
import { dashboard, login, register } from "../controller/authentication.controller.js";
import { validate } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/register', register)

router.post('/login', login)

router. get('/dashboard',validate ,dashboard)

export default router
