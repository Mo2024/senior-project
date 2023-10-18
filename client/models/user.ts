import mongoose, { mongo } from "mongoose";

export interface User {
    __t: string;
    _id: string,
    username: string,
    email: string,
}

export interface Business {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    description?: string;
    status?: boolean;
    ownerId?: string;
    branches?: Branch[];
    filename?: string;
    __v?: number;
}

export interface Branch {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    businessId?: string;
    openingTime?: string;
    closingTime?: string;
    lateTime?: string;
    attendanceCode?: string;
    __v?: number;
}
export type Businesses = Business[];


export interface newBusinessModel {
    name: string,
    description: string,
    status: true,
    ownerId: mongoose.Types.ObjectId,
    branches: Branch[],
    filename: null | string,
    _id: string,
    __v: number
}
export interface newBranchModel {
    name: string,
    businessId?: mongoose.Types.ObjectId,
    branchId?: mongoose.Types.ObjectId,
    openingTime: string,
    closingTime: string,
    lateTime: string
}