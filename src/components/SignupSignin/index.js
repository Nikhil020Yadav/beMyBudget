import React,{ useState } from 'react';
import "./styles.css"
import Input from '../Input'
import Button from '../Button'
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth"; 
import { auth,db, provider } from '../../firebase';
import {doc,getDoc,setDoc} from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSignin() {
const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");
const [loginForm,setLoginForm]=useState(false);
const [loading,setLoading]=useState(false);
const navigate=useNavigate();    
    

function signupWithEmail(){
        setLoading(true);
        console.log("Name",name);
        console.log("Email",email);
        console.log("PassWord",password);
        console.log("COnfirm Password",confirmPassword);

        //Authenticate the User, or basically create a new account using email and password
        if(name!="" && email!="" && password!="" && confirmPassword!=""){
            if(password==confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User>>>",user);
            toast.success("User Created")
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
            // Create a document with user id as the following id
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
            });
            }
            else{
                toast.error("Password and Confirm Password doesn't match")
                setLoading(false);
            }
            
        }
        else{
            toast.error("All fields are mandatory");
            setLoading(false);
        }
        
}


    function loginUsingEmail(){
        console.log("Email :",email);
        console.log("Password: ",password);
        setLoading(true);
        //Dear Nikhil, add the if condition here
        {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            toast.success("User Logged In!!")
            console.log("User Logged In ->",user);
            setLoading(false);
            navigate("/dashboard");
        
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false);
            toast.error(errorMessage)
            });
        } 
        // else{
        //     toast.error("All fields are mandatory")
        //      setLoading(false);
        // }   
        
    }
    async function createDoc(user){
        //make sure that the doc with the particular uid doesn't exist
        //create a doc.
        setLoading(true);
        if(!user)   return;
        const userRef=doc(db,"users",user.uid);
        const userData=await getDoc(userRef);

        if(!userData.exists()){
            try{
                await setDoc(doc(db,"users",user.uid),{
                    name: user.displayName? user.displayName:name,
                    email:user.email,
                    photoURL:user.photoURL?user.photoURL:"",
                    createdAt:new Date(),
                });
                toast.success("Doc created");
                setLoading(false);
            }
            catch(e){
                toast.error(e.message);
                setLoading(false);
            }
        }
        else{
            //toast.error("Doc already exists")
            setLoading(false);
        }

        

    }

    function googleAuth(){
        setLoading(true)
        try{
            signInWithPopup(auth, provider)
            .then((result) => {
        
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
        
            const user = result.user;
            console.log("User>>>",user);
            createDoc(user);
            setLoading(false);
            navigate("/dashboard");
            toast.success("User Authenticated");
            })
            .catch((error) => {
                setLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            
            toast.error(errorMessage);
            });
        }
        catch(e){
            toast.error(e.message);
            setLoading(false);
        }
        
    }
  return (
    <>
    {loginForm? (
    <div className='signup-wrapper'>
        <h2 className='title'> LogIn on <span style={{color:"var(--theme)"}}> BeMyBudget. </span>
        </h2>

        <form>
            <p className='label'> Email </p>
            <Input 
                type="email"
                state={email} 
                setState={setEmail} 
                placeholder={"Your email"} 
            />
            <p className='label'> Password </p>
            <Input 
                type="password" 
                state={password} 
                setState={setPassword} 
                placeholder={"************"} 
            />
            
            <Button
             disabled={loading}
             text={loading?"Loading...." : "Login Using Email and Password"} 
             onCLick={loginUsingEmail}>

            </Button>
            <p className='p-login'> or </p>
            <Button
            onCLick={googleAuth} 
            text={loading?"Loading...":"Login using Gmail "} />
            
            <p className='p-login choice' onClick={()=>setLoginForm(!loginForm)}> Or Don't Have An Account  </p>
        </form>
    </div>
    ):
    (
    <div className='signup-wrapper'>
        <h2 className='title'> Sign Up on <span style={{color:"var(--theme)"}}> BeMyBudget. </span>
        </h2>

        <form>
            <p className='label'> Full name</p>
            <Input  
                state={name} 
                setState={setName} 
                placeholder={"Your Name"} 
            />
            <p className='label'> Email </p>
            <Input 
                type="email"
                 
                state={email} 
                setState={setEmail} 
                placeholder={"Your email"} 
            />
            <p className='label'> Password  </p>
            <Input 
                type="password"
                state={password} 
                setState={setPassword} 
                placeholder={"************"} 
            />
            <p className='label'> Confirm Password </p>
            <Input 
                type="password" 
                state={confirmPassword} 
                setState={setConfirmPassword} 
                placeholder={"************"} 
            />
            <Button
             disabled={loading}
             text={loading?"Loading...." : "SignUp Using Email and Password"} onCLick={signupWithEmail}>

            </Button>
            <p className='p-login'> or </p>
            <Button
            onCLick={googleAuth} 
            text={loading?"Loading...":"SignUp using Gmail "} />
            
            <p className='p-login choice' onClick={()=>setLoginForm(!loginForm)}> Or Have An Account Already? Click Here </p>
        </form>
    </div>
    )}
    </>
  );
}

export default SignupSignin;
