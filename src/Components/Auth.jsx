import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addUser } from '../Utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { base_url } from '../Utils/Constants';



const Auth = () => {

    const[email, setEmail] = useState("")
    const[username, setUsername] = useState("shubhamkashyap")
    const[password, setPassword] = useState("Qwerty123!")
    const[isLoginPage, setIsLoginPage] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const btnClickHandler = async() =>
    {
      try {
        if(username.length < 2)
          {
            toast.error("Invalid Username")
            return
          }
          if(password.length < 8)
          {
            toast.error("Password should be atleast 8 characters")
            return
          }
          if(isLoginPage)
          {
            const res = await axios.post(base_url + "/auth/login", {username, password}, {withCredentials : true})
            // console.log(res)
            if(res.status == 200)
            {
              dispatch(addUser(res.data.data))
              navigate("/home")
            }
          }
          else
          {
            if(!validator.isEmail(email))
            {
              toast.error("Please enter a valid email")
              return
            }
            if(!validator.isStrongPassword(password))
            {
              toast.error("Please enter a strong password")
              return
            }
            const res = await axios.post(base_url + "/auth/signup", {username, password, emailId : email}, {withCredentials : true})
            if(res.status == 200)
            {
              dispatch(addUser(res.data.data))
              navigate("/profile/edit")
            }
          }
      } catch (error) {
        toast.error(error.response.data.error)
      }
    }

  return (
    <div className='flex h-[100vh] items-center justify-center bg-gray-100'>
      <div className='border border-gray-300 shadow-lg bg-white p-8 rounded-2xl w-96'>
        <h2 className='text-2xl font-semibold text-center mb-6'>{isLoginPage ? "Log in" : "Sign Up"}</h2>
        <div className='flex flex-col space-y-4'>
          {!isLoginPage && <input
          onChange={(e) => {
            setEmail(e.target.value)
          }}   
            value={email}
            type='text'
            placeholder='Email'
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />}
          <input
            value={username}
            onChange={(e) => {
                setUsername(e.target.value)
            }}    
            type='text'
            placeholder='Username'
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <input
            value={password}
            onChange={(e) => {
                setPassword(e.target.value)
            }}    
            type='password'
            placeholder='Password'
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button onClick={btnClickHandler} className='bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300'>
            {isLoginPage ? "Login" : "Signup"}
          </button>
          {isLoginPage ? <p className='text-sm'>Not a user? <span onClick={() => {
            setIsLoginPage(false)
          }} className='text-blue-400 cursor-pointer'>Sign up</span></p> : <p className='text-sm'>Already a user? <span onClick={() => {
            setIsLoginPage(true)
          }} className="text-blue-400 cursor-pointer">Sign in</span></p>}

        </div>
      </div>
    </div>
  );
};

export default Auth;
