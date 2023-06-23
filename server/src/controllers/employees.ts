import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import { uuidRegex } from "../util/regex";
import createHttpError from "http-errors";
import { BranchModel } from "../models/branch";
import AttendanceModel from "../models/attendance";
import { v4 as uuidv4 } from 'uuid';

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