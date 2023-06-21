import { Schema, model } from "mongoose";

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
    percentage: {
        type: Number,
    },
    amountDiscounted: {
        type: Number,
    },
});
const CouponModel = model("Coupon", couponSchema);
export { CouponModel };
