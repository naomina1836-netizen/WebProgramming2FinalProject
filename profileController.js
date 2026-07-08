const {

    getUser,
    updateUser

}=require("../models/profileModel");

exports.getProfile=async(req,res)=>{

    try{

        const user=await getUser(req.user.id);

        res.json(user);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server Error"

        });

    }

};

exports.updateProfile=async(req,res)=>{

    try{

        await updateUser(

            req.user.id,
            req.body

        );

        const user=await getUser(req.user.id);

        res.json({

            message:"Profile updated.",

            user

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Update failed."

        });

    }

};