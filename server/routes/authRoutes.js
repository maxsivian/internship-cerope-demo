import express from "express"
const router = express.Router()
import mongoose from "mongoose"

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"

import { validateEmail, validatePassword, validateName } from "../services/validateForm.js"
import { User } from "../models/UserSchema.js"

import handlebars from "handlebars"
import { emailTransporter } from "../utils/emailTransporter.js"

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SignUpVerificationTemplate = path.join(__dirname, "../templates/signup-verification.html");
const SignUpVerificationTemplateData = await fs.readFile(SignUpVerificationTemplate, "utf8");
const compiledSignUpVerificationTemplateData = handlebars.compile(SignUpVerificationTemplateData);

const ResetPasswordTemplate = path.join(__dirname, "../templates/reset-password.html");
const ResetPasswordTemplateData = await fs.readFile(ResetPasswordTemplate, "utf8");
const compiledResetPasswordTemplateData = handlebars.compile(ResetPasswordTemplateData);

const JWT_SECRET = process.env.JWT_SECRET

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const CLIENT_BASE = process.env.CLIENT_BASE



router.get("/check-email", async (req, res) => {
    try {
        console.log("req.query", req.query);

        const email = req.query?.email?.trim().toLowerCase()
        // return res.status(500).json({ message: "Test" });


        const EmailValidity = validateEmail(email)
        if (!EmailValidity.status) {
            return res.status(400).json({ success: false, message: EmailValidity.message })
        }

        let doUserExist = await User.findOne({ email: email })
        if (doUserExist) {
            return res.status(409).json({ success: false, message: "Email already exists. Try signing in." })
        }
        else {
            return res.status(200).json({ message: "Email is available." });
        }


    } catch (error) {
        console.log("authRoutes (post) `/pre-signup` error: ", error)
        // console.log("error.name: ", error.name)
        // console.log("error.message: ", error.message)

        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
        }

        return res.status(500).json({ success: false, message: error.message, error: error });
    }
})


router.post("/google-auth", async (req, res) => {
    try {
        // console.log("google auth backend called");
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: "Missing token" });

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // console.log("picture", picture);

        // Split full name into first and last
        const fullName = name || "";
        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");

        let user = await User.findOne({ email });

        if (!user) {
            let newUser = new User({
                firstName,
                lastName,
                email,
                google_picture: picture,
                status: {
                    verified: true,
                }
            });
            await newUser.save()
            user = newUser
        }

        if (user.google_picture !== picture) {
            await user.updateOne({ $set: { google_picture: picture } })
        }

        const { firstNamE, lastNamE, dob, gender, country } = user
        const redirectToSetup = !(!!(firstNamE && lastNamE && dob && gender && country))

        const data = { mongo_id: user.id };
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" });

        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: true,
            // sameSite: "Lax",
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            redirectToSetup: redirectToSetup,
            user: {
                mongo_id: user.id,
                name: user.firstName,
                email: user.email,
                picture: user.picture || user.google_picture
            }
        });

    } catch (error) {
        console.log("authRoutes (post) `/google-auth` error: ", error)
        // console.log("error.name: ", error.name)
        // console.log("error.message: ", error.message)

        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
        }

        return res.status(500).json({ success: false, message: error.message, error: error });
    }
});


router.post("/pre-signup", async (req, res) => {
    try {
        // console.log("req.body", req.body);

        let { name, email, password } = req.body

        name = name?.trim()
        email = email?.trim().toLowerCase()
        password = password?.trim()


        // const NameValidity = validateName(name)

        // if (!NameValidity.status) {
        //     return res.status(400).json({ success: false, message: NameValidity.message })
        // }


        const EmailValidity = validateEmail(email)
        if (!EmailValidity.status) {
            return res.status(400).json({ success: false, message: EmailValidity.message })
        }


        const PasswordValidity = validatePassword(password)
        if (!PasswordValidity.status) {
            return res.status(400).json({ success: false, message: PasswordValidity.message })
        }


        let doUserExist = await User.findOne({ email: email.trim().toLowerCase() })
        if (doUserExist) {
            return res.status(400).json({ success: false, message: "Email already exists. Try signing in" })
        }

        const salt = await bcrypt.genSalt(10)
        const securedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            // name: name,
            email: email,
            password: securedPassword
        })


        // //email part
        // const token = crypto.randomBytes(32).toString('hex');
        // newUser.status.verify = {
        //     token,
        //     expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        //     // expiry: Date.now() // testing
        // };

        await newUser.save()


        // const verifyLink = `${CLIENT_BASE}/signup/verification?email=${newUser.email}&token=${token}`;
        // console.log("verify link", verifyLink);

        // const SignUpVerificationHTML = compiledSignUpVerificationTemplateData({
        //     name: newUser.name,
        //     action_url: verifyLink,
        // });

        // let mailOptions = {
        //     from: '"Action List Support" <maxsivian.legend@gmail.com>',
        //     to: newUser.email,
        //     subject: 'Account Verification',
        //     html: SignUpVerificationHTML
        // };

        // await emailTransporter.sendMail(mailOptions)

        return res.status(200).json({
            success: true,
            data: email
        });

    } catch (error) {
        console.log("authRoutes (post) `/pre-signup` error: ", error)
        // console.log("error.name: ", error.name)
        // console.log("error.message: ", error.message)

        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
        }

        return res.status(500).json({ success: false, message: error.message, error: error });
    }
})


