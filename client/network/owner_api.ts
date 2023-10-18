import fetchData, { deleteData } from "../utils/functions";
import { API_URL } from '@env';
import { Branch, Businesses, newBranchModel, newBusinessModel } from "../models/user";
import mongoose, { mongo } from "mongoose";


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

export interface newBusiness {
    name: string
    description: string
}
export async function createBusiness(newBusiness: newBusiness): Promise<newBusinessModel> {
    const respone = await fetchData(`${API_URL}/api/business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBusiness)
    });
    return respone.json();
}

export interface editBusiness {
    name: string
    description: string
    businessId: mongoose.Types.ObjectId
}
export async function editBusiness(editBusiness: newBusiness): Promise<newBusinessModel> {
    const respone = await fetchData(`${API_URL}/api/business`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBusiness)
    });
    return respone.json();
}


export async function createBranch(credentials: newBranchModel): Promise<newBranchModel> {
    const respone = await fetchData(`${API_URL}/api/business/branch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    return respone.json();
}

export async function getBranches(businessId: mongoose.Types.ObjectId): Promise<Branch[]> {
    const response = await fetchData(`${API_URL}/api/business/branches/${businessId}`, { method: 'GET' }) as any;
    return await response.json()
}

export async function deleteBranch(branchId: mongoose.Types.ObjectId): Promise<any> {
    await deleteData(`${API_URL}/api/business/branch`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId })
    });
    return;
}

export async function editBranch(editBranch: newBranchModel): Promise<newBranchModel> {
    const respone = await fetchData(`${API_URL}/api/business/branch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBranch)
    });
    return respone.json();
}
