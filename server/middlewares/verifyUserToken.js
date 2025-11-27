// middlewares/verifyUserToken.js

import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET


export const verifyUserToken = (req, res, next) => {
    // const token = req.header("auth-token")
    const token = req.cookies.authToken; // 
    // console.log("Token Received:", token)

    if (!token) {
        return res.status(401).json({ success: false, message: "No auth token found. Sign In again" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.mongo_id = data.mongo_id

        // console.log("data",data);
        // console.log("req.mongo_id",req.mongo_id);

        // return res.status(210).json({ error: "TEMP BLOCK" })
        next()
    } catch (error) {
        // console.log("error.name", error.name);
        // console.log("error.message", error.message);
        // if (error.name === "TokenExpiredError") {
        //     return res.status(401).json({ success: false, message: "Auth token expired" })
        // }
        return res.status(401).json({ success: false, message: error.message, error:error })
    }
}

