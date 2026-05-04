import React, { useEffect } from 'react'
import { LuCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'

const Toast = ({ isShown, message, type, onClose }) => {

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onClose])

  return (
    <div
      className={`fixed top-5 sm:top-20 left-1/2 sm:left-auto sm:right-5 transform -translate-x-1/2 sm:translate-x-0 transition-all duration-300 z-50 ${
        isShown ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}
    >
      <div
        className={`w-[90vw] sm:w-auto max-w-sm bg-white border shadow-2xl rounded-md relative overflow-hidden`}
      >
        {/* Left indicator bar */}
        <div
          className={`absolute left-0 top-0 h-full w-[5px] ${
            type === "delete" ? "bg-red-500" : "bg-green-500"
          }`}
        />

        <div className="flex items-start gap-3 py-3 px-4">
          
          {/* Icon */}
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shrink-0 ${
              type === "delete" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            {type === 'delete' ? (
              <MdDeleteOutline className="text-lg sm:text-xl text-red-500" />
            ) : (
              <LuCheck className="text-lg sm:text-xl text-green-500" />
            )}
          </div>

          {/* Message */}
          <p className="text-xs sm:text-sm text-slate-800 break-words">
            {message}
          </p>

        </div>
      </div>
    </div>
  )
}

export default Toast