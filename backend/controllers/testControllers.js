 const testControllers = (req,res)=>{
    res.status(200).send({
        message:'Hello',
        success:true,
    });
};

module.exports = {testControllers};
//morgan,colors,mongoose,nodemon,npm init,dotenv
//cors - to connect react application with node 