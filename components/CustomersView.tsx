
import React, { useState, useMemo } from 'react';
import { Customer, Bill } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  bills: Bill[];
  onAdd: (c: Customer) => void;
  onSelect: (id: string) => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({ customers, bills, onAdd, onSelect }) => {
  const [cName, setCName] = useState('');
  const [cMob, setCMob] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!cName || !cMob) return;
    if (customers.some(c => c.mobile === cMob)) {
      alert("Ye mobile number pehle se exist karta hai re baba!");
      return;
    }
    onAdd({ id: Date.now().toString(), name: cName, mobile: cMob });
    setCName(''); setCMob('');
  };

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return customers;
    return customers.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.mobile.includes(term)
    );
  }, [customers, searchTerm]);

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Grahak Khata</h2>
      
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <p className="font-bold text-xs text-pink-600 uppercase tracking-widest">Naya Grahak Add Karein</p>
        <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Grahak ka naam" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <input value={cMob} onChange={e => setCMob(e.target.value)} type="tel" placeholder="Mobile Number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <button onClick={handleAdd} className="w-full bg-pink-500 text-white p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all uppercase">Add Grahak +</button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer..."
            className="w-full p-4 pl-12 bg-white rounded-2xl border border-gray-100 shadow-sm outline-none font-medium"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40">🔍</span>
        </div>

        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-400 py-10 bg-white/50 rounded-3xl border border-dashed border-gray-200">
              Koi grahak nahi hai.
            </p>
          ) : (
            filteredCustomers.map(c => {
              const totalDue = bills.filter(b => b.customerId === c.id).reduce((s, b) => s + b.dueAmount, 0);
              return (
                <div 
                  key={c.id} 
                  onClick={() => onSelect(c.id)}
                  className="bg-white p-5 rounded-[32px] flex items-center justify-between border border-gray-50 shadow-sm active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-xl shadow-inner">👤</div>
                    <div>
                      <p className="font-bold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.mobile}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${totalDue > 0 ? 'text-red-500' : 'text-green-500'}`}>₹{totalDue.toFixed(0)}</p>
                    <p className="text-[8px] uppercase font-bold text-gray-400 tracking-widest">Dues</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
