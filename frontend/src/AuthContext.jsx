import React, {createContext,useState,useEffect,useContext, } from "react";
import axios from "axios";


const AuthContext = createContext();

export const useAuth=()=>{
    return useContext(AuthContext);
}

export const  AuthProvider =({children})=>{

    const[isLogin,setIsLogin]=useState(false);
    const[user,setUser]=useState(null);
    const [loading, setLoading] = useState(true);
    
    async function checkAuth(){
        await axios.get('http://localhost:8080/api/check_auth',{withCredentials:true})
        .then((response)=>{
          let role=response.data.role;
          if(response.data.isLogin){
            if(role==='customer'){

              setUser({...response.data.customer,role:'customer'});
              setIsLogin(true);
            }else if(role==='driver'){
  
              setUser({...response.data.driver,role:'driver'});
              setIsLogin(true);
            }else{
              setIsLogin(false);
            }
            
          }else{
            console.log("else here");
            setIsLogin(false);
            setUser(null);
          }

        })
        .catch((err)=>{
            
          console.log("Error In Checking",err.message);
        }).finally(()=>{
          setLoading(false);
        })
      }
      useEffect(()=>{
        checkAuth();
      },[]);

      const value={
        user,isLogin,setUser,setIsLogin,loading
      }

      return(
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      )
}
