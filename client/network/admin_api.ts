import fetchData, { deleteData } from "../utils/functions";
import { API_URL } from '@env';
import { Branch, Businesses, Category, Employee, newAdmin, newBranchModel, newBusinessModel, newEmployee } from "../models/user";
import mongoose, { mongo } from "mongoose";


export async function getCategories(): Promise<Category[]> {
    const response = await fetchData(`${API_URL}/api/admins/category`, { method: 'GET' }) as Category[] | any;
    return await response.json()
}

export async function createCategory(category: { name: string }): Promise<any> {
    const respone = await fetchData(`${API_URL}/api/admins/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category)
    });
    return respone.json();
}