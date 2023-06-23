import { InferSchemaType, Schema, model } from "mongoose";

const attendanceSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    isLate: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

type Attendance = InferSchemaType<typeof attendanceSchema>;
export default model<Attendance>("Attendance", attendanceSchema);