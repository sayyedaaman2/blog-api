import {Schema} from 'mongoose';
import bcrypt from 'bcryptjs'
import {userRoles} from '../utils/contants.js'


const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        unique : true,
    },
    role : {
        type : String,
        enum : userRoles.values,
        default : userRoles.USER
    }
},{
    versionKey : false,
    timestamps : true,
});

userSchema.pre('save', async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,10);
})


const User = mongoose.model("User",userSchema);
export default User;