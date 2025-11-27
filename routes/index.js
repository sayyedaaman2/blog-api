import express from 'express';
const router = express.Router();
import authRoutes from './auth.route.js'
router.get("/", (req,res)=>{
            res.send("Hello World!")
        })
router.use("/auth",authRoutes)

export default router;