import { useDispatch } from "react-redux";
import { app } from "../firebase";
import {GoogleAuthProvider ,getAuth, signInWithPopup} from "firebase/auth";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const handleGoogleClick=async()=>{
        try {
            const provider = new GoogleAuthProvider();
            const auth=getAuth(app);

            const result=await signInWithPopup(auth,provider);

            const res= await fetch("/api/auth/google",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    photo:result.user.photoURL
                })
            })
            const data=await res.json();
            dispatch(signInSuccess(data));
            navigate("/");

        } catch (error) {
            console.log("problem with google authentication", error );  
        }

    }
  return (
    <button  onClick={handleGoogleClick} type='button' className='bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-80 ' >CONTINUE WITH GOOGLE</button>

  );
}

export default OAuth;
