const Ride = require("./Models/ride.model.js");
const avaliableDrivers = require("./Models/avaliableDriver.model.js");
const verifyToken = require("./middlewares/socketVerifyToken.js");
const {SocketAuthenticationError} = require("./utils/expressError.js");
const {calculateDistance}=require("./utils/utility.js")
const User =require("./Models/user.model.js");


module.exports = (io) => {
    io.use((socket, next) => {
        const cookie = socket.request.headers.cookie;

        if (!cookie) {return next(new SocketAuthenticationError("Authentication error:No Cookies Found",401))}

        // Parse the specific auth cookie
        const authToken = cookie
            .split("; ")
            .find(row => row.startsWith("kads_token="))
            ?.split("=")[1];

        if (!authToken) {return next(new SocketAuthenticationError("Authentication error:No Token Found",401))};

        // Verify the JWT
        verifyToken(authToken, (err, user) => {
            if (err){return next(new SocketAuthenticationError("Authentication error:Unautherized Token",401))};
            socket.user = user; 
            next();
        });
    });


    io.on("connection", async (socket) => {

        let role=socket.user.role;
        if(role==="customer"){
            socket.join("customers");
            console.log(`Customer Connected:,${socket.id}`);
        }else if(role==="driver"){
            socket.join("drivers");
            console.log(`Driver Connected:,${socket.id}`);
        }

        socket.emit("new",'connection successful');
        socket.emit("userDetails",socket.user);
        socket.on("driverLocation", async (driverLocation) => {
            try {
                if(role==='driver'){
                    let driver = await avaliableDrivers.findOne({ socketId: socket.id });
    
                    if (driver) {
                        if (driver.available) {
                            const updatedDriver = await avaliableDrivers.findOneAndUpdate(
                                { socketId: socket.id },
                                {
                                    location: {
                                        type: "Point",
                                        coordinates: [driverLocation.lng, driverLocation.lat],
                                    },
                                },
                                { new: true }
                            );
                            if(updatedDriver){
                                console.log("Driver location updated:", updatedDriver);
                            }else{
                                console.log("failed to update:",err);
                            }
                        }
                    } else {
                        const newDriver = new avaliableDrivers({
                            socketId: socket.id,
                            identity: socket.user._id,
                            location: {
                                type: "Point",
                                coordinates: [driverLocation.lng, driverLocation.lat],
                            },
                            available: true,
                        });
                        await newDriver.save();
                        console.log("New driver added:", newDriver);
                    }
                }

                const drivers = await avaliableDrivers.find({available:true}).select("location");
                io.to("customers").emit("avaliableDrivers",drivers);
                
            } catch (err) {
                console.error("Error in driverLocation event:", err);
            }
        });


        socket.on("requestRide", async ({customerLocation,source,destination,cost,sourceCords,destiCords}) => {
            console.log(source);
            const drivers = await avaliableDrivers.find({ available: true });

            let shortestPath = Infinity;
            let nearestDriver = null;

            drivers.forEach(driver => {
                const driverLocation = driver.location.coordinates;
                console.log(driverLocation);
                const distance = calculateDistance(
                    customerLocation.lat,
                    customerLocation.lng,
                    driverLocation,
                );

                if (distance < shortestPath) {
                    shortestPath = distance;
                    nearestDriver = driver;
                }
            });

            console.log(nearestDriver);
            if (nearestDriver) {
                const newRide = new Ride({
                    customer: socket.user._id,
                    driver: nearestDriver._id,
                    source:source,
                    destination:destination,
                    status: "requested"
                });
                await newRide.save();

                // Update driver availability and notify customer and driver
                nearestDriver.available = false;
                await nearestDriver.save();

                io.to(socket.id).emit("driverAssigned", {
                    driver: nearestDriver,
                    lat: nearestDriver.location.coordinates.lat,
                    lng: nearestDriver.location.coordinates.lng
                });


                const user= await User.findById(socket.user._id);
                io.to(nearestDriver.socketId).emit("rideAssigned", {
                    rideId:newRide._id,
                    customerLocation,
                    custSocketId:socket.id,
                    customer:user,
                    source:source,
                    destination:destination,
                    cost,
                    sourceCords,
                    destiCords
                });


            } else {
                io.to(socket.id).emit("noDriversAvailable", "No Driver Available");
            }
        });

        socket.on("respondToRide",async({rideId,action,custSocketId,driverLocation})=>{
            const ride= await Ride.findById(rideId);

            if(!ride) return;

            if(action==="accept"){
                ride.status="ongoing";
                await ride.save();

                io.to(custSocketId).emit("rideAccepted", {
                    driver: ride.driver,
                    source: ride.source,
                    destination: ride.destination,
                    driverLocation
                });
            }else if(action==="decline"){
                const driver= await avaliableDrivers.findById(ride.driver);
                driver.available=true;
                driver.save();
                await Ride.findByIdAndDelete(rideId);
                io.to(custSocketId).emit("rideDeclined","Your Ride Was Declined Please Try Again!");
            }


        })

        socket.on("rideCompleted", async ({rideId,custSocketId}) => {
            const ride = await Ride.findByIdAndUpdate(
                rideId,
                { status: "completed" },
            );

            if (ride) {
                const driver = await avaliableDrivers.findById(ride.driver);
                driver.available = true;
                await driver.save();

                io.to(custSocketId).emit("reachedDestination", "You have reached your destination, Thank You!!");
            }
        });

        socket.emit("availableDrivers", await avaliableDrivers.find({ available: true }));

        socket.on("disconnect", async () => {
            if(role==="driver"){
                const driver = await avaliableDrivers.findOne({ socketId: socket.id });
            
                if (driver) {
                  // Mark driver as unavailable if disconnected
                  const res=await avaliableDrivers.findByIdAndDelete(driver._id);
                  console.log(`Driver Disconnected: ${socket.id}`);
                } 

                const drivers=await avaliableDrivers.find({available:true}).select("location");
                io.to("customers").emit("avaliableDrivers",drivers);
            }else if(role==="customer"){
                console.log(`Customer Disconnected: ${socket.id}`);
            }
          });
    })
}