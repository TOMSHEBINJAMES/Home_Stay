import AdminModel from "../Models/AdminSchema.js"
import bcrypt from "bcrypt"
import StaffModel from "../Models/StaffSchema.js"
import RoomModel from "../Models/RoomSchema.js"
import { decrypt_token } from "../AES_ENCRYPTION/aes_encryption.js"
import { getIsLoggedInBool } from "./AdminRouter.js"
import { convertJsonToExcel } from "../EXCEL_EXTRACTER/jsonToXlsx.js"
import { __dirname } from "../main.js"
import UserModel from "../Models/UserSchema.js"

let err = false
let notUser = false
let temp_admin = {}
let occupied = false
let guestdetails = {}  

// admin router localhost 8080
export const signup = (req, res) => {
    res.render("adminsignup")
}

// admin router storing signup details .....
export const admindata = async (req, res) => {
    console.log(req.body)
    let { name, email, password, homestay, address } = req.body

    password = bcrypt.hashSync(password, 10)
    const admindetails2 = new AdminModel({
        Name: name,
        Email: email,
        password: password,
        Homestay: homestay,
        Address: address
    })
    await admindetails2.save()
    res.redirect('/login')
}

// admin router login.... after signup.......
export const login = (req, res) => {
    res.render('login', { err, notUser })
}


//admin router login checking...............
export const postlogin = async (req, res) => {
    let { email, password } = req.body
    console.log("checking", email, password)
    var admindetails2 = await AdminModel.findOne({ Email: email })
    if (admindetails2 != null) {
        notUser = false
        console.log("Admin ");
        if (bcrypt.compareSync(password, admindetails2.password)) {
            err = false
            getIsLoggedInBool(true)
            temp_admin.id = admindetails2._id
            //const admin_id=admindetails2._id
            res.redirect("/adminhome")
        }
        else {
            err = true
            res.redirect('/login')
        }
    }
    else {
        notUser = true
        res.redirect('/login')
    }
}


// admin router... form for adding staff details.........
export const addstaff = (req, res) => {
    res.render('addstaff')
}

//admin router...adding staff details....
export const staffdata = async (req, res) => {
    let { Name, Gender, Email_ID, Contact_Number, Date_Of_Birth, Qualification, Address, Password } = req.body
    const staffdetails2 = new StaffModel({
        Name: Name,
        Gender: Gender,
        Email: Email_ID,
        Contact_Number: Contact_Number,
        Date_Of_Birth: Date_Of_Birth,
        Qualification: Qualification,
        Address: Address,
        Password: Password,
        admin: temp_admin.id
    })
    await staffdetails2.save()
    let staff = await StaffModel.findOne({ Email: Email_ID })
    let admin = await AdminModel.findByIdAndUpdate(temp_admin.id, { $push: { staffs: staff._id } })
    console.log("updated admin", admin);
    console.log(staffdetails2)
    res.redirect('/adminhome')
}


// admin router...staff details on the admin home...
export const adminhome = async (req, res) => {

    let staffdetails = await AdminModel.findById(temp_admin.id).populate("staffs").lean()
    //let staffdetails=adminDetails.staffs
    // console.log("staff", staffdetails.staffs);
    res.render('adminhome', { staffdetails: staffdetails.staffs })
    console.log("staffs", staffdetails);
}



//admin router..adding room data........
export const Roomdata = async (req, res) => {
    let { RoomNumber, RoomType, GuestNumber, Availability, Charge } = req.body
    let roomdetails = new RoomModel({
        RoomNumber: RoomNumber,
        RoomType: RoomType,
        GuestNumber: GuestNumber,
        Availability: Availability,
        Charge: Charge,
        admin: temp_admin.id
    })
    await roomdetails.save()
    let room = await RoomModel.findOne({ RoomNumber: RoomNumber })
    let admin = await AdminModel.findByIdAndUpdate(temp_admin.id, { $push: { rooms: room._id } })
    console.log("updated_admin", admin);
    await admin.save()
    console.log(roomdetails)
    res.redirect('/addroom')
}


//admin router....roome home.........
export const roomHome = async (req, res) => {
    let roomdetails = await AdminModel.findById(temp_admin.id).populate("rooms").lean()
    //console.log("rooms", roomdetails)
    res.render('roomHome', { roomdetails })
}


export const addRooms = (req, res) => {
    res.render('addRooms')
}

//admin router...remove staff from admin home
export const removestaff = async (req, res) => {
    let id = req.params.id
    console.log(id)
    await StaffModel.findByIdAndRemove(id)
    res.redirect('/adminhome')
}


export const addroom = async (req, res) => {
    // let roomdetails = await AdminModel.findById(temp_admin.id).populate("rooms").lean()
    let admin_id = temp_admin.id
    console.log("admin iD  :-  ", admin_id)
    let total_room = await AdminModel.findById(admin_id).populate("rooms").lean()
    if (total_room != null) {
        console.log("rooms", total_room.rooms);
        res.render('roomHome', { roomdetails: total_room.rooms, occupied })
    }
    else {
        res.render('roomHome')
    }
    occupied = false

}

