import { configDotenv } from "dotenv";
import express from 'express'
import morgan from "morgan";
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'

configDotenv()
const app=express()
const PORT=process.env.PORT

//global rate limiting
const limiter=rateLimit({
    windowMs:15*60*1000,
    limit:100,
    message:"Error!! To many requests detected ! please try later"
})

//security
app.use(hpp())
app.use(limiter)
app.use(helmet())
app.set('trust proxy', 1)




app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:'10kb'}))

if(process.env.NODE_ENV=="DEVELOPMENT"){
app.use(morgan('dev'))

}



//404 route 
app.use((req,res)=>{
    res.status(404).json({
        status:'error',
        message:'Route not found'
    })
})
//global error handler
app.use((err,req,res,next)=>{
    console.error(err.stack)
    res.status(err.status||500).json({
        status:'error',
        message:err.message||'Internal Server Error',
        ...(process.env.NODE_ENV=='DEVELOPMENT'&&{stack:err.stack})
    })
})

app.listen(PORT,()=>{
    console.log(`App is running on http://localhost:${PORT}`)
    return 
})
