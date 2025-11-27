import mongoose from 'mongoose';


export const loadResource = (Model, idParams="id")=>{
    return async (req,res,next)=>{
        try{
            const rosourceId = req.params[idParams];

            if(rosourceId){
                return res.status(400).send({
                    success :  false,
                    message : `Missing params : ${idParams}`,
                });
            }

            if(!mongoose.isValidObjectId(rosourceId)){
                return res.status(400).send({
                    success : false,
                    message : "invalid resource id",
                })
            }
            const resource = await Model.findById(rosourceId);
            if(!resource){
                return res.status(404).send({
                    success : false,
                    message : "Resource not found",
                });
            }

            req.resource = resource;
            next();
        }catch(error){
            next(error)
        }
    }
}
