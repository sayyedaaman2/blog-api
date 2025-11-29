import Post from "../models/post.model.js";
export const createPost = async (req, res, next) => {
  try {
    const post = {
      ...req.body,
      author : req.user._id
    }
    const createdPost = await Post.create(post);
    res.status(201).send({
      success: true,
      message: "Post created successfully",
      post: createdPost,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;
    console.log(postId, updateData)
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: updateData,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchPost = async (req, res, next) => {
  try {
    // 1) Read query params
    let {
      page = 1,
      limit = 10,
      search,
      tag,
      author,
    } = req.query;

    // Convert page & limit to numbers safely
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; // cap limit to avoid abuse

    const skip = (page - 1) * limit;

    // 2) Build filter object
    const filter = {published : true};

    // Search in title or content
    if (search && typeof search === "string" && search.trim().length > 0) {
      const regex = new RegExp(search.trim(), "i"); // case-insensitive
      filter.$or = [
        { title: regex },
        { content: regex },
      ];
    }

    // Filter by tag (single tag)
    if (tag && typeof tag === "string" && tag.trim().length > 0) {
      filter.tags = tag.trim(); // matches posts where tags array contains this value
    }

    // Filter by author
    if (author && typeof author === "string" && author.trim().length > 0) {
      filter.author = author.trim(); // assuming string ObjectId from frontend
    }

    // Optional: Only return published posts for public route
    // filter.published = true;

    // 3) Query DB
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "Posts fetched successfully",
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchPostById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const fetchedPost = await Post.findById(id);
    return res.status(200).json({
      message: "Post fetched successfully",
      data: fetchedPost,
    });
  } catch (error) {
    next(error);
  }
};
