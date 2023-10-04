import express from 'express'
const router = express.Router()
import { staffloginGet, staffloginPost, addguestdata, guestform, guestdetails, roomdata, staffLogout } from './StaffController.js'
let isLoggedIn = false

export function getIsLoggedInBool(data) {
    isLoggedIn = data
}

const AuthMiddleware = (req, res, next) => {
    if (isLoggedIn == true) {
        next()
    }
    else {
        res.redirect('/staff')
    }
}


//staff login ....
router.get('/', staffloginGet)

// router.get('/staffHome',staffHomeGet)

// staff login checking..........
router.post('/staffloginpost', staffloginPost)


//staff add guest form........
router.get("/addguest/:staffid", AuthMiddleware, guestform)


//staff....adding guest details.......
router.post("/addguestdata/:staffid", AuthMiddleware, addguestdata)

//staff.....guest details.........
router.get("/guestdetails/:staffid", AuthMiddleware, guestdetails)


router.get('/roomdata/:staffid', AuthMiddleware, roomdata)

router.get('/logout', AuthMiddleware, staffLogout)

export default router
