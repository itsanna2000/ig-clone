import React, { useContext } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import {signOut} from 'firebase/auth'
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export const User = () => {

    const cookies = new Cookies();

    const provider = new GoogleAuthProvider();

    const {setIsAuth, isAuth} = useContext(AuthContext);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((res) => {
            cookies.set("auth-token", res.user.refreshToken);
            setIsAuth(true);
            localStorage.setItem("username", auth.currentUser?.displayName);
            localStorage.setItem("profilePic", auth.currentUser?.photoURL);
            window.location = "/";
        }).catch((err) => {
            alert("Ops! Something went wrong");
        })
    }

    const signUserOut = () => {
        signOut(auth);
        cookies.remove('auth-token');
        localStorage.removeItem("username");
        localStorage.removeItem("profilePic");
        setIsAuth(false);
    }
    
    return (

    <div className="user-page">
        {!isAuth ?
        (<div className="wrapper">
            <h3>Log In</h3>
            <button onClick={signInWithGoogle}>Log In with Google</button>
        </div>) :
        (<div className="wrapper">
           <h3>Log Out</h3>
           <button onClick={signUserOut}>Log Out</button>
        </div>)
        }
    </div>
    )
}