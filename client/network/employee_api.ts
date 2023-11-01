import fetchData from "../utils/functions";
import { API_URL } from '@env';
import { Category } from "../models/user";
import mongoose from "mongoose";


export async function getCategories(): Promise<Category[]> {
    const response = await fetchData(`${API_URL}/api/employees/category`, { method: 'GET' }) as Category[] | any;
    return await response.json()
}