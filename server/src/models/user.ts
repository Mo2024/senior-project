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
        select: false,
    },
    area: {
        type: String,
        required: true,
        select: false,
    },
    road: {
        type: String,
        required: true,
        select: false,
    },
    block: {
        type: String,
        required: true,
        select: false,
    },
    building: {
        type: String,
        required: true,
        select: false,
    },
    ownerCpr: {
        type: Number,
        required: true,
        select: false,
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
        select: false,
    },
});

employeeSchema.add(userSchema);

const Employee = User.discriminator("Employee", employeeSchema);
type EmployeeType = InferSchemaType<typeof Employee.schema>;

const EmployeeModel = model<EmployeeType>("Employee", Employee.schema);

const customerSchema = new Schema({
    verified: {
        type: Boolean,
        default: false,
        select: false,
    },
    addresses: {
        type: [
            {
                addressName: {
                    type: String,
                    required: true,
                },
                area: {
                    type: String,
                    required: true,
                },
                building: {
                    type: String,
                    required: true,
                },
                block: {
                    type: String,
                    required: true,
                },
                road: {
                    type: String,
                    required: true,
                },
            },
        ],
        select: false,
    },
});


customerSchema.add(userSchema);

const Customer = User.discriminator("Customer", customerSchema);
type CustomerType = InferSchemaType<typeof Customer.schema>;

const CustomerModel = model<CustomerType>("Customer", Customer.schema);

export { UserModel, OwnerModel, EmployeeModel, CustomerModel }