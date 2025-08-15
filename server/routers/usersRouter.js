const router = require("express").Router();
const usersBL = require("../BLs/usersBL");
const verifyToken = require("../utils/verifyToken");

router.use(verifyToken);

router.get("/", async(req,res)=>
{
    const response = await usersBL.getAllUsers();
    res.send(response);
})

router.get("/:id", async(req,res)=>
{
    const {id} = req.params;
    const response = await usersBL.getUserById(id);
    res.send(response);
})

router.delete("/:id", async(req,res)=>
{
    let {id} = req.params;
    let response = await usersBL.deleteUser(id);
    res.send(response);
})

router.put("/:id", async(req,res)=>
{
    let {id} = req.params;
    let userData = req.body;
    let response = await usersBL.updateUser(userData, id);
    res.send(response);
})

router.post("/newpassword", async(req,res)=>
{
    let {password} = req.body;
    let {email} = req.user;
    let response = await usersBL.updateUserPassword(password, email);
    res.send(response);
})

module.exports = router;


