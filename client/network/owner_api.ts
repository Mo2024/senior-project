import fetchData, { deleteData } from "../utils/functions";
import { API_URL } from '@env';
import { Business, Businesses } from "../models/user";
import mongoose from "mongoose";


export async function getMyBusinessess(): Promise<Businesses> {
    const response = await fetchData(`${API_URL}/api/business/`, { method: 'GET' }) as Businesses | any;
    return await response.json()
}
export async function deleteBusiness(businessId: mongoose.Types.ObjectId): Promise<any> {
    console.log(businessId)
    await deleteData(`${API_URL}/api/business/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: businessId })
    });
    return;
}