// router.get("/post-signup", async (req, res) => {
//     try {
//         // console.log("req.query", req.query);

//         let { email, token } = req.query

//         email = email?.trim().toLowerCase()
//         token = token.trim()

//         if (!email) {
//             return res.status(404).json({ success: false, message: "Email is missing" })
//         }

//         if (!token) {
//             return res.status(404).json({ success: false, message: "Token is missing" })
//         }


//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "Email not found" });
//         }

//         if (user.status.verified) {
//             // Already verified
//             console.log("User already verified");
//         } else {
//             if (user.status.verify?.token !== token) {
//                 return res.status(400).json({ success: false, message: "Invalid token", data: email });
//             }
//             else if (user.status.verify?.expiry < Date.now()) {
//                 return res.status(400).json({ success: false, message: "Expired token", data: email });
//             }

//             user.status.verified = true;
//             user.status.verify = undefined;
//             await user.save();
//         }

//         const { firstName, lastName, dob, gender, country } = user

//         const redirectToSetup = !(!!(firstName && lastName && dob && gender && country))

//         const data = { mongo_id: user.id }
//         const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" })
//         // console.log("authToken", authToken);

//         res.cookie("authToken", authToken, {
//             httpOnly: true,
//             secure: true,
//             // sameSite: "Lax", // or "None" if cross-site
//             sameSite: "None",
//             maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
//         });

//         return res.status(201).json({
//             success: true,
//             // authToken,
//             redirectToSetup: redirectToSetup,
//             user: {
//                 mongo_id: user.id,
//                 name: user.name,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         console.log("authRoutes (get) `/post-signup` error: ", error)
//         // console.log("error.name: ", error.name)
//         // console.log("error.message: ", error.message)

//         if (mongoose.connection.readyState !== 1) {
//             return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
//         }

//         return res.status(500).json({ success: false, message: error.message, error: error });
//     }
// })


router.post("/signin", async (req, res) => {
    try {
        // console.log("req.body", req.body);

        let { email, password } = req.body

        email = email?.trim().toLowerCase()
        password = password?.trim()

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is empty" })
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is empty" })
        }

        let user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password")

        // console.log("user", user);

        if (!user) {
            return res.status(400).json({ success: false, message: "Email not found" })
        }

        // if (!user.status.verified) {
        //     return res.status(400).json({ success: false, message: "Email not verified yet. Check your email", data: email })
        // }

        if (user.password == null) {
            return res.status(400).json({ success: false, message: "This account was created using Google Sign-In. Please sign in with Google or use 'Forgot Password' to set a password." })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)

        if (!passwordCompare) {
            return res.status(400).json({ success: false, message: "Wrong password" })
        }

        const { firstName, lastName, dob, gender, country } = user
        const redirectToSetup = !(!!(firstName && lastName && dob && gender && country))

        // console.log("user_ID", user._id)
        // console.log("user ID", user.id)
        const data = { mongo_id: user.id }


        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" })
        // console.log("authToken", authToken);

        // Set httpOnly cookie
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: true,
            // sameSite: "Lax", // or "None" if cross-site
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });


        return res.status(200).json({
            success: true,
            // authToken,
            redirectToSetup: redirectToSetup,
            user: {
                mongo_id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log("authRoutes (post) `/signin` error: ", error)
        // console.log("error.name: ", error.name)
        // console.log("error.message: ", error.message)

        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
        }

        return res.status(500).json({ success: false, message: error.message, error: error });
    }
});


router.post("/signout", async (req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: true,
            // sameSite: "Lax",
            sameSite: "None",
        });

        // console.log("Signed out successfully");
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("authRoutes (post) `/signout` error: ", error);
        return res.status(500).json({ success: false, message: "Failed to sign out", error: error });
    }
});



// router.post("/resend-verification-email", async (req, res) => {
//     try {
//         let { email } = req.body;
//         // console.log("email", email);
//         email = email?.trim().toLowerCase()

//         if (!email) {
//             return res.status(400).json({ success: false, message: "Email is empty" })
//         }

//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             return res.status(400).json({ success: false, message: "Email format is not valid" })
//         }

//         const user = await User.findOne({ email: email.trim().toLowerCase() });

//         if (!user) {
//             return res.status(404).json({ success: false, message: "Email not found" });
//         }

//         if (user.status.verified) {
//             return res.status(400).json({ success: false, message: "Email already verified. Try Sign In" });
//         }

//         // Create new token
//         const token = crypto.randomBytes(32).toString('hex');
//         user.status.verify = {
//             token,
//             expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
//         };
//         await user.save();

//         const verifyLink = `${CLIENT_BASE}/signup/verification?email=${user.email}&token=${token}`;

//         // console.log("verify link (resent):", verifyLink);

//         const SignUpVerificationHTML = compiledSignUpVerificationTemplateData({
//             name: user.name,
//             action_url: verifyLink,
//         });

//         let mailOptions = {
//             from: '"Action List Support" <maxsivian.legend@gmail.com>',
//             to: user.email,
//             subject: 'Account Verification',
//             html: SignUpVerificationHTML
//         };

//         await emailTransporter.sendMail(mailOptions)

//         return res.status(200).json({ success: true });
//     } catch (error) {
//         console.log("authRoutes (post) `/resend-verification-email` error: ", error)
//         // console.log("error.name: ", error.name)
//         // console.log("error.message: ", error.message)

//         if (mongoose.connection.readyState !== 1) {
//             return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
//         }

//         return res.status(500).json({ success: false, message: error.message, error: error });
//     }
// });



// router.post("/request-reset-password", async (req, res) => {
//     try {
//         // console.log("req.body", req.body);

//         let { email } = req.body
//         email = email?.trim().toLowerCase()

//         // console.log("email", email);

//         if (!email) {
//             return res.status(400).json({ success: false, message: "Email is empty" })
//         }

//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             return res.status(400).json({ success: false, message: "Email format is not valid" })
//         }

//         const user = await User.findOne({ email: email.trim().toLowerCase() });
//         if (!user) {
//             return res.status(404).json({ success: false, message: "Email not found" })
//             // console.log("user not exist");
//             // return res.status(200).json({ success: true }); //wont let unknow user to know whether email exists or not
//         }
//         else {
//             const token = crypto.randomBytes(32).toString('hex');
//             user.status.reset = {
//                 token: token,
//                 expiry: Date.now() + 3600000
//                 // expiry: Date.now()
//             };
//             await user.save()


//             const resetLink = `${CLIENT_BASE}/resetpassword/?name=${user.name}&email=${user.email}&token=${token}`;

//             // console.log('Reset link:', resetLink);


//             const ResetPasswordHTML = compiledResetPasswordTemplateData({
//                 name: user.name,
//                 action_url: resetLink,
//             });


//             let mailOptions = {
//                 from: '"Action List Support" <maxsivian.legend@gmail.com>',
//                 to: user.email,
//                 subject: 'Password Reset',
//                 html: ResetPasswordHTML
//             };

//             await emailTransporter.sendMail(mailOptions)

//             return res.status(200).json({ success: true });
//         }


//     } catch (error) {
//         console.log("authRoutes (post) `/request-reset` error: ", error)
//         // console.log("error.name: ", error.name)
//         // console.log("error.message: ", error.message)

//         if (mongoose.connection.readyState !== 1) {
//             return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
//         }

//         return res.status(500).json({ success: false, message: error.message, error: error });
//     }
// })



// router.post("/reset-password", async (req, res) => {
//     try {
//         // console.log("req.body", req.body);

//         let { password, token, email } = req.body

//         email = email?.trim().toLowerCase()
//         password = password?.trim()
//         token = token?.trim()

//         // console.log("token", token);
//         // console.log("password", password);
//         // console.log("email", email);

//         if (!token) {
//             return res.status(400).json({ success: false, message: "Token is empty" })
//         }
//         if (!email) {
//             return res.status(400).json({ success: false, message: "Email is empty" })
//         }
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             return res.status(400).json({ success: false, message: "Email format is not valid" })
//         }
//         if (!password) {
//             return res.status(400).json({ success: false, message: "Password is empty" })
//         }
//         const isPasswordValid = validatePassword(password)
//         if (!isPasswordValid) {
//             return res.status(400).json({ success: false, message: "Please fulfill password conditions" })
//         }


//         // const user = await User.findOne({
//         //     email: email.trim().toLowerCase(),
//         //     "status.reset.token": token,
//         //     "status.reset.expiry": { $gt: Date.now() },
//         // });
//         // if (!user) {
//         //     return res.status(400).json({ success: false, message: "Expired token" })
//         // }

//         const user = await User.findOne({
//             email: email.trim().toLowerCase(),
//         });

//         if (!user) {
//             return res.status(404).json({ success: false, message: "Email not found" })
//         }

//         if (user.status.reset.token !== token) {
//             return res.status(400).json({ success: false, message: "Invalid token" })
//         }

//         if (user.status.reset.expiry < Date.now()) {
//             return res.status(400).json({ success: false, message: "Expired token" })
//         }

//         const salt = await bcrypt.genSalt(10)
//         const securedPassword = await bcrypt.hash(password, salt)

//         user.password = securedPassword
//         user.status.reset = undefined

//         await user.save()

//         return res.status(200).json({ success: true });

//     } catch (error) {
//         console.log("authRoutes (post) `/request-reset/:token` error: ", error)
//         // console.log("error.name: ", error.name)
//         // console.log("error.message: ", error.message)

//         if (mongoose.connection.readyState !== 1) {
//             return res.status(500).json({ success: false, message: "Server database is under maintainance", error: error });
//         }

//         return res.status(500).json({ success: false, message: error.message, error: error });
//     }
// })


export default router








