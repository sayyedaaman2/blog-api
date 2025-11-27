import mongoose, {model, Schema} from 'mongoose'


const postSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    slug : {
        type : String,
        required : true,
        unique : true,
    },
    content : {
        type : String,
        required : true,
    },
    author : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "User",
        required : true
    },
    tags : {
        type : [String],
        default : [],
        trim : true,
    },
    published : {
        type : Boolean,
        default : true,
    },

},{
    versionKey : false,
    timestamps : true,
})

const Post = model('Post', postSchema);
export default Post;