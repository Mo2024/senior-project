import fetchData, { deleteData } from "../utils/functions";
import { API_URL } from '@env';
import { Branch, Businesses, Category, Employee, newAdmin, newBranchModel, newBusinessModel, newEmployee, newItem } from "../models/user";
import mongoose, { mongo } from "mongoose";


export async function getCategories(): Promise<Category[]> {
    const response = await fetchData(`${API_URL}/api/admins/category`, { method: 'GET' }) as Category[] | any;
    return await response.json()
}
export async function getItems(catId: mongoose.Types.ObjectId): Promise<any> {
    const response = await fetchData(`${API_URL}/api/admins/items/${catId}`, { method: 'GET' }) as any;
    return await response.json()
}
export async function getEmployees(empId: mongoose.Types.ObjectId): Promise<any> {
    const response = await fetchData(`${API_URL}/api/admins/employees/${empId}`, { method: 'GET' }) as any;
    return await response.json()
}
export async function getAttendance(empId: mongoose.Types.ObjectId): Promise<any> {
    const response = await fetchData(`${API_URL}/api/admins/attendance/${empId}`, { method: 'GET' }) as any;
    return await response.json()
}
export async function getBranches(): Promise<any> {
    const response = await fetchData(`${API_URL}/api/admins/branches`, { method: 'GET' }) as any;
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
export async function deleteCategory(categoryId: mongoose.Types.ObjectId): Promise<any> {
    await deleteData(`${API_URL}/api/admins/category`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId })
    });
    return;
}
export async function deleteItem(itemId: mongoose.Types.ObjectId): Promise<any> {
    await deleteData(`${API_URL}/api/admins/item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId })
    });
    return;
}

export async function editCategory(editCategory: { name: string, categoryId: mongoose.Types.ObjectId }): Promise<any> {
    const respone = await fetchData(`${API_URL}/api/admins/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory)
    });
    return respone.json();
}


export async function createItem(item: newItem): Promise<any> {
    const respone = await fetchData(`${API_URL}/api/admins/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    });
    return respone.json();
}
interface IEditItem {
    itemId?: mongoose.Types.ObjectId
    name?: string,
    description?: string,
    price?: string,
    categoryId?: mongoose.Types.ObjectId
    barcode?: string
}
export async function editItem(editItem: IEditItem): Promise<any> {
    const respone = await fetchData(`${API_URL}/api/admins/item`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem)
    });
    return respone.json();
}
