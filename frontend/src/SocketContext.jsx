import { useContext,useState,createContext,useMemo, useEffect } from "react";
import {server} from '../constants.js'
import io from 'socket.io-client';

const socketContext=createContext();

const getSocket=()=>useContext(socketContext);

const SocketProvider=({children})=>{
    const socket=useMemo(()=>{
        // let backendUrl = `${import.meta.env.VITE_BACKEND_URL}`
        let newSocket=io(server,{withCredentials:true})
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