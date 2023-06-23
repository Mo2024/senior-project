import { Schema, model } from "mongoose";

export const branchSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    openingTime: {
        type: String,
        required: true
    },
    closingTime: {
        type: String,
        required: true
    },
    lateTime: {
        type: String,
        required: true
    },
    attendanceCode: {
        type: String,
        required: true
    }
});
//it has weak entities
const BranchModel = model("Branch", branchSchema);
export { BranchModel };
