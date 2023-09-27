import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        select: false,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    fullName: {
        type: String,
        required: true,
        select: false,
    },
    telephone: {
        type: String,
        required: true,
        select: false,
    },
});

const User = model("User", userSchema);
type UserType = InferSchemaType<typeof userSchema>;
const UserModel = model<UserType>("User", userSchema);

const ownerSchema = new Schema({
    verified: {
        type: Boolean,
        default: false,
    },
    area: {
        type: String,
        required: true,
    },
    road: {
        type: String,
        required: true,
    },
    block: {
        type: String,
        required: true,
    },
    building: {
        type: String,
        required: true,
    },
    ownerCpr: {
        type: Number,
        required: true,
    },
});

ownerSchema.add(userSchema);

const Owner = User.discriminator("Owner", ownerSchema);
type OwnerType = InferSchemaType<typeof Owner.schema>;

const OwnerModel = model<OwnerType>("Owner", Owner.schema);


const employeeSchema = new Schema({
    employeeCpr: {
        type: Number,
        required: true,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    }
});

employeeSchema.add(userSchema);

const Employee = User.discriminator("Employee", employeeSchema);
type EmployeeType = InferSchemaType<typeof Employee.schema>;

const EmployeeModel = model<EmployeeType>("Employee", Employee.schema);

const adminSchema = new Schema({
    adminCpr: {
        type: Number,
        required: true,
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
});

adminSchema.add(userSchema);

const Admin = User.discriminator("Admin", adminSchema);
type AdminType = InferSchemaType<typeof Admin.schema>;

const AdminModel = model<AdminType>("Admin", Admin.schema);

export { UserModel, OwnerModel, EmployeeModel, AdminModel }