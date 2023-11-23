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
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    fullName: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    cpr: {
        type: String,
        required: true,
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

});

ownerSchema.add(userSchema);

const Owner = User.discriminator("Owner", ownerSchema);
type OwnerType = InferSchemaType<typeof Owner.schema>;

const OwnerModel = model<OwnerType>("Owner", Owner.schema);


const employeeSchema = new Schema({
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

const attendanceUserSchema = new Schema({
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
type AttendanceUserType = InferSchemaType<typeof attendanceUserSchema>;
const AttendanceUserModel = model<AttendanceUserType>("AttendanceUser", attendanceUserSchema);

const seUserSchema = new Schema({
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
type SeUserType = InferSchemaType<typeof seUserSchema>;
const SeUserModel = model<SeUserType>("SEUser", seUserSchema);

// attendanceUserSchema.add(userSchema);

// const AttendanceUser = User.discriminator("AttendanceUser", attendanceUserSchema);
// type AttendanceUserType = InferSchemaType<typeof AttendanceUser.schema>;

// const AttendanceUserModel = model<AttendanceUserType>("AttendanceUser", AttendanceUser.schema);


const highestCountSchema = new Schema({
    highestCount: {
        type: Number,
        default: 0,
    },
});
const highestCountSchemaSE = new Schema({
    highestCount: {
        type: Number,
        default: 0,
    },
});

const HighestCountModel = model('HighestCount', highestCountSchema);
const HighestCountModelSE = model('HighestCountSE', highestCountSchemaSE);

export { HighestCountModelSE, HighestCountModel, SeUserModel, UserModel, OwnerModel, EmployeeModel, AdminModel, AttendanceUserModel }