import { Schema, model } from "mongoose";

export enum couponType {
    Type1 = "percentage",
    Type2 = "amount",
}

const couponSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(couponType),
        required: true,
    },
});
const CouponModel = model("Coupon", couponSchema);
export { CouponModel };
