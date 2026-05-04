import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import moment from 'moment'
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNoteImg from '../../assets/images/add.png'
import noData from '../../assets/images/no-data.png'

const Home = () => {

  const [openAddEditModal,setOpenAddEditModal] = useState({
    isShown: false,
    type:"add",
    date:null
  })

  const [showToastMsg, setshowToastMsg] = useState({
    isShown:false,
    message:"",
    type:"add"
  })

  const [isSearch, setIsSearch] = useState(false)
  const [userInfo,setUserInfo] = useState(null);
  const navigate = useNavigate()

  const [allNotes, setAllNotes] = useState([])

const handleEdit = (noteDetails) => {
  setOpenAddEditModal({
    isShown:true,
    data:noteDetails,
    type:"edit"
  })
}
const showToastMessage = (message,type) => {
  setshowToastMsg({
    isShown:true,
    message,
    type
  })
}
const handleCloseToast = () => {
  setshowToastMsg({
    isShown:false,
    message:""
  })
}

  //Get user info
  const getUserInfo = async () => {
     try {
      const response = await axiosInstance.get("/get-user")
      if(response.data){
        setUserInfo(response.data.user)
      }
     } catch (error) {
      if(error.response.status === 401){
        localStorage.clear()
        navigate("/login")
      }
     }
  }

  //Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes')
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  }

  //Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete('/delete-note/'+ noteId)

      if(response.data && !response.data.error){
        showToastMessage("Note Deleted Successfully","delete")
        getAllNotes()
      }

    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
         console.log("An unexpected error occurred. Please try again.");
      }
    }
  }

  //Search For a Notes
  const onSearchNote = async (query)=>{
    try {
      const response = await axiosInstance.get("/search-note",{
        params:{query}
      });
      if(response.data && response.data.notes){
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error);
    }
  }

  //handle clear search
  const handleClearSearch = () =>{
    setIsSearch(false)
    getAllNotes()
  }

  const updateIsPinned = async (noteData) => {
        const noteId = noteData._id
    try {
      const response = await axiosInstance.put('/update-note-pinned/'+ noteId ,{
       isPinned:!noteData.isPinned
      })

      if(response.data && response.data.note){
        showToastMessage("Note Updated Successfully")
        getAllNotes()
      }

    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      await getUserInfo();
    };
    fetchUserInfo();
     const fetchNotesInfo = async () => {
      await getAllNotes();
    };
    fetchNotesInfo();
  },[])

  
  return (
   <>
  <Navbar 
    userInfo={userInfo} 
    onSearchNote={onSearchNote} 
    handleClearSearch={handleClearSearch} 
  />

  <div className="max-w-7xl mx-auto px-4 sm:px-6">

    {/* Notes Grid */}
    {allNotes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 sm:mt-8">
        {allNotes.map((item) => (
          <NoteCard
            key={item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updateIsPinned(item)}
          />
        ))}
      </div>
    ) : (
      <EmptyCard
        imgSrc={isSearch ? noData : addNoteImg}
        message={
          isSearch
            ? `Oops! Not found. Want to create? Click the 'Add' button to write down your thoughts, ideas, and reminders.`
            : `Start creating your first note! Click the 'Add' button to write down your thoughts, ideas, and reminders. Let's get started!`
        }
      />
    )}
  </div>

  {/* Floating Add Button */}
  <button
    className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-primary hover:bg-blue-600 fixed bottom-5 right-5 sm:bottom-10 sm:right-10 shadow-lg"
    onClick={() => {
      setOpenAddEditModal({ isShown: true, type: "add", data: null })
    }}
  >
    <MdAdd className="text-xl sm:text-2xl text-white" />
  </button>

  {/* Modal */}
  <Modal
    isOpen={openAddEditModal.isShown}
    onRequestClose={() => {
      setOpenAddEditModal({ isShown: false, type: "add", data: null })
    }}
    style={{
      overlay: {
        backgroundColor: "rgba(0,0,0,0.3)",
      },
    }}
    className="w-[95vw] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto bg-white rounded-md mx-auto mt-10 sm:mt-14 p-4 sm:p-5"
  >
    <AddEditNotes
      type={openAddEditModal.type}
      noteData={openAddEditModal.data}
      onClose={() => {
        setOpenAddEditModal({ isShown: false, type: "add", data: null })
      }}
      getAllNotes={getAllNotes}
      showToastMessage={showToastMessage}
    />
  </Modal>

  <Toast
    isShown={showToastMsg.isShown}
    message={showToastMsg.message}
    type={showToastMsg.type}
    onClose={handleCloseToast}
  />
</>
  );
};


export default Home;
