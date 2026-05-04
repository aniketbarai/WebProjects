import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({ tags, setTag }) => {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTag([...tags, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ✅ prevent form submit
      addNewTag()
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTag(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs sm:text-sm text-slate-900 bg-slate-100 px-2 sm:px-3 py-1 rounded max-w-full break-words"
            >
              #{tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose className="text-sm" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-3">
        
        <input
          type="text"
          value={inputValue}
          className="w-full text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-full sm:w-10 h-10 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700"
          onClick={addNewTag}
        >
          <MdAdd className="text-xl text-blue-700 hover:text-white" />
        </button>

      </div>

    </div>
  )
}

export default TagInput