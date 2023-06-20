import { InferSchemaType, Schema, model } from "mongoose";

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
    }

});

type BusinessType = InferSchemaType<typeof businessSchema>;
const BusinessModel = model<BusinessType>("Business", businessSchema);
export { BusinessModel }