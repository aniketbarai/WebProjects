import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from "react-router-dom";
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({userInfo,onSearchNote,handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleSearch =  ()=>{
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = ()=>{
    setSearchQuery("")
    handleClearSearch()
  }

    return (
  <div className='bg-white px-4 sm:px-6 py-3 drop-shadow'>
    
    {/* Top Row */}
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
      
     <div className='flex items-center justify-between p-2 gap-4 flex-wrap'>
       {/* Logo / Title */}
      <h2 className='text-2xl sm:text-xl font-medium text-black'>
        SmartNote
      </h2>

      {/* Profile */}
      <div className='flex sm:justify-normal'>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
     </div>

      {/* Search */}
      <div className='w-full sm:w-auto'>
        <SearchBar 
          value={searchQuery} 
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      </div>


    </div>

  </div>
)
}

export default Navbar
