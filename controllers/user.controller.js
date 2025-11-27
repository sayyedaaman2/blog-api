import User from '../models/user.model.js'

export const signUp = async (req,res,next)=>{
    try{  
    
        const userCreated = await User.create(req.body);
        const {password,...safeUser} = userCreated.toObject();

        res.status(201).send({
            success : true,
            message : "User created successfully.",
            user : safeUser

        })

    }catch(error){
        next(error);
    }
}

export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }
    const token = user.generateToken();
    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });

  } catch (error) {
    next(error);
  }
};