import { InferSchemaType, Schema, model } from "mongoose";

const tableSchema = new Schema({
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

type Table = InferSchemaType<typeof tableSchema>;
const TableModel = model<Table>("Table", tableSchema);
export { TableModel }