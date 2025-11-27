import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const createdComment = await Comment.create(req.body);
    return res.status(201).send({
      success: true,
      message: "Comment created successfully",
      data: createdComment,
    });
  } catch (error) {
    next(error);
  }
};
export const updateComment = async (req, res, next) => {
  try {
    let commentId = req.params.commentId;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: req.body },
      { new: true, runValidators: true } // returns updated doc + validates schema
    );
    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    let commentId = req.params.commentId;
    const deletedComment = await Comment.findByIdAndDelete(commentId)
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: deletedComment,
    });
  } catch (error) {
    next(error);
  }
};


export const fetchComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
     const commentList = await Comment.find({ post: postId })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Comments fetched successfully.",
      data: commentList,
    });
  } catch (error) {
    next(error);
  }
};


export const fetchCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    return res.status(200).send({
      success: true,
      message: "Comment fetched successfully.",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};