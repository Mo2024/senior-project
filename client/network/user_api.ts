import fetchData from "../utils/functions";
import { User as UserModel } from "../models/user";
import { API_URL } from '@env';

export async function getLoggedInUser(): Promise<UserModel> {
    const response = await fetchData(`${API_URL}/api/users`, { method: 'GET' }) as UserModel | any;
    return await response.json()
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {
    const respone = await fetchData(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    return respone.json();
}

export async function logout() {
    await fetchData(`${API_URL}/api/users/logout`, { method: "POST" });
}

export interface SignupCredentials {
    email: string,
    username: string,
    fullName: string,
    telephone: string,
    password: string,
    confirmPassword: string,
    area?: string,
    road?: string,
    block?: string,
    building?: string,
    ownerCpr?: number,
}

export async function signup(credentials: SignupCredentials): Promise<UserModel> {
    const respone = await fetchData(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    return respone.json();
}