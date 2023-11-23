import { Schema, model } from "mongoose";

export enum couponType {
    Type1 = "percentage",
    Type2 = "amount",
}

const itemInBranchSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    barcode: {
        type: String,
    },
});
const ItemInBranchModel = model("ItemInBranchModel", itemInBranchSchema);
export { ItemInBranchModel };
