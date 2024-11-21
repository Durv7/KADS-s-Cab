const express  = require("express");
const app = express();
const cors = require("cors")
const http = require("http");
const dotenv = require("dotenv");
const socketIo= require("socket.io");
const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const {connectDB} = require("./utils/feature.js");
const customerRoutes =require("./Routes/customer.routes.js");
const driverRoutes =require("./Routes/driver.routes.js");
const checkRoute=require("./Routes/checkRoute.js");
const socketHandler = require("./socket.js");
const {url}=require("./constants.js");

dotenv.config({
    path:"./.env"
})

connectDB(process.env.MONGO_URI);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: url,
    credentials: true,
}));
const io = socketIo(server, {
    cors:{
        origin:[`${process.env.FRONTEND_URL}`,'http://localhost:5173'],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
    
})

socketHandler(io);

app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    console.log('Path:', req.path);
    next();
});


app.use("/api/customer",customerRoutes);
app.use("/api/driver",driverRoutes);
app.use("/api/check_auth",checkRoute);
// app.get("/",(req,res)=>{
//     res.send("Working");
// })








// io.on("connection",(socket)=>{
//     console.log(`New client joined:${socket.id}`);
// 
//     socket.on("driverLocation",(location)=>{
//         
//        if(assignments[socket.id]){
//         socket.emit("updateDriverLocation",{...location});
//        }else{
//         avaliableDrivers[socket.id] = {...location};
//        }
//     })
// 
//     socket.on("requestRide",(customerLocation)=>{
// 
//         let shortestPath = Infinity;
//         let nearestDriver = null;
//         Object.keys(avaliableDrivers).forEach((driverId)=>{
//             const driver=avaliableDrivers[driverId];
//             const distance = calculateDistance(customerLocation.lat, customerLocation.lng,driver.lat,driver.lng);
//             if(distance<shortestPath){
//                 shortestPath = distance;
//                 nearestDriver = driver;
//             }
//         })
// 
//         
//         if(nearestDriver){
//             console.log(nearestDriver);
// 
//             io.to(socket.id).emit("driverAssigned",{driverId:getDriverKey(nearestDriver), lat:nearestDriver.lat, lng:nearestDriver.lng});//notify customer
//             
//             io.to(getDriverKey(nearestDriver)).emit("rideAssigned",{customerId:socket.id,lat:customerLocation.lat,lng:customerLocation.lng});//notify driver
//             
//             assignments[getDriverKey(nearestDriver)] = socket.id;
//             delete avaliableDrivers[getDriverKey(nearestDriver)];
//             console.log(avaliableDrivers);
//         }else{
//             io.to(socket.id).emit("noDriversAvailable","No Driver Avaliable");
//         }
//     })
// 
//     socket.on("rideCompleted",(data)=>{
//         console.log(assignments);
//         
//         if(assignments[socket.id]){
//             delete assignments[socket.id];
//         }
// 
//         let {lat,lng}=data;
//         avaliableDrivers[socket.id]={lat,lng};
//         socket.to(data.assignedCustomer).emit("reachedDestination","You Have Reached Your Destination");
//         console.log(avaliableDrivers);
//     })
// 
//     socket.emit("avaliableDrivers",{...avaliableDrivers});
// 
//     //disconnects
// 
//     socket.on("disconnect",()=>{
//         if(avaliableDrivers[socket.id]){
//             console.log(`Driver Disconnected ${socket.id}`)
//             delete avaliableDrivers[socket.id];
//         }else{
//             console.log(`Customer Disconnected ${socket.id}`)
//         }
//     });
// })

app.use((err,req,res,next)=>{
    if (err.isOperational) {
        return res.status(err.statusCode||500).json({
          status: 'error',
          message: err.message,
        });
    }

    console.log('Unexpected Error:',err);

    res.status(500).json({
        status:err,
        message:"Something Went Wrong, Please Try Again!"
    })
})


server.listen(8080,()=>{
    console.log("Server Is Listening At Port 8080");
})



