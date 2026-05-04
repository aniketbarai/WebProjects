import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center w-full bg-transparent border-[1.5px] px-3 sm:px-5 rounded mb-3">
      
      {/* Input */}
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm sm:text-base bg-transparent py-2 sm:py-3 mr-2 sm:mr-3 outline-none"
      />

      {/* Toggle Icon */}
      <div className="shrink-0 cursor-pointer" onClick={toggleShowPassword}>
        {isShowPassword ? (
          <FaRegEye className="text-lg sm:text-xl text-primary" />
        ) : (
          <FaRegEyeSlash className="text-lg sm:text-xl text-primary" />
        )}
      </div>

    </div>
  );
};

export default PasswordInput;