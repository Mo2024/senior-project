import fetchData, { deleteData } from "../utils/functions";
import { API_URL } from '@env';
import { Category } from "../models/user";
import mongoose from "mongoose";


export async function getCategories(): Promise<Category[]> {
    const response = await fetchData(`${API_URL}/api/employees/category`, { method: 'GET' }) as Category[] | any;
    return await response.json()
}

export async function getItems(catId: mongoose.Types.ObjectId): Promise<any> {
    const response = await fetchData(`${API_URL}/api/employees/items/${catId}`, { method: 'GET' }) as any;
    return await response.json()
}
export async function getItemsInBranch(catId: mongoose.Types.ObjectId): Promise<any> {
    const response = await fetchData(`${API_URL}/api/employees/itemsInBranch/${catId}`, { method: 'GET' }) as any;
    return await response.json()
}

export default interface newItemInBranch {
    itemId: mongoose.Types.ObjectId
    categoryId: mongoose.Types.ObjectId
    qty: number

}
export async function addItemToBranch(newItemInBranch: newItemInBranch): Promise<any> {
    const respone = await fetchData(`${API_URL}/api/employees/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemInBranch)
    });
    return respone.json();
}

export async function deleteItemInBranch(credentials: any): Promise<any> {
    console.log(credentials)
    await deleteData(`${API_URL}/api/employees/stock`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: credentials })
    });
    return;
}

export async function editItemInBranch(crredentiasl: any): Promise<any> {
    const respone = await fetchData(`${API_URL}/api/employees/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crredentiasl)
    });
    return respone.json();
}