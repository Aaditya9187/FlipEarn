import { useAuth } from "@clerk/clerk-react";
import { CirclePlus, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../configs/axios";
import { getAllUserListing } from "../app/features/listingSlice";

const CredentialSubmission = ({ onClose, listing }) => {
  const {getToken} =useAuth();
  const dispatch = useDispatch();

  const [newField, setNewField] = useState("");
  const [credential, setCredential] = useState([
    { type: "email", name: "Email", value: "" },
    { type: "password", name: "Password", value: "" },
  ]);

  const handleAddField = () => {
    const name = newField.trim();
    if (!name) return toast("Please enter a field name");

    setCredential((prev) => [
      ...prev,
      { type: "text", name, value: "" },
    ]);

    setNewField("");
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    try{
      // Check if there is at least one field
      if(credential.length === 0) return toast("Please add at least one field");
      // Check all fields are filled
      for(const cred of credential){
        if(!cred.value){
          return toast.error(`Please fill in the ${cred.name} field`)
        }
      }

      const confirm = window.confirm("Credential will be verified & changed post submission. Are you sure you want to submit?");
      if(!confirm) return;

      const token = await getToken();
      const {data} = await api.post('/api/listing/add-credential', {credential, listingId:listing.id}, {headers: {Authorization: `Bearer ${token}`}});
      toast.success(data.message);
      dispatch(getAllUserListing({getToken}));
      onClose()

    }catch(error){
      console.log(error)

    }
  };

  const removeField = (index) => {
    setCredential((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg h-screen sm:h-[320px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg">{listing?.title}</h3>
            <p className="text-sm opacity-90">
              Adding Credentials for {listing?.username} on {listing?.platform}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmission}
          className="flex flex-col gap-4 p-4 overflow-y-auto"
        >
          {credential.map((cred, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_3fr_1fr] items-center gap-2"
            >
              <label className="text-sm font-medium text-gray-800">
                {cred.name}
              </label>

              <input
                type={cred.type}
                value={cred.value}
                onChange={(e) =>
                  setCredential((prev) =>
                    prev.map((c, i) =>
                      i === index ? { ...c, value: e.target.value } : c
                    )
                  )
                }
                className="w-full px-2 py-1 border border-gray-300 rounded outline-indigo-500"
              />

              <X
                className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => removeField(index)}
              />
            </div>
          ))}

          {/* Add field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              placeholder="Field name..."
              className="border-b border-gray-300 px-2 py-1 outline-none text-sm w-full"
            />
            <button
              type="button"
              onClick={handleAddField}
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              <CirclePlus className="w-5 h-5" />
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md w-full transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CredentialSubmission;
