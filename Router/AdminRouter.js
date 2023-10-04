import express from 'express'
const router = express.Router()
import { signup, admindata, login, postlogin, addstaff, staffdata, adminhome, removestaff, addRooms, Roomdata, roomHome, removeroom, addroom, addguestTable, guestdata, adminLogout, searchByRoomNo, searchByDate, downloadReport, deleteGuest } from '../Router/AdminController.js'
let isLoggedIn = false

export function getIsLoggedInBool(data) {
    isLoggedIn = data
}

const AuthMiddleware = (req, res, next) =>{
    if (isLoggedIn == true) {
        next()
    }
    else {
        res.redirect('/login')
    }
}
// admin router localhost 8080.....
router.get('/', signup)
router.post('/admindata', admindata)


//admin router... login after signup.........
router.get('/login', login)


//admin router.. login and checking login details
router.post('/postlogin', postlogin)


//admin router... home.... click add staff.....
router.get('/addstaff', AuthMiddleware, addstaff)


//admin router...form ...adding staff details...
router.post('/staffdata', AuthMiddleware, staffdata)


//admin router ...staff details on admin home...
router.get("/adminhome", AuthMiddleware, adminhome)


//admin router...roomhome...
router.get('/roomHome', AuthMiddleware, roomHome)


//admin router...adding room data...
router.post('/Roomdata', AuthMiddleware, Roomdata)


//admin router...room data on the admin home....
router.get('/addRooms', AuthMiddleware, addRooms)


//admin router...delete staff from admin home...
router.get("/delete/:id", AuthMiddleware, removestaff)

//admin router...delete room from admin home...
router.get("/deleter/:id", AuthMiddleware, removeroom)


router.get("/addroom", AuthMiddleware, addroom)


router.post('addguestTable', AuthMiddleware, addguestTable)

router.get('/guestdata', AuthMiddleware, guestdata)

router.get('/logout', AuthMiddleware, adminLogout)

router.post('/search', AuthMiddleware, searchByRoomNo)

router.post('/search/date', AuthMiddleware, searchByDate)

router.get('/download/report/:date', AuthMiddleware, downloadReport)

router.get('/delete/guest/:guest_id', AuthMiddleware, deleteGuest)


export default router