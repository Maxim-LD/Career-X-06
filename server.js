const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")


//user model
const Users = require("./userModel")

const connectDB = require("./db")

dotenv.config()



const app = express()


app.use(express.json())


const PORT = process.env.PORT || 8080

connectDB()



// checck server
app.listen(PORT, ()=>{
    console.log(`......Server is running on port ${PORT}......`)
})


//welcome message
app.get("/", (req, res)=>{
    res.status(200).json({message: "....Welcome to max server...."})
})


//adds new user
app.post("/add-user", async (req, res)=>{

    //destructure data gotten from request body
    const { fullName, email, age } = req.body

    if((!fullName) || (fullName.length < 3)){

        return res.status(400).json({message: "Please enter your fullname, and should be more than three characters"})
    }

    if(!email){
        return res.status(400).json({message: "Please enter your email!"})
    }
    const alreadyExist = await Users.findOne({email})

    if(alreadyExist){
        return res.status(400).json({message: "User already exist!"})
    }

    const newUser = new Users({ fullName, email, age })

    await newUser.save()

    return res.status(200).json({

            message: "User added successfully!",
            user: newUser 
        })
})


//updates user email
app.post("/update-email", async (req, res)=>{

    const {fullName, email} = req.body

    if(!email || !fullName){
        return res.status(400).json({message: "Your email and fullname are required"})
    }

    const oldUser = await Users.findOne({fullName})
    
    if(!oldUser){
        return res.status(400).json({message: "user not found!"})

    }
    
        oldUser.email = email;

        await oldUser.save()


    return res.status(200).json({message: "email updated successfully", email})

})

app.post("/add-users", async (req, res)=>{

    const { firstName, lastName, email, age, phoneNumber, address} = req.body

    
    if(!firstName){
        return res.status(400).json({message: "Please enter your firstname!"})
    }

    if(!lastName){
        return res.status(400).json({message: "Please enter your lastname!"})
    }

    if(!email){
        return res.status(400).json({message: "Please enter your email!"})
    }

    if(!(age >= 18 && age <= 99)){

        return res.status(400).json({message: "Enter a valid age!"})
    }

    const userObjects = new Users({ firstName, lastName, email, age, phoneNumber, address})

    await userObjects.save()

    return res.status(200).json({message: "users added successfully", userObjects})
})




app.get("/user-details", async (req, res)=>{
    const userDetails = await Users.find()

    return res.status(200).json({
        count: userDetails.length,
        message: "Success", userDetails
        
    })
})




app.use((req, res)=>{
    res.status(404).json({message: "This endpoint does not exist yet!"})
})

