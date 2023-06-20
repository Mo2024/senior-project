import { InferSchemaType, Schema, model } from "mongoose";

const attendanceSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
}, { timestamps: true });

type Attendance = InferSchemaType<typeof attendanceSchema>;
export default model<Attendance>("Attendance", attendanceSchema);