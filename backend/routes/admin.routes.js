import express from 'express';
import { getAllUser, getUser, updateUser, deleteUser, signupUser } from '../controllers/user_perfil.controllers.js';
import { identifyUser, authorizeRole } from '../middlewares/authMiddleware.js';
import { createAdmin, deleteAdmin, getAllAdmins } from '../controllers/admin-users.controllers.js'
//import {funções definidas no controler} from 'rota do arquivo no controler /reservation.controllers.js'

const router = express.Router()

// criar e editar usuários comuns
// deletar usuários comuns

/* JSON */

// GET
router.get('/', identifyUser, authorizeRole(['admin','seed']), getAllUser)
router.get('/all', identifyUser, authorizeRole(['seed']), getAllAdmins)
router.get('/:id', identifyUser, authorizeRole(['admin','seed']), getUser)

// POST
router.post('/register', identifyUser, authorizeRole(['admin','seed']), signupUser)
router.post('/register-admin', identifyUser, authorizeRole(['seed']),createAdmin); // Criar um novo administrador
//router.post('/offers', identifyUser, authorizeRole['admin','manager','publi'], post_offer)

// PUT
router.put('/:id', identifyUser, authorizeRole(['admin','seed']), updateUser)

// DELETE
//router.delete('/admins/:id', deleteAdmin); // Deletar um administrador router.delete('/:id', deleteUser)
router.delete('/user/:id', identifyUser, authorizeRole(['admin','seed']), deleteUser)
router.delete('/delete/:id', identifyUser, authorizeRole(['seed']), deleteAdmin)

// ... lembrar de colocar isso no index.js para aplicar tambem antes de entrar em /admin
//router.get('/users', identifyUser, isAdmin, getAllUser);

export default router