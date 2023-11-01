import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import AttendanceModel from "../models/attendance";
import { BranchModel } from "../models/branch";
import { CategoryModel } from "../models/category";
import { ItemModel } from "../models/item";
import { ItemInBranchModel } from "../models/itemInBranch";
import { assertIsDefined } from "../util/assertIsDefined";
import { qtyRegex, uuidRegex } from "../util/regex";
import { IitemPopulate } from "./admins";
import { IBusinessId } from "./business";

interface attendanceBody {
    attendanceCode: string;
}

export const attendance: RequestHandler<unknown, unknown, attendanceBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const branchId = req.session.branchId;
    const { attendanceCode } = req.body;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(branchId)
        if (!uuidRegex) {
            throw createHttpError(400, "Parameter Missing")
        }

        if (!uuidRegex.test(attendanceCode)) {
            throw createHttpError(404, 'Invalid uuid!')
        }
        const branch = await BranchModel.findOne({ _id: branchId }).exec()
        if (!branch) {
            throw createHttpError(404, 'Branch not found!')
        }
        if (branch.attendanceCode !== attendanceCode) {
            throw createHttpError(404, "Invalid QR Code!");
        }

        const openingTime = branch.openingTime;
        const closingTime = branch.closingTime;
        const lateTime = branch.lateTime;

        const openingTimeParts = openingTime?.split(":").map(Number);
        const closingTimeParts = closingTime?.split(":").map(Number);
        const lateTimeParts = lateTime?.split(":").map(Number);
        if (openingTimeParts && closingTimeParts && lateTimeParts) {
            const currentTime = new Date();
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();
            const today = currentTime.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);


            const [openingHour, openingMinute] = openingTimeParts;
            const [closingHour, closingMinute] = closingTimeParts;
            const isBeforeOpeningTime = currentHour < openingHour || (currentHour === openingHour && currentMinute < openingMinute);
            const isAfterClosingTime = currentHour > closingHour || (currentHour === closingHour && currentMinute >= closingMinute);

            if (isBeforeOpeningTime || isAfterClosingTime) {
                throw createHttpError(403, "Cannot mark attendance when the branch is closed.");
            }

            const attendanceRecord = await AttendanceModel.findOne({
                createdAt: {
                    $gte: today,
                    $lt: tomorrow,
                },
            });

            if (attendanceRecord) {
                throw createHttpError(400, "An attendance record already exists for today.");
            }

            const [lateHour, lateMinute] = lateTimeParts;
            console.log(lateTimeParts)
            console.log(`${currentHour}:${currentMinute}`)
            const isLate = currentHour > lateHour || (currentHour === lateHour && currentMinute >= lateMinute);

            const newAttendance = await AttendanceModel.create({ employeeId: authenticatedUserId, branchId, isLate });
            branch.attendanceCode = uuidv4();
            await branch.save();

            return res.status(201).json(newAttendance)
        }

        throw createHttpError(400, "Failed to verify attendance");


    } catch (error) {
        next(error)
    }

}

// export const getItems: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
//     const authenticatedUserId = req.session.userId;
//     const businessId = req.session.businessId;
//     try {
//         assertIsDefined(authenticatedUserId)
//         assertIsDefined(businessId)

//         const matchingCategories = await CategoryModel.find({ businessId }).exec();
//         const items = await ItemModel.find({ categoryId: { $in: matchingCategories } });

//         if (!items) {
//             throw createHttpError(404, 'Items not found!')
//         }
//         res.status(201).json(items)
//     } catch (error) {
//         next(error)
//     }

// }

interface IitemIdBody {
    itemId?: Types.ObjectId,
    qty?: number
}

export const updateStock: RequestHandler<unknown, unknown, IitemIdBody, unknown> = async (req, res, next) => {
    const { itemId, qty } = req.body
    const authenticatedUserId = req.session.userId;
    const userBusinessId = req.session.businessId;
    const userBranchId = req.session.branchId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(userBranchId)
        assertIsDefined(userBusinessId)

        if (!itemId || !qty) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!qtyRegex.test(qty.toString())) {
            throw createHttpError(400, 'Quantity must be a positive integer!');
        }
        if (!mongoose.isValidObjectId(itemId)) {
            throw createHttpError(404, 'Invalid item id!')
        }

        const item = await ItemModel.findById(itemId)
            .populate({ path: "categoryId", select: "businessId" }) as IitemPopulate | null

        if (!item) {
            throw createHttpError(404, 'Item not found!')
        }
        if (!item.categoryId.businessId._id.equals(userBusinessId)) {
            throw createHttpError(401, 'You update stock to an item outside your business!')
        }

        const itemInBranch = await ItemInBranchModel.findOne({ branchId: userBranchId, itemId: item._id })

        if (!itemInBranch) {
            throw createHttpError(404, 'Item in branch not found!')
        }
        itemInBranch.quantity = qty
        await itemInBranch.save();

        res.status(201).json(itemInBranch)
    } catch (error) {
        next(error)
    }

}
export const addStock: RequestHandler<unknown, unknown, IitemIdBody, unknown> = async (req, res, next) => {
    const { itemId, qty } = req.body
    const authenticatedUserId = req.session.userId;
    const userBusinessId = req.session.businessId;
    const userBranchId = req.session.branchId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(userBranchId)
        assertIsDefined(userBusinessId)

        if (!itemId || !qty) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!qtyRegex.test(qty.toString())) {
            throw createHttpError(400, 'Quantity must be a positive integer!');
        }
        if (!mongoose.isValidObjectId(itemId)) {
            throw createHttpError(404, 'Invalid item id!')
        }

        const item = await ItemModel.findById(itemId)
            .populate({ path: "categoryId", select: "businessId" }) as IitemPopulate | null

        if (!item) {
            throw createHttpError(404, 'Item not found!')
        }
        if (!item.categoryId.businessId._id.equals(userBusinessId)) {
            throw createHttpError(401, 'You update stock to an item outside your business!')
        }

        const itemInBranch = await ItemInBranchModel.findOne({ branchId: userBranchId, itemId: item._id })

        if (itemInBranch) {
            throw createHttpError(409, 'Item in branch already exists!')
        }

        const newItemInBranch = await ItemInBranchModel.create({ branchId: userBranchId, itemId: item._id, quantity: qty })

        res.status(201).json(newItemInBranch)
    } catch (error) {
        next(error)
    }

}
export const getStocks: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const userBranchId = req.session.branchId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(userBranchId)
        const itemsInBranch = await ItemInBranchModel.find({ branchId: userBranchId })
        res.status(201).json(itemsInBranch)
    } catch (error) {
        next(error)
    }

}
export const deleteStock: RequestHandler<unknown, unknown, IitemIdBody, unknown> = async (req, res, next) => {
    const { itemId } = req.body
    const authenticatedUserId = req.session.userId;
    const userBusinessId = req.session.businessId;
    const userBranchId = req.session.branchId;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(userBranchId)
        assertIsDefined(userBusinessId)

        if (!itemId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(itemId)) {
            throw createHttpError(404, 'Invalid item id!')
        }

        const item = await ItemModel.findById(itemId)
            .populate({ path: "categoryId", select: "businessId" }) as IitemPopulate | null

        if (!item) {
            throw createHttpError(404, 'Item not found!')
        }
        if (!item.categoryId.businessId._id.equals(userBusinessId)) {
            throw createHttpError(401, 'You update stock to an item outside your business!')
        }

        const itemInBranch = await ItemInBranchModel.findOne({ branchId: userBranchId, itemId: item._id })

        if (!itemInBranch) {
            throw createHttpError(404, 'Item in branch not found!')
        }

        await itemInBranch.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error)
    }

}

interface ICategoryPopulate extends Document {
    save(): unknown;
    deleteOne(): unknown;
    name: string,
    businessId: {
        _id: Types.ObjectId;
        ownerId: Types.ObjectId;
        status: boolean;
    },
}

export const getCategories: RequestHandler<IBusinessId, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)
        const categories = await CategoryModel.find({ businessId: adminBusinessId })
            .populate({ path: "businessId", select: "ownerId" }) as Array<ICategoryPopulate> | null;
        if (!categories) {
            throw createHttpError(404, 'Categories not found!')
        }
        res.status(201).json(categories)
    } catch (error) {
        next(error)
    }

}

interface itemsParamsI {
    categoryId: mongoose.Types.ObjectId
}

export const getItems: RequestHandler<itemsParamsI, unknown, unknown, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const adminBusinessId = req.session.businessId;
    const { categoryId } = req.params

    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(adminBusinessId)

        if (!categoryId) {
            throw createHttpError(400, "Parameter Missing")
        }
        if (!mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(404, 'Invalid item id!')
        }
        const items = await ItemModel.find({ categoryId });

        if (!items) {
            throw createHttpError(404, 'Items not found!')
        }

        res.status(201).json(items)
    } catch (error) {
        next(error)
    }

}