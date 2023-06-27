import fetchData from "../utils/functions";
import { User as UserModel } from "../models/user";
export async function getLoggedInUser(): Promise<UserModel> {
    const response = await fetchData(`http://192.168.100.4:5000/api/users`, { method: 'GET' }) as UserModel | any;
    return await response.json()
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {
    const respone = await fetchData('http://192.168.100.4:5000/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    return respone.json();
}