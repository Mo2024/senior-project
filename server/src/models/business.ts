import { InferSchemaType, Schema, model } from "mongoose";
import { BranchModel } from "./branch";
import { CouponModel } from "./coupon";
import { CategoryModel } from "./category";

const businessSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    branches: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
    ],
    filename: {
        type: String,
        default: null
    }

});

businessSchema.post('findOneAndDelete', async function (doc) {
    const deletedBusiness = doc;
    await BranchModel.deleteMany({ businessId: deletedBusiness._id });
    await CouponModel.deleteMany({ businessId: deletedBusiness._id });
    await CategoryModel.deleteMany({ businessId: deletedBusiness._id });
});

type BusinessType = InferSchemaType<typeof businessSchema>;
const BusinessModel = model<BusinessType>("Business", businessSchema);
export { BusinessModel }