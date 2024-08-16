import React from 'react';
import { IoIosClose } from "react-icons/io";

const DetailedInfo = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="mx-[40%] mt-[6%] w-[850px]  rounded-2xl inset-5 bg-gray-900 bg-transparent  flex  absolute  ">

        
        <button 
          className="text-white absolute right-3 top-4 "
          onClick={onClose}
        >
          <IoIosClose size={30} />

        </button>
        <div className="flex flex-col  bg-white py-5 px-3 w-full">

        <div className="bg-cyan-600 px-4 py-4"> <img src={user.image} alt="Avatar" className="w-16 h-16 rounded-full mr-4" />
       
       <h2 className="text-white text-2xl font-semibold">{user.name}</h2>
<div className="flex flex-row">
       <div>
       <p className="text-white">@{user.username} <span className="mx-2">|</span></p>
       <p className="text-white">User ID </p>
       </div>
       <div>
       <p className="text-white "> {user.role}</p>
       <p className="text-white -ml-5 "><span className="mx-2">|</span>Role</p>
       </div>
       </div>
    </div>
    
         

    <div className="my-4 bg-white">
          <h3 className="px-4 py-2 font-semibold bg-blue-200 text-gray-600 ">Personal Information</h3>

<div className="flex border-b">
          <div>
    <p className="mx-4 mt-2 border-b py-2">Date Of Birth </p>
    <p className="mx-4 mt-2 border-b py-2">Gender </p>
    <p className="mx-4 mt-2 border-b py-2">Nationality </p>
    <p className="mx-4 mt-2 border-b py-2">Contact No. </p>
    <p className="mx-4 mt-2 border-b py-2"> E-mail Address </p>
    <p className="mx-4 mt-2 border-b py-2">Work email Address</p>
    </div>
    <div>
    <p className="mx-4 mt-2 border-b py-2">29-04-2005 </p>
    <p className="mx-4 mt-2 border-b py-2">Female </p>
    <p className="mx-4 mt-2 border-b py-2">Canadian </p>
    <p className="mx-4 mt-2 border-b py-2">123345677 </p>
    <p className="mx-4 mt-2 border-b py-2">{user.email} </p>
    <p className="mx-4 mt-2 border-b py-2">{user.email} Work email Address </p>
    </div>
    </div>
        </div>
        <h3 className="px-4 py-2 font-semibold bg-blue-200 text-gray-600 ">Research & Pubications</h3>
        <div className=" bg-white">


            <p className=" px-4 font-semibold py-4">AI and User Experience : The Future of Design</p>
            <p className="px-4 py-3">Designing for the Future: The Role of AI in User Experience</p>
            <p className=" px-4 py-3">AI, Iot based real time condition monitoring of Electrical Machines using python
                language and Abstract. AI, Iot based real time condition monitoring of Electrical Machines using python
                language and Abstract <span className="text-red-400">See More ...</span>
            </p>

            <button className= "mt-4 px-4 text-red-400 mb-[41%]">SEE PUBLICATION</button>
        </div>
        </div>
        
    </div>
  );
};

export default DetailedInfo;
