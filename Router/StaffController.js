import RoomModel from "../Models/RoomSchema.js"
import StaffModel from "../Models/StaffSchema.js"
import UserModel from "../Models/UserSchema.js"
import AdminModel from "../Models/AdminSchema.js"
import { encrypt_token } from "../AES_ENCRYPTION/aes_encryption.js"
import { getIsLoggedInBool } from "./StaffRouter.js"

let staffError = false
let notStaff = false

//staff login...
export const staffloginGet = (req, res) => {
    res.render('stafflogin')
}

// staff login post..............
export const staffloginPost = (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    StaffModel.findOne({ Email: email }).lean().exec(async (err, data) => {
        if (err) {

            console.log("err", err);
        }
        else {
            console.log("data", data);
            if (data != null) {
                notStaff = false

                if (password === data.Password) {
                    staffError = false
                    getIsLoggedInBool(true)
                    const staff_id = data._id
                    let staff_details = await StaffModel.findById(staff_id).populate("admin").lean()
                    let admin_id = staff_details.admin
                    let guestdetails = await AdminModel.findById(admin_id).populate("guests").lean()
                    console.log("guests :- ", guestdetails.guests);
                    if (guestdetails.guests != null) {
                        res.render('StaffHome', { guestdetails: guestdetails.guests, staff_id })
                    }
                    else {
                        res.render('StaffHome', { staff_id })
                    }

                }
                else {
                    staffError = true
                    res.redirect('/staff')
                }
            }
            else {
                notStaff = true
                res.redirect('/staff')
            }
        }

    })
}

// adding guest details.........
export const addguestdata = async (req, res) => {
    const staff_id = req.params.staffid
    let staff_details = await StaffModel.findById(staff_id).populate("admin").lean()
    let admin_id = staff_details.admin
    let { Name, Contact_Number, Age, Nationality, ID_Proof, ID_Number, Payment_Method, Payment_ID, Room_No, Guest_Number, Check_In_Date, Amount } = req.body
    const guestdetail = new UserModel({
        Name: Name,
        Contact_Number: encrypt_token(Contact_Number),
        Age: Age,
        Nationality: Nationality,
        ID_Proof: ID_Proof,
        ID_Number: encrypt_token(ID_Number),
        Payment_Method: Payment_Method,
        Payment_ID: encrypt_token(Payment_ID),
        Room_No: Room_No,
        Guest_Number: Guest_Number,
        Check_In_Date: Check_In_Date,
        Amount: Amount,
        admin: admin_id
    })
    await guestdetail.save()

    let guest = await UserModel.findOne({ ID_Number: encrypt_token(ID_Number) })
    let admin = await AdminModel.findByIdAndUpdate(admin_id, { $push: { guests: guest._id } })
    await admin.save()
    await RoomModel.findOneAndUpdate({ RoomNumber: Room_No,admin:admin_id }, { Availability: "No" })
    console.log(guestdetail)
    let guestdetails = await AdminModel.findById(admin_id).populate("guests").lean()
    res.render('StaffHome', { guestdetails: guestdetails.guests, staff_id })
}


//staff home guest form..........
export const guestform = async (req, res) => {
    const staff_id = req.params.staffid
    let admin_details = await StaffModel.findById(staff_id).populate("admin").lean()
    const admin_id = admin_details.admin
    let available_rooms = await RoomModel.find({ Availability: "Yes", admin: admin_id }).lean()
    console.log("available_rooms", available_rooms);
    res.render("addguestform", { staff_id, available_rooms })
}


//guest details on staff home...........
export const guestdetails = async (req, res) => {
    const staff_id = req.params.staffid
    let staff_details = await StaffModel.findById(staff_id).populate("admin").lean()
    let admin_id = staff_details.admin
    console.log("guestdetails..................")
    let guestdetails = await AdminModel.findById(admin_id).populate("guests").lean()
    let total_rooms = await RoomModel.find({ admin: admin_id }).lean()
    res.render('StaffHome', { guestdetails: guestdetails.guests, staff_id,total_rooms })

}


export const roomdata = async (req, res) => {
    const staff_id = req.params.staffid
    let staff = await StaffModel.findById(staff_id).populate("admin").lean()
    let admin = staff.admin
    let admin_id = admin._id
    let total_rooms = await RoomModel.find({ admin: admin_id }).lean()
    console.log("total rooms",total_rooms);
    res.render('StaffRoom', { roomdetails: total_rooms, staff_id })
}

export const staffLogout = (req,res) =>{
    getIsLoggedInBool(false)
    res.redirect('/staff')
} 



