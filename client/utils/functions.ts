import * as UserApi from "../network/user_api";


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