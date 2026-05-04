import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance'
import logo from '../../assets/images/logo.png'

const SignUp = () => {

    const [email,setEmail] = useState("")
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState(null)

    const navigate = useNavigate()

  const handleSignUp = async (e)=> {
  e.preventDefault()
  if(!name){
    setError("Please enter your name.")
    return;
  }
  if(!validateEmail(email)){
        setError("Please enter a valid email address.")
        return;
      }
  
  if(!password){
        setError("Please enter a password.")
        return;
      }
      setError("")
      // SignUp API Call
          try {
      const response = await axiosInstance.post("/create-account",{
        fullName:name,
        email:email,
        password:password
      })

      if(response.data && response.data.error){
        setError(response.data.message)
        return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem('token',response.data.accessToken)
        navigate("/dashboard")
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
      } else{
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }


 return (
  <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-50">
    
    <div className="w-full max-w-md border rounded bg-white px-5 sm:px-7 py-6 sm:py-10 shadow-sm">
      
      <form onSubmit={handleSignUp}>

        {/* Logo */}
        <img className="h-20 sm:h-24 mx-auto mb-4" src={logo} alt="logo" />

        {/* Title */}
        <h4 className="text-xl sm:text-2xl mb-6 text-center">
          Sign Up
        </h4>

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="input-box w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="text"
          placeholder="Email"
          className="input-box w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs sm:text-sm pb-2">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="btn-primary w-full py-2 sm:py-3"
        >
          Create Account
        </button>

        {/* Link */}
        <p className="text-xs sm:text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline"
          >
            Login
          </Link>
        </p>

      </form>
    </div>

  </div>
)
}

export default SignUp
