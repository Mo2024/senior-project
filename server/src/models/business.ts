import { InferSchemaType, Schema, model } from "mongoose";
import { BranchModel } from "./branch";
import { CouponModel } from "./coupon";
import { CategoryModel } from "./category";
import { ItemModel } from "./item";
import { AdminModel, EmployeeModel } from "./user";

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
        default: true,
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

    await AdminModel.deleteMany({ businessId: deletedBusiness._id });
    const matchingBranches = await BranchModel.find({ businessId: deletedBusiness._id })
    const result = await EmployeeModel.deleteMany({ branchId: { $in: matchingBranches } })
    console.log(result)
    await BranchModel.deleteMany({ businessId: deletedBusiness._id });
    await CouponModel.deleteMany({ businessId: deletedBusiness._id });

    const categoryIds = await CategoryModel.find({ businessId: deletedBusiness._id }).distinct('_id');
    await ItemModel.deleteMany({ categoryId: { $in: categoryIds } });
    await CategoryModel.deleteMany({ businessId: deletedBusiness._id });

});

type BusinessType = InferSchemaType<typeof businessSchema>;
const BusinessModel = model<BusinessType>("Business", businessSchema);
export { BusinessModel }