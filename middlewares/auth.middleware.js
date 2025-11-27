import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import { userRoles } from '../utils/contants.js';
export const protectedRoute = async (req,res,next)=>{
    try{
        let token;
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer ")){
          token = authHeader.split(" ")[1];
        }
        if(!token){
          return res.status(401).send({
            success : false,
            message : "Not authorized, token missing",
          });
        }

        // verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).send({
                success : false,
                message : "Not authorized, user no longer exists",
            })
        }
        req.user = user;
        next();

    }catch(error){
        return res.status(401).json({
         success: false,
         message: "Not authorized, invalid or expired token",
       });
    }
}


export const adminAndOwnerAccess = (req, res, next) => {
  try {
    // 1) User must exist (set by protectedRoute)
    if (!req.user || !req.user._id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2) Resource must exist (set by loadResource)
    if (!req.resource) {
      return res.status(500).json({
        success: false,
        message: "Resource not loaded. Make sure loadResource runs before this middleware.",
      });
    }

    const isAdmin = req.user.role === userRoles.ADMIN;

    // Assuming your models use `author` as the owner field
    const ownerId = req.resource.author;
    const isOwner =
      ownerId && ownerId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // All good
    return next();
  } catch (error) {
    return next(error);
  }
};


export const authorOrAdminOnly = (req, res, next) => {
  // 1) Must be logged in (protectedRoute should normally run before this)
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // 2) Check role
  const isAdmin = req.user.role === userRoles.ADMIN;
  const isAuthor = req.user.role === userRoles.AUTHOR;

  if (!isAdmin && !isAuthor) {
    return res.status(403).json({
      success: false,
      message: "Only admins or authors can access the endpoint",
    });
  }

  // 3) All good, move to controller
  return next();
};
