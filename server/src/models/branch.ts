import { Schema, model } from "mongoose";

const branchSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
});
//it has weak entities
const BranchModel = model("Branch", branchSchema);
export { BranchModel };
