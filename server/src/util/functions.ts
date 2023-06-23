import mongoose, { Schema } from "mongoose";
import { emailRegex, ownerCprRegex, passwordRegex, usernameRegex, fullNameRegex, telephoneRegex, addressRegex, businessNameRegex, descriptionRegex, couponNameRegex, couponPercentageRegex, couponAmounteRegex, openingClosingTimeRegex } from "../util/regex";
import createHttpError from "http-errors";
import nodemailer from 'nodemailer';
import env from '../util/validateEnv';

export function generatePassword(length = 10) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

export function validateOwnerRegex(area: string, road: string, block: string, building: string, ownerCpr: number) {
    if (!fullNameRegex.test(area)) {
        throw createHttpError(400, 'Invalid area format');
    }
    if (!addressRegex.test(road)) {
        throw createHttpError(400, 'Invalid road format');
    }
    if (!addressRegex.test(block)) {
        throw createHttpError(400, 'Invalid block format');
    }
    if (!addressRegex.test(building)) {
        throw createHttpError(400, 'Invalid building format');
    }
    if (ownerCpr && !ownerCprRegex.test(ownerCpr.toString())) {
        throw createHttpError(400, 'Invalid owner CPR format');
    }
}

export function validateUserRegex(username: string, email: string, password: string, confirmPassword: string, fullName: string, telephone: string) {
    if (!usernameRegex.test(username)) {
        throw createHttpError(400, 'Invalid username format');
    }
    if (!emailRegex.test(email)) {
        throw createHttpError(400, 'Invalid email format');
    }
    if (!passwordRegex.test(password) || !passwordRegex.test(confirmPassword)) {
        throw createHttpError(400, 'Make sure passwords have at least one lowercase letter, one uppercase letter, one digit, and one special character!');
    }
    if (!fullNameRegex.test(fullName)) {
        throw createHttpError(400, 'Invalid area format');
    }
    if (!telephoneRegex.test(telephone)) {
        throw createHttpError(400, 'Telephone input must be only 8 digits');
    }
}
export function validateBusinessRegex(name: string, description: string) {
    if (!businessNameRegex.test(name)) {
        throw createHttpError(400, 'Invalid Business name');
    }
    if (!descriptionRegex.test(description)) {
        throw createHttpError(400, 'Description can be at most 50 letters');
    }
}
export function validateEmployeeRegex(brandId: Schema.Types.ObjectId, cpr: number, username: string, email: string, fullName: string, telephone: string) {
    if (!usernameRegex.test(username)) {
        throw createHttpError(400, 'Invalid username format');
    }
    if (!emailRegex.test(email)) {
        throw createHttpError(400, 'Invalid email format');
    }
    if (!fullNameRegex.test(fullName)) {
        throw createHttpError(400, 'Invalid area format');
    }
    if (!telephoneRegex.test(telephone)) {
        throw createHttpError(400, 'Telephone input must be only 8 digits');
    }
    if (cpr && !ownerCprRegex.test(cpr.toString())) {
        throw createHttpError(400, 'Invalid owner CPR format');
    }
    if (!mongoose.isValidObjectId(brandId)) {
        throw createHttpError(404, 'Invalid business id!')
    }
}
export function validateBranchRegex(name: string, businessId: Schema.Types.ObjectId, openingTime: string, closingTime: string, lateTime: string) {
    if (!mongoose.isValidObjectId(businessId)) {
        throw createHttpError(404, 'Invalid business id!')
    }
    if (!businessNameRegex.test(name)) {
        throw createHttpError(400, 'Invalid Branch name');
    }
    if (!openingClosingTimeRegex.test(openingTime)) {
        throw createHttpError(400, 'Invalid opening time!');
    }
    if (!openingClosingTimeRegex.test(closingTime)) {
        throw createHttpError(400, 'Invalid closing time!');
    }
    if (!openingClosingTimeRegex.test(lateTime)) {
        throw createHttpError(400, 'Invalid late time!');
    }
}
export function validateCouponRegex(name: string, businessId: Schema.Types.ObjectId, amount: number, type: string) {
    if (!couponNameRegex.test(name)) {
        throw createHttpError(400, 'Coupon must be at most 15 letters and only alphabet letters');
    }
    if (!mongoose.isValidObjectId(businessId)) {
        throw createHttpError(404, 'Invalid business id!')
    }
    if (type == "percentage") {
        if (!couponPercentageRegex.test(amount.toString())) {
            throw createHttpError(400, 'Percentage must be greater than 0 and at most 100!');
        }
    } else if (type == "amount") {
        if (!couponAmounteRegex.test(amount.toString())) {
            throw createHttpError(400, 'Amount must be a number only!');
        }
    } else {
        throw createHttpError(400, 'Invalid coupon type!');
    }

}


export function isImageFile(imageName: string): boolean {
    const fileExtension = imageName.split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    return allowedExtensions.includes(fileExtension?.toLowerCase() || '');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: env.smtpEmail,
        pass: env.smtpPassword,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {

        const mailOptions = {
            from: 'Senior Project',
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        return true

    } catch (error) {
        console.error('Error sending email:', error);
        return false
    }
};