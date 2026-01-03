
import React, { useState } from 'react';
import { Bill, UnitType } from '../types';

interface BillDetailViewProps {
  bill: Bill;
  onBack: () => void;
  onDelete: (id: string) => void;
  pin: string | null;
}

const BillDetailView: React.FC<BillDetailViewProps> = ({ bill, onBack, onDelete, pin }) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [verifyPin, setVerifyPin] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const formatQtyDisplay = (qty: number, unit: UnitType) => {
    if (unit === 'Piece') return `${qty} pc`;
    if (qty >= 1000) return `${qty / 1000} KG`;
    return `${qty} gram`;
  };

  const handleShare = () => {
    let msg = `*Kishore General Store*\n`;
    msg += `Bill #: ${bill.billNumber}\n`;
    msg += `Customer: ${bill.customerName}\n`;
    msg += `--------------------------\n`;
    bill.items.forEach(it => {
      msg += `${it.name}: ${formatQtyDisplay(it.quantity, it.unit)} = ₹${it.calculatedPrice.toFixed(1)}\n`;
    });
    msg += `--------------------------\n`;
    msg += `*TOTAL: ₹${bill.totalAmount.toFixed(1)}*\n`;
    msg += `Paid: ₹${bill.paidAmount} | Due: ₹${bill.dueAmount}\n\n`;
    msg += `Dhanyawad! Phir aaiyega!`;
    window.open(`https://wa.me/${bill.customerMobile}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const attemptDelete = () => {
    if (pin) {
      setShowPinModal(true);
    } else {
      if (confirm("Kya aap ye bill delete karna chahte hain?")) {
        onDelete(bill.id);
      }
    }
  };

  const confirmDelete = () => {
    if (verifyPin === pin) {
      onDelete(bill.id);
    } else {
      alert("Galat PIN re baba!");
    }
    setShowPinModal(false);
    setVerifyPin('');
  };

  return (
    <div className="min-h-screen bg-white pb-32 overflow-y-auto">
      <header className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20 no-print">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">←</button>
          <h2 className="font-black text-gray-800">Bill #{bill.billNumber}</h2>
        </div>
        <button onClick={attemptDelete} className="p-2 text-red-400">🗑️</button>
      </header>

      <div id="printable-area" className="p-6 space-y-8 print:p-2">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-gray-800">KISHORE GENERAL STORE</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Smart Khata & Billing</p>
          <div className="py-4 border-b-2 border-dashed border-gray-100">
            <p className="text-sm font-black">BILL NO: {bill.billNumber}</p>
            <p className="text-[10px] text-gray-400 uppercase">{bill.date} | {bill.time}</p>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[8px] font-bold text-gray-400 uppercase">Customer:</p>
            <p className="font-black text-gray-800 leading-none">{bill.customerName}</p>
            <p className="text-xs text-gray-500">{bill.customerMobile}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${bill.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {bill.status}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase border-b border-gray-100 pb-2">
            <span>Item</span>
            <span>Subtotal</span>
          </div>
          {bill.items.map((it, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <p className="font-black text-gray-800 text-sm leading-tight">{it.name}</p>
                <p className="text-[10px] text-gray-500 font-bold">
                  {formatQtyDisplay(it.quantity, it.unit)} @ ₹{it.basePrice}/{it.unit}
                </p>
              </div>
              <p className="font-black text-gray-800">₹{it.calculatedPrice.toFixed(1)}</p>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-gray-100 pt-6 space-y-3">
          <div className="flex justify-between font-black text-gray-800">
            <span className="uppercase text-[10px]">Grand Total</span>
            <span className="text-2xl">₹{bill.totalAmount.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-bold">
            <span className="uppercase text-[8px]">Paid Amount</span>
            <span>₹{bill.paidAmount}</span>
          </div>
          <div className="flex justify-between text-xs text-red-600 font-bold">
            <span className="uppercase text-[8px]">Total Dues</span>
            <span>₹{bill.dueAmount}</span>
          </div>
        </div>

        <div className="text-center pt-8 space-y-1 border-t border-gray-50">
          <p className="text-xs font-black italic">Dhanyawad! Phir Aaiyega!</p>
          <p className="text-[8px] text-gray-300 uppercase tracking-widest">Powered by Smart Khata</p>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 space-y-3 no-print z-50">
        <button onClick={handlePrint} className="w-full bg-gray-900 text-white p-5 rounded-[30px] font-black shadow-2xl flex items-center justify-center gap-3 uppercase active:scale-95 transition-all">
          <span className="text-xl">🖨️</span> Print Bill
        </button>
        <button onClick={handleShare} className="w-full bg-green-500 text-white p-5 rounded-[30px] font-black shadow-2xl flex items-center justify-center gap-3 uppercase active:scale-95 transition-all">
          <span className="text-xl">💬</span> Send on WhatsApp
        </button>
      </div>

      {showPinModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-10 backdrop-blur-sm">
          <div className="bg-white w-full rounded-[40px] p-8 space-y-6 shadow-2xl">
            <h3 className="font-black text-gray-800 text-center">Verify PIN</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase text-center">Delete karne ke liye security PIN dalo.</p>
            <input 
              autoFocus
              type="password" 
              maxLength={4} 
              value={verifyPin} 
              onChange={e => setVerifyPin(e.target.value)}
              className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-pink-100 outline-none font-black text-3xl text-center tracking-widest"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowPinModal(false)} className="flex-1 p-4 bg-gray-100 rounded-2xl font-bold text-gray-500 uppercase text-xs">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 p-4 bg-pink-600 rounded-2xl font-black text-white uppercase text-xs">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetailView;
