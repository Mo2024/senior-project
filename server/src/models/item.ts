import { InferSchemaType, Schema, model } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
});

type ItemType = InferSchemaType<typeof itemSchema>;
const ItemModel = model<ItemType>("Item", itemSchema);
export { ItemModel }