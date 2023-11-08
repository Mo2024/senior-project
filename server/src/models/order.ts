import { Schema, model, InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const orderSchema = new Schema({
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    items: [orderItemSchema],
});


type OrderType = InferSchemaType<typeof orderSchema>;
const OrderModel = model<OrderType>("Order", orderSchema);
export { OrderModel }