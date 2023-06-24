import { InferSchemaType, Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
});

type CategoryType = InferSchemaType<typeof categorySchema>;
const CategoryModel = model<CategoryType>("Category", categorySchema);
export { CategoryModel }