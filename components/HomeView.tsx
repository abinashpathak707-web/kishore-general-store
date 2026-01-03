
import React from 'react';
import { AppTab, Bill } from '../types';

interface HomeViewProps {
  stats: { totalSales: number; totalDues: number };
  bills: Bill[];
  onNavigate: (tab: AppTab) => void;
  onBillSelect: (bill: Bill) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ stats, bills, onNavigate, onBillSelect }) => (
  <div className="p-5 space-y-6">
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Kishore Store</h1>
        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Smart Khata</p>
      </div>
      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-xl border border-pink-200 shadow-inner">🏬</div>
    </header>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-pink-50">
        <p className="text-[10px] text-pink-600 font-bold uppercase">Total Sale</p>
        <p className="text-xl font-black text-gray-800">₹{stats.totalSales.toFixed(0)}</p>
      </div>
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-yellow-50">
        <p className="text-[10px] text-yellow-600 font-bold uppercase">Total Udhaar</p>
        <p className="text-xl font-black text-gray-800">₹{stats.totalDues.toFixed(0)}</p>
      </div>
    </div>

    <div className="bg-gradient-to-br from-pink-500 to-pink-700 p-6 rounded-[40px] text-white shadow-xl flex justify-between items-center active:scale-95 transition-transform" onClick={() => onNavigate(AppTab.Billing)}>
      <div className="z-10">
        <h3 className="text-2xl font-black mb-1">Naya Bill</h3>
        <p className="text-xs opacity-80 uppercase font-bold">Fast Billing Setup</p>
      </div>
      <span className="text-5xl opacity-30">📄</span>
    </div>

    <div className="space-y-4">
      <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest px-1">Bill History (History)</h4>
      <div className="space-y-3">
        {bills.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-xs">Abhi koi record nahi hai.</div>
        ) : (
          bills.slice().reverse().map(bill => (
            <div key={bill.id} onClick={() => onBillSelect(bill)} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-50 shadow-sm active:bg-pink-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-lg">🛍️</div>
                <div>
                  <p className="font-bold text-sm leading-none">{bill.customerName}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Bill #{bill.billNumber} • {bill.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-800 text-sm">₹{bill.totalAmount.toFixed(0)}</p>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{bill.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default HomeView;
