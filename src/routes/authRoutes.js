import express from "express"
import authController from "../controllers/authController.js"


const router = express.Router()

router.get('/', (req, res) => {
    
    res.redirect('public/pages/login.html')
    //res.sendFile(path.join(process.cwd(), 'public', 'login.html'))
})

router.post('/login', authController.login)

export default router
