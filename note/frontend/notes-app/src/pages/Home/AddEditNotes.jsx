import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosinstance'

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, showToastMessage }) => {

  const [title, setTitle] = useState(noteData?.title || "")
  const [content, setContent] = useState(noteData?.content || "")
  const [tags, setTags] = useState(noteData?.tags || [])
  const [error, setError] = useState(null)

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', { title, content, tags })

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      }
    }
  }

  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put('/edit-note/' + noteId, {
        title, content, tags,
      })

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      }
    }
  }

  const handleAddNote = () => {
    if (!title) return setError("Please enter the title")
    if (!content) return setError("Please enter the content")

    setError("")

    type === 'edit' ? editNote() : addNewNote()
  }

  return (
    <div className='relative w-full max-w-xl mx-auto p-4 sm:p-6'>

      {/* Close Button */}
      <button
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center absolute top-2 right-2 sm:-top-3 sm:-right-3 hover:bg-slate-500 hover:text-white"
        onClick={onClose}
      >
        <MdClose className="text-lg sm:text-xl text-slate-400" />
      </button>

      {/* Title */}
      <div className='flex flex-col gap-2'>
        <label className="input-label text-xs sm:text-sm">TITLE</label>
        <input
          type="text"
          className="text-lg sm:text-2xl text-slate-950 outline-none border-b pb-1"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 mt-4">
        <label className='input-label text-xs sm:text-sm'>CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 sm:p-3 rounded resize-none"
          placeholder='Content'
          rows={6}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="input-label text-xs sm:text-sm">TAGS</label>
        <TagInput tags={tags} setTag={setTags} />
      </div>

      {/* Error */}
      {error && (
        <p className='text-red-500 text-xs sm:text-sm pt-3'>
          {error}
        </p>
      )}

      {/* Button */}
      <button
        className='btn-primary w-full sm:w-auto font-medium mt-5 p-2 sm:p-3'
        onClick={handleAddNote}
      >
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>

    </div>
  )
}

export default AddEditNotes