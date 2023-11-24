import mongoose from "mongoose";

declare module 'express-session' {
    interface SessionData {
        userId: mongoose.Types.ObjectId
        branchId: mongoose.Types.ObjectId
        businessId: mongoose.Types.ObjectId
        role: string
        roleSe: string
        forgotPwdCode: string
        email: string
    }
}