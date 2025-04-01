const userModel = require("../models/userModel");

//Get Donar List
const getDonarsListController = async(req,res) =>{
try {
    const donarData = await userModel
    .find({role:"donar"})
    .sort({createdAt:-1});
    return res.status(200).send({
        success: true,
        Totalcount: donarData.length,
        message: "Donar List Fetched Successfully",
        donarData,
    })
} catch (error) {
  console.log(error)
  return res.status(500).send({
    success:false,
    message:"Error In Donar List API",
    error
  })   
}
};
//Get Hospital List
const getHospitalListController = async(req,res) =>{
    try {
        const hospitalData = await userModel
        .find({role:"hospital"})
        .sort({createdAt:-1});
        return res.status(200).send({
            success: true,
            Totalcount: hospitalData.length,
            message: "Hospital List Fetched Successfully",
            hospitalData,
        })
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        success:false,
        message:"Error In Hospital List API",
        error
      })   
    }
    };

    //Get Org-List
    const getOrgListController = async(req,res) =>{
        try {
            const orgData = await userModel
            .find({role:"organisation"})
            .sort({createdAt:-1});
            return res.status(200).send({
                success: true,
                Totalcount: orgData.length,
                message: "Org List Fetched Successfully",
                orgData,
            })
        } catch (error) {
          console.log(error)
          return res.status(500).send({
            success:false,
            message:"Error In Org List API",
            error
          })   
        }
        };

        //Delete Donar
    const deleteDonarController = async(req,res) =>{
        try {
          await userModel.findByIdAndDelete(req.params.id);
          return res.status(200).send({
            success:true,
            message:"Donar Record Deleted successfully",
          });  
        } catch (error) {
           console.log(error);
           return res.status(500).send({
            success:false,
            message:"Error while deleting donar",
            error,
           }); 
        }
    };

module.exports = {getDonarsListController,getHospitalListController,getOrgListController,deleteDonarController};