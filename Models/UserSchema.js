import mongoose from "mongoose"
const schema3 = mongoose.Schema
const user_schema = new schema3 ({
    Name: String,
    Contact_Number: String,
    Age: Number,
    Nationality: String,
    ID_Proof: String,
    ID_Number: String,
    Payment_Method: String,
    Payment_ID: String,
    Room_No: Number,
    Guest_Number: Number,
    Check_In_Date: String,
    Amount:String,
    admin: { type: mongoose.Types.ObjectId, ref: "Admin"}
})
const UserModel = mongoose.model("User", user_schema)
export default UserModel