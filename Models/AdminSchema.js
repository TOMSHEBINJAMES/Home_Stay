import mongoose, { Types } from "mongoose"
const schema1 = mongoose.Schema
const admin_schema = new schema1({
    Name: String,
    Email: String,
    password: String,
    Homestay: String,
    Address: String,
    staffs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
})
const AdminModel = mongoose.model("Admin", admin_schema)
export default AdminModel