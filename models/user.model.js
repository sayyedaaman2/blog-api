import {model, Schema} from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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

userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            id : this._id,
            email : this.email,
            role : this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_EXPIRES_IN || "7d"
        }
    )
}


const User = model("User",userSchema);
export default User;