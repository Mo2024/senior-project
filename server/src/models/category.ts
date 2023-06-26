import { InferSchemaType, Schema, model, } from "mongoose";
import { ItemModel } from "./item";

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
categorySchema.post('findOneAndDelete', async function (doc) {
    const deletedCategory = doc;
    await ItemModel.deleteMany({ categoryId: deletedCategory._id });
});

type CategoryType = InferSchemaType<typeof categorySchema>;
const CategoryModel = model<CategoryType>("Category", categorySchema);
export { CategoryModel }