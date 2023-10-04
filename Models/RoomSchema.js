import mongoose from "mongoose"
const schema4 = mongoose.Schema
const room_schema = new schema4({
    RoomNumber: String,
    RoomType: String,
    GuestNumber: Number,
    Availability: String,
    Charge: Number,
    admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
})
const RoomModel = mongoose.model("Room", room_schema)
export default RoomModel 