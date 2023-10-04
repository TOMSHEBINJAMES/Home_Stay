import mongoose from "mongoose"
import { base_url } from "./config.js"

const db = () => {
    mongoose.connect(base_url,((err)=>{
        if(err) {
            console.log("db is not connected")
        }
        else {
            console.log("db connected")
        }
    }))
}

export default db