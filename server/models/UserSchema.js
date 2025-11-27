import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        sparse: true,
        trim: true
    },
    lastName: {
        type: String,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    password: {
        type: String,
        default: null,
        select: false
    },
    picture: {
        type: String,
        trim: true
        // default: null,
    },
    google_picture: {
        type: String,
        trim: true
        // default: null,
    },
    gender: {
        type: String,
        enum: ["men", "women", "other"],
        trim: true
        // default: null,
    },
    // stylePreference: {
    //     type: String,
    //     enum: ["men", "women", "both"],
    //     // default: null,
    // },
    contactNo: {
        type: String,
        trim: true
        // default: null,
    },
    dob: {
        type: Date,
        trim: true
        // default: null,
    },
    country: {
        type: String,
        trim: true
        // default: null,
    },
    city: {
        type: String,
        trim: true
        // default: null,
    },
    // status: {
    //     reset: {
    //         token: { type: String },
    //         expiry: { type: Date },
    //     },
    //     verified: {
    //         type: Boolean,
    //         default: false
    //     },
    //     verify: {
    //         token: String,
    //         expiry: Date
    //     }
    // }
})


export const User = mongoose.model("User", UserSchema, "users")