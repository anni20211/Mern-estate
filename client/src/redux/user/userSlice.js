import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser:null,
    error:null,
    loading:false
  }
 export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.error=null,
            state.loading=false
        },
        signInFail:(state,action)=>{
            state.error=action.payload,
            state.loading=false
            
        },
        updateUserStart:(state)=>{
            state.loading=true
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading=false,
            state.error=null
        },
        updateUserFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        }, 
         deleteUserStart:(state)=>{
            state.loading=true
        },
        deleteUserSuccess:(state,action)=>{
            state.currentUser=null,
            state.loading=false,
            state.error=null
        },
        deleteteUserFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        }
        , 
         logoutUserStart:(state)=>{
            state.loading=true
        },
        logoutUserSuccess:(state,action)=>{
            state.currentUser=null,
            state.loading=false,
            state.error=null
        },
        logoutUserFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        }
    }
});
export const {signInStart,signInSuccess,signInFail,updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteteUserFailure,logoutUserStart,logoutUserSuccess,logoutUserFailure}=userSlice.actions;
export default userSlice.reducer;