import mongoose from "mongoose"
const schema2 = mongoose.Schema
const staff_schema = new schema2({
    Name: String,
    Gender: String,
    Email: String,
    Date_Of_Birth: String,
    Contact_Number: String,
    Qualification: String,
    Address: String,
    Password: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
})
const StaffModel = mongoose.model("Staff", staff_schema)
export default StaffModel 