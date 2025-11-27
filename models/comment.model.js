import mongoose, { model, Schema } from 'mongoose';



const commentSchema = new Schema({
    post : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "Post",

    },
    author : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "User",
    },
    content : {
        type : String,
    },

},{
    versionKey : false,
    timestamps : true
})

const Comment = model("Comment", commentSchema);
export default Comment;