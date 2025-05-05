
import express from 'express';
import preCheck from '../utils/auth/preCheck';
import loginAccount from '../utils/auth/login-account';
import createAccount from '../utils/auth/create-account';
import searchUser from '../utils/msg/searchMsg'

import createRoom from '../utils/msg/createRoom';
import allChat from '../utils/msg/allChats';
import checkMsg from '../utils/auth/checkMsg';
const router = express.Router();


router.post('/register', preCheck); 
router.post('/login', loginAccount)
router.post('/create-account', createAccount )
router.get('/messages/:name', searchUser)
router.post('/Room', createRoom)
router.get('/chats/:id', allChat)




export default router;
