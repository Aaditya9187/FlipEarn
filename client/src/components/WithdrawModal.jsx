import { useAuth } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import api from '../configs/axios';
import { getAllUserListing } from '../app/features/listingSlice';

const WithdrawModal = ({ onClose = () => {} }) => {
  const {getToken} = useAuth();
  const dispatch = useDispatch();



  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState([
    { id: "holder", type: "text", name: "Account Holder Name", value: "" },
    { id: "bank", type: "text", name: "Bank Name", value: "" },
    { id: "number", type: "text", name: "Account Number", value: "" },
    { id: "type", type: "text", name: "Account Type", value: "" },
    { id: "swift", type: "text", name: "SWIFT", value: "" },
    { id: "branch", type: "text", name: "Branch", value: "" },
  ]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    try{
      // check if there is at least one field 
      if(account.length === 0){
        return alert("Please fill in at least one field");
      }

      // check if fields ar filled 
      for(const field of account){
        if(!field.value){
          return toast.error(`Please fill in the ${field.name} field`);
        }
      }

      // 
      const confirm = window.confirm("Are you sure you want to withdraw?")
      if(!confirm) return;

      const token = await getToken();
      const {data} = await api.post('/api/listing/withdraw', {account, amount: parseInt(amount)}, {headers: {Authorization: `Bearer ${token}`}});
      toast.success(data.message);
      dispatch(getAllUserListing({getToken}));
      onClose();
    }catch(error){
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const handleAccountChange = (index, newValue) =>
    setAccount((prev) => prev.map((c, i) => (i === index ? { ...c, value: newValue } : c)));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate">Withdraw Funds</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close withdraw modal"
            className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmission} className="p-4 flex-1 overflow-hidden">
          <div className="flex flex-col gap-4 h-full">
            {/* Scrollable fields area */}
            <div className="space-y-3 overflow-y-auto pr-2 max-h-[60vh]">
              {/* Amount row (3 columns: label, input, empty for alignment) */}
              <div className="grid grid-cols-[2fr_3fr_1fr] items-center gap-2">
                <label htmlFor="amount" className="text-sm font-medium text-gray-800">
                  Amount
                </label>
                <input
                  id="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  type="number"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400"
                  required
                />
                <div /> {/* empty cell to keep alignment */}
              </div>

              {/* Account fields */}
              {account.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[2fr_3fr_1fr] items-center gap-2">
                  <label htmlFor={field.id} className="text-sm font-medium text-gray-800">
                    {field.name}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleAccountChange(index, e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400"
                  />
                  <div /> {/* empty cell for alignment / future action */}
                </div>
              ))}
            </div>

            {/* submit button - fixed at bottom of modal content */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition"
              >
                Apply for Withdrawal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