//admin router...remove room....
export const removeroom = async (req, res) => {
    let id = req.params.id
    console.log("roomid.........", id)
    const room_data = await RoomModel.findById(id).lean()
    if (room_data.Availability == "Yes") {
        await RoomModel.findByIdAndRemove(id)
    }
    else {
        occupied = true
    }
    res.redirect('/addroom')
}


export const addguestTable = (req, res) => {
    res.render("addguestform")
}

export const guestdata = async (req, res) => {
    let admin_details = await AdminModel.findById(temp_admin.id).populate("guests").lean()
    let GuestDetails = []
    admin_details.guests.forEach((guest) => {
        guest.Contact_Number = decrypt_token(guest.Contact_Number)
        guest.ID_Number = decrypt_token(guest.ID_Number)
        guest.Payment_ID = decrypt_token(guest.Payment_ID)
        GuestDetails.push(guest)
    })

    res.render('guest', { guestdetails: GuestDetails })
}

export const adminLogout = (req, res) => {
    getIsLoggedInBool(false)
    res.redirect('/login')
}

export const searchByRoomNo = async (req, res) => {
    let room_no = req.body.room_no
    room_no = parseInt(room_no)
    console.log("room no", room_no)

    let admin_details = await AdminModel.findById(temp_admin.id).populate("guests").lean()
    let GuestDetails = []
    admin_details.guests.forEach((guest) => {
        guest.Contact_Number = decrypt_token(guest.Contact_Number)
        guest.ID_Number = decrypt_token(guest.ID_Number)
        guest.Payment_ID = decrypt_token(guest.Payment_ID)
        GuestDetails.push(guest)
    })
    let search_data = {}
    search_data = GuestDetails.map((guest) => {
        if (guest.Room_No == room_no) {
            return guest
        }
    })

    console.log(search_data)
    guestdetails = search_data
    res.render('guest', { guestdetails })
}

export const searchByDate = async (req, res) => {
    let date = req.body.date


    let admin_details = await AdminModel.findById(temp_admin.id).populate("guests").lean()
    let GuestDetails = []
    admin_details.guests.forEach((guest) => {
        guest.Contact_Number = decrypt_token(guest.Contact_Number)
        guest.ID_Number = decrypt_token(guest.ID_Number)
        guest.Payment_ID = decrypt_token(guest.Payment_ID)
        GuestDetails.push(guest)
    })
    let search_data = {}
    search_data = GuestDetails.map((guest) => {
        if (guest.Check_In_Date == date) {
            return guest
        }
    })

    console.log(search_data)
    guestdetails = search_data
    res.render('guest', { guestdetails, date })
}

export const downloadReport = async (req, res) => {
    const date = req.params.date
    console.log(date)

    let admin_details = await AdminModel.findById(temp_admin.id).populate("guests").lean()
    let GuestDetails = []
    admin_details.guests.forEach((guest) => {
        guest.Contact_Number = decrypt_token(guest.Contact_Number)
        guest.ID_Number = decrypt_token(guest.ID_Number)
        guest.Payment_ID = decrypt_token(guest.Payment_ID)
        GuestDetails.push(guest)
    })
    let search_data = {}
    //mapping only needed data to the search_data
    search_data = GuestDetails.map((guest) => {
        if (guest.Check_In_Date == date) {
            return {
                Name: guest.Name,
                Contact_Number: guest.Contact_Number,
                Age: guest.Age,
                Nationality: guest.Nationality,
                ID_Proof: guest.ID_Proof,
                ID_Number: guest.ID_Number,
                Payment_Method: guest.Payment_Method,
                Payment_ID: guest.Payment_ID,
                Room_No: guest.Room_No,
                Guest_Number: guest.Guest_Number,
                Check_In_Date: guest.Check_In_Date,
                Amount: guest.Amount
            }
        }
    })

    //custom function to create excel with search_data
    convertJsonToExcel(search_data, date)


    const file = `${__dirname}/guest_detail_${date}.xlsx`
    res.download(file);
}

export const deleteGuest = async (req, res) => {
    const guest_id = req.params.guest_id

    let guest_data = await UserModel.findById(guest_id)

    let Room_No = guest_data.Room_No
    let room_data = await RoomModel.findOne({ RoomNumber: Room_No })
    let room_id = room_data._id
    await AdminModel.updateOne({ _id: temp_admin.id }, {
        $pullAll: {
            guests: [guest_id],
        },
    })
    await RoomModel.findOneAndUpdate({ RoomNumber: Room_No }, { Availability: "Yes" })
    await UserModel.findByIdAndRemove(guest_id)
    res.redirect('/guestdata')
}


