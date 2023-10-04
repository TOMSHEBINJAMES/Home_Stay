import express from "express"
import bodyParser from "body-parser"
import AdminRouter from "./Router/AdminRouter.js"
import StaffRouter from "./Router/StaffRouter.js"
import exphbs from "express-handlebars"
import path from "path"
import mongoose from 'mongoose'
import db from "./Database/connection.js"   
import { dirname } from "path"
import { fileURLToPath } from "url"

export const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()


//setting up template engine
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "/views"))    
var hbs = exphbs.create({
    helpers: {
        inc: function(value, options)
        {
            return parseInt(value) + 1;
        },
    },
    extname:"hbs",
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, "/views/layouts")
});
app.engine("hbs",hbs.engine)



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//app.use('/admin', AdminRouter)
app.use('/', AdminRouter)
app.use('/staff', StaffRouter)
mongoose.set('strictQuery', false);


db()

app.listen(8080)
