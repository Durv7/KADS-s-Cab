import { useContext,useState,createContext,useMemo, useEffect } from "react";
import io from 'socket.io-client';

const socketContext=createContext();

const getSocket=()=>useContext(socketContext);

const SocketProvider=({children})=>{
    const socket=useMemo(()=>{
        let newSocket=io('http://localhost:8080',{withCredentials:true})
        return newSocket;
    },[]);

    useEffect(()=>{
        return ()=>{
            if(socket){
                socket.disconnect();
                console.log("socket disconnected");
            }
        }   
    },[socket]);

    return(
        <socketContext.Provider value={socket}>{children}</socketContext.Provider>
    )
}

export {getSocket,SocketProvider};