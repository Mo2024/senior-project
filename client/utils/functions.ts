import mongoose from "mongoose";
import * as UserApi from "../network/user_api";
import { emailRegex, ownerCprRegex, passwordRegex, usernameRegex, fullNameRegex, telephoneRegex, addressRegex } from "./regex";


export default async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) return response;
    const errorBody = await response.json();
    throw new Error(errorBody.error)
}

export async function deleteData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.status === 204) return
    if (response.ok) return response
    const errorBody = await response.json();
    throw new Error(errorBody.error);
}

export async function validateLogin(credentials: UserApi.LoginCredentials) {
    const { username, password } = credentials
    if (!username || !password) throw Error("Parameter Missing")

}
export async function validateSignup(credentials: UserApi.SignupCredentials) {
    const {
        username,
        email,
        password,
        confirmPassword,
        fullName,
        telephone,
        area,
        road,
        block,
        building,
        cpr
    } = credentials
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("Full Name:", fullName);
    console.log("Telephone:", telephone);
    console.log("Area:", area);
    console.log("Road:", road);
    console.log("Block:", block);
    console.log("Building:", building);
    console.log("Owner CPR:", cpr);

    if (!username || !email || !password || !confirmPassword || !fullName || !telephone || !area || !road || !block || !building || !cpr) {
        throw Error("Parameter Missing")
    }

    if (password !== confirmPassword) {
        throw Error("Passwords do not match!");
    }



    if (!emailRegex.test(email)) {
        throw Error('Invalid email format');
    }
    if (!usernameRegex.test(username)) {
        throw Error('Username must be 3-20 characters, using only letters, numbers, and underscores.');
    }
    if (!fullNameRegex.test(fullName)) {
        throw Error('Invalid Full Name format');
    }
    if (!telephoneRegex.test(telephone)) {
        throw Error('Telephone input must be only 8 digits');
    }
    if (!passwordRegex.test(password)) {
        throw Error('Make sure passwords have at least one lowercase letter, one uppercase letter, one digit, and one special character!');
    }

    if (!fullNameRegex.test(area)) {
        throw Error('Invalid area format');
    }
    if (!addressRegex.test(road)) {
        throw Error('Invalid road format');
    }
    if (!addressRegex.test(block)) {
        throw Error('Invalid block format');
    }
    if (!addressRegex.test(building)) {
        throw Error('Invalid building format');
    }
    if (cpr && !ownerCprRegex.test(cpr.toString())) {
        throw Error('Invalid owner CPR format');
    }

}

interface IUserInfo {
    _id: mongoose.Types.ObjectId
    __t: mongoose.Types.ObjectId

}
export async function userRouter(userType: string) {
    if (userType == "Owner") {
        return 'OwnerNav'
    } else if (userType == 'Employee') {
        return 'EmployeeNav'
    } else if (userType == 'Admin') {
        return 'AdminNav'
    } else if (userType == 'AttendanceUser') {
        return 'AttendanceQrCode'
    } else if (userType == 'SeUser') {
        return 'SelfCheckout'
    }
}