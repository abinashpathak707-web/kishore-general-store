
import React from 'react';
import { Customer, Bill } from '../types';

interface CustomerDetailProps {
  customer: Customer;
  bills: Bill[];
  onBack: () => void;
  onBillSelect: (bill: Bill) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, bills, onBack, onBillSelect }) => {
  const totalSale = bills.reduce((s, b) => s + b.totalAmount, 0);
  const totalPaid = bills.reduce((s, b) => s + b.paidAmount, 0);
  const totalDue = bills.reduce((s, b) => s + b.dueAmount, 0);

  const handleKhataShare = () => {
    let msg = `*Kishore General Store - Customer Khata Statement*\n`;
    msg += `Grahak: ${customer.name}\n`;
    msg += `Mobile: ${customer.mobile}\n`;
    msg += `--------------------------\n`;
    msg += `Total Kharidari: ₹${totalSale.toFixed(1)}\n`;
    msg += `Total Paid: ₹${totalPaid.toFixed(1)}\n`;
    msg += `*TOTAL DUES: ₹${totalDue.toFixed(1)}*\n`;
    msg += `--------------------------\n`;
    msg += `Namaste, ye aapka complete khata detail hai.`;
    window.open(`https://wa.me/${customer.mobile}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrintKhata = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="p-4 flex items-center gap-4 border-b border-gray-100 sticky top-0 bg-white z-20 no-print">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">←</button>
        <div className="flex-1">
          <h2 className="font-black text-gray-800 leading-none">{customer.name}</h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">View Full Khata</p>
        </div>
        <button onClick={handlePrintKhata} className="text-xl">🖨️</button>
      </header>

      <div id="printable-area" className="p-5 space-y-6">
        <div className="bg-gradient-to-br from-pink-500 to-pink-700 p-6 rounded-[40px] text-white shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[10px] opacity-70 uppercase font-bold">Total Sales</p><p className="text-2xl font-black">₹{totalSale.toFixed(1)}</p></div>
            <div><p className="text-[10px] opacity-70 uppercase font-bold">Total Paid</p><p className="text-2xl font-black">₹{totalPaid.toFixed(1)}</p></div>
            <div className="col-span-2 pt-2 border-t border-white/20"><p className="text-[10px] opacity-70 uppercase font-bold">Total Due (Udhaar)</p><p className="text-4xl font-black">₹{totalDue.toFixed(1)}</p></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Transaction History</h3>
            <button onClick={handleKhataShare} className="text-[10px] font-black text-green-600 border border-green-100 px-3 py-1 rounded-full uppercase no-print">Share Khata 💬</button>
          </div>
          
          <div className="space-y-3">
            {bills.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">Abhi tak koi kharidari nahi hui.</p>
            ) : (
              bills.slice().reverse().map(bill => (
                <div key={bill.id} onClick={() => onBillSelect(bill)} className="p-4 rounded-[32px] border border-gray-100 bg-gray-50 flex justify-between items-center active:bg-pink-50 cursor-pointer">
                  <div>
                    <p className="font-bold text-sm">Bill #{bill.billNumber}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{bill.date} • {bill.time}</p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {bill.items.slice(0, 3).map((it, idx) => (
                        <span key={idx} className="bg-white text-[8px] px-2 py-0.5 rounded-full border border-gray-100 font-bold">{it.name}</span>
                      ))}
                      {bill.items.length > 3 && <span className="text-[8px] font-bold">+{bill.items.length - 3}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-800">₹{bill.totalAmount.toFixed(0)}</p>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 no-print">
        <button onClick={onBack} className="w-full bg-gray-800 text-white p-5 rounded-3xl font-black shadow-xl uppercase tracking-widest">Back to List</button>
      </div>
    </div>
  );
};

export default CustomerDetail;
