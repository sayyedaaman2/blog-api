import mongoose, { model, Schema } from 'mongoose';



const commentSchema = new Schema({
    post : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "Post",
        required : true

    },
    author : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "User",
        required : true
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