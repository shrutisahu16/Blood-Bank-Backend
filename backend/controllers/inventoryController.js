const mongoose  =  require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//Create Inventory
const createInventoryController = async(req,res) =>{
  console.log("here");
    try {
        const {email} = req.body; 
        // const{userId} = req.body;
        console.log(req.body);//destructure data
        //validation
        const user = await userModel.findOne({email});
        if(!user){
            throw new Error('User Not Found');
        }
        // if(inventoryType === 'in' && user.role !== "donar"){
        //     throw new Error("Not a donar account");
        // }
        // if(inventoryType === "out" && user.role !== "hospital"){
        //     throw new Error("Not a hospital");
        // }

        if(req.body.inventoryType == 'out'){
          const requestedBloodGroup = req.body.bloodGroup;
          const requestedQuantityOfBlood = req.body.quantity;
          const organisation = new mongoose.Types.ObjectId(req.body.userId);

          //Calculate Blood Quantity
          const totalInOfRequestedBlood = await inventoryModel.aggregate([
            {$match:{
              organisation,
              inventoryType:'in',
              bloodGroup:requestedBloodGroup
            },},{
              $group:{
                _id:'$bloodGroup',
                total:{$sum : '$quantity'},
              },
            },
          ]);
          // console.log("Total In",totalInOfRequestedBlood);
          const totalIn = totalInOfRequestedBlood[0]?.total || 0;
          //Calculate OUT Blood Quantity

          const  totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
           {$match:{
            organisation,
            inventoryType:'out',
            bloodGroup:requestedBloodGroup,
           }},
           {
            $group:{
              _id:'$bloodGroup',
              total:{$sum : '$quantity'}
            },
           },
          ])
          const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
          // in & Out Calc
          const availableQuanityOfBloodGroup = totalIn - totalOut;
          //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
        }else{
          req.body.donar = user?._id;
        }
     //save record
     const inventory = new inventoryModel(req.body);
     await inventory.save();
     return res.status(201).send({
        success: true,
        message: "New Blood Record Added",
     });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success:false,
        message:"Error In Create Inventory API",
        error,
      });  
    }
};

//GET AlL Blood Records
const getInventoryController = async(req,res) =>{
    try {
       const inventory = await inventoryModel.find({
        organisation:req.body.userId,
    
       })
       .populate("donar")
       .populate("hospital")
       .sort({createdAt: -1});
       return res.status(200).send({
        success:true,
        message: "get all records successfully",
        inventory,
       });
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        success:false,
        message:'Error in get all inventory',
        error,
      })  
    }
};
//Get Donar Record
const getDonarsController = async (req,res) =>{
   try {
    const organisation = req.body.userId;
    //find donars
    const donorId = await inventoryModel.distinct("donar", {
      organisation,
    });
    // console.log(donorId);
     const donars = await userModel.find({_id:{$in: donorId}});

     return res.status(200).send({
      success:true,
      message:"Donar Record Fetched Successfully",
      donars,
     });
   } catch (error) {
    console.log(error);
    return res.status(500).send({
      success:false,
      message:'Error in Donar records',
      error
    })
   }
};

//get hospitals Records
const getHospitalsController = async(req,res) =>{
 try {
  const organisation = req.body.userId;
  //Get hospital ID
  const hospitalID = await inventoryModel.distinct('hospital',{organisation});
  //Find hospital
  const hospitals = await userModel.find({
    _id:{$in : hospitalID}
  })
  return res.status(200).send({
    success:true,
    message:"Hospitals Data Fetched Successfully",
    hospitals,
  })
 } catch (error) {
   console.log(error)
   return res.status(500).send({
    success:false,
    message:"Error in get Hospital API",
    error
   })
 }
};

//get org profiles
const getOrganisationController = async(req,res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { donar });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
      error,
    });
  }
};
//get org for hospital
const getOrganisationForHospitalController = async(req,res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", { hospital });
    //find org
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital ORG API",
      error,
    });
  }
};

//GET Hospital Blood Records
const getInventoryHospitalController = async(req,res) =>{
  try {
     const inventory = await inventoryModel.find(
      req.body.filters
  
     )
     .populate("donar")
     .populate("hospital")
     .populate("organisation")
     .sort({createdAt: -1});
     return res.status(200).send({
      success:true,
      message: "get hospital consumer records successfully",
      inventory,
     });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'Error in consumer inventory',
      error,
    })  
  }
};

//Get blood record of 3

const getRecentInventoryController = async(req,res) =>{
  try {
    const inventory = await inventoryModel.find({
      organisation:req.body.userId
    }).limit(3).sort({createdAt: -1})
    return res.status(200).send({
      success:true,
      message:"recent Inventory Data",
      inventory,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:"Error In Recent Inventory API",
      error
    })
  }
}


module.exports = {createInventoryController,getInventoryController,getDonarsController,getHospitalsController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
getRecentInventoryController};