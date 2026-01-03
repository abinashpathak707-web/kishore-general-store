
import React, { useState } from 'react';

interface SettingsViewProps {
  pin: string | null;
  onSetPin: (pin: string) => void;
  onClearData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ pin, onSetPin, onClearData }) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [verifyPinForClear, setVerifyPinForClear] = useState('');

  const handleSavePin = () => {
    if (newPin.length !== 4) return alert("PIN 4 digit ka hona chahiye!");
    if (newPin !== confirmPin) return alert("PIN match nahi hua!");
    onSetPin(newPin);
    setNewPin('');
    setConfirmPin('');
    alert("PIN set ho gaya!");
  };

  const handleFinalClear = () => {
    if (pin && verifyPinForClear !== pin) return alert("Galat PIN!");
    if (confirm("Kya aap sach mein sab kuch delete karna chahte hain? Ye wapas nahi aayega!")) {
      onClearData();
    }
  };

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Security & Settings</h2>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <p className="font-bold text-xs text-pink-600 uppercase tracking-widest">
          {pin ? 'Change PIN' : 'Set Security PIN (First Time)'}
        </p>
        <p className="text-[10px] text-gray-400 font-bold leading-tight">PIN se delete aur edit safe rahega.</p>
        <input 
          type="password" 
          maxLength={4} 
          value={newPin} 
          onChange={e => setNewPin(e.target.value)} 
          placeholder="Naya 4-Digit PIN" 
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-pink-200 text-center text-xl font-black tracking-widest" 
        />
        <input 
          type="password" 
          maxLength={4} 
          value={confirmPin} 
          onChange={e => setConfirmPin(e.target.value)} 
          placeholder="Confirm Naya PIN" 
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-pink-200 text-center text-xl font-black tracking-widest" 
        />
        <button onClick={handleSavePin} className="w-full bg-pink-500 text-white p-4 rounded-2xl font-black shadow-lg uppercase">Update PIN</button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-red-50 shadow-sm space-y-4">
        <p className="font-bold text-xs text-red-600 uppercase tracking-widest">Danger Zone</p>
        {!isClearing ? (
          <button onClick={() => setIsClearing(true)} className="w-full border-2 border-red-100 text-red-500 p-4 rounded-2xl font-black uppercase">Clear All History</button>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-red-400 font-black uppercase">Enter PIN to Clear Everything:</p>
            <input 
              type="password" 
              maxLength={4} 
              value={verifyPinForClear} 
              onChange={e => setVerifyPinForClear(e.target.value)} 
              className="w-full p-4 bg-red-50 rounded-2xl outline-none border border-red-200 text-center text-xl font-black" 
            />
            <div className="flex gap-2">
              <button onClick={() => setIsClearing(false)} className="flex-1 bg-gray-100 p-4 rounded-2xl font-bold uppercase text-xs">Cancel</button>
              <button onClick={handleFinalClear} className="flex-1 bg-red-600 text-white p-4 rounded-2xl font-black uppercase text-xs">Confirm Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;
