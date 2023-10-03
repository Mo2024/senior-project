import mongoose from "mongoose";
import * as UserApi from "../network/user_api";
import { emailRegex, ownerCprRegex, passwordRegex, usernameRegex, fullNameRegex, telephoneRegex } from "./regex";
import OwnerNav from "../components/OwnerNav";


export default async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) return response;
    const errorBody = await response.json();
    throw new Error(errorBody.error)
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
        ownerCpr,
    } = credentials

    if (!username || !email || !password || !confirmPassword || !fullName || !telephone || !area || !road || !block || !building || !ownerCpr) {
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
    if (!fullNameRegex.test(road)) {
        throw Error('Invalid road format');
    }
    if (!fullNameRegex.test(block)) {
        throw Error('Invalid block format');
    }
    if (!fullNameRegex.test(building)) {
        throw Error('Invalid building format');
    }
    if (ownerCpr && !ownerCprRegex.test(ownerCpr.toString())) {
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
    }
}