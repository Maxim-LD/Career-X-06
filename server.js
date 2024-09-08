

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
    const { firstName, lastName, email, age } = req.body

    if((!firstName && lastName) || (firstName.length < 3)){

        return res.status(400).json({message: "Please enter your name, and should be more than three characters"})
    }

    if(!email){
        return res.status(400).json({message: "Please enter your email!"})
    }
    const alreadyExist = await Users.findOne({email})

    if(alreadyExist){
        return res.status(400).json({message: "Email already exist!"})
    }

    const newUser = new Users({ firstName, lastName, email, age })

    await newUser.save()

    return res.status(200).json({

            message: "User added successfully!",
            user: newUser 
        })
})

//updates user email
app.post("/update-email", async (req, res)=>{

    const {firstName, email} = req.body

    if(!email || !firstName){
        return res.status(400).json({message: "Your email and firstName are required"})
    }

    const oldUser = await Users.findOne({

        firstName: firstName, 
        email: email
    })
    
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

// get one - find one user or product 
app.get("/one-user/:id", async (req, res)=>{

    const { id } = req.params

    const user = await Users.findById(userId)

    if(!user){

        return res.status(404).json({message: "User not found!"})
    }

    return res.status(200).json({message: " Success!", user})

})

// update one 
app.put("/edit-user", async (req, res)=>{

    const { email } = req.body


    //find the user by one (email) and use it to update the other parameter
    const updatedUser = await Users.findByOneAndUpdate(

        email,
        {  firstName, lastName }
    )

    return res.status(200).json({
        message: "User updated successfully!",
        user: updatedUser
    })
})

//delete one
app.delete("/delete-user/:id", async (req, res)=>{

    const { id } = req.params

    const deletedUser = await Users.findByIdAndDelete(id)

    return res.status(200).json({message: "user deleted successfully"})
})


app.post("/fund-wallet", async (req, res)=>{

    const { email, amount } = req.body

    const user = await Users.findOne({email})

    if(!user){
        return res.status(404).json({message: "account not found!"})
    }
    user.walletBalance += Number(amount)

    await user.save()

    return res.status(200).json({message: "payment successful!"})
})











app.use((req, res)=>{
    res.status(404).json({message: "This endpoint does not exist yet!"})
})

