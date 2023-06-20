import { emailRegex, ownerCprRegex, passwordRegex, usernameRegex, fullNameRegex, telephoneRegex, addressRegex } from "../util/regex";
import createHttpError from "http-errors";

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
