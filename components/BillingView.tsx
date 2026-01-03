
import React, { useState, useMemo } from 'react';
import { Customer, Product, Bill, BillItem, UnitType } from '../types';

interface BillingViewProps {
  customers: Customer[];
  products: Product[];
  onSave: (bill: Bill) => void;
  billCount: number;
  onCancel: () => void;
}

const BillingView: React.FC<BillingViewProps> = ({ customers, products, onSave, billCount, onCancel }) => {
  const [selectedCustId, setSelectedCustId] = useState('');
  const [custSearchTerm, setCustSearchTerm] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [paidAmt, setPaidAmt] = useState<string>('0');
  
  const [manualEntry, setManualEntry] = useState<{ pid: string, val: string, unit: 'base' | 'sub' } | null>(null);

  const filteredCustomers = useMemo(() => {
    const term = custSearchTerm.toLowerCase().trim();
    if (!term) return [];
    return customers.filter(c => c.name.toLowerCase().includes(term) || c.mobile.includes(term));
  }, [customers, custSearchTerm]);

  const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedCustId), [customers, selectedCustId]);

  const filteredProducts = useMemo(() => {
    const term = productSearch.toLowerCase().trim();
    if (!term) return products.slice(0, 10);
    return products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  }, [products, productSearch]);

  const totalBill = useMemo(() => billItems.reduce((s, i) => s + i.calculatedPrice, 0), [billItems]);

  const calculatePrice = (base: number, qty: number, unit: UnitType) => {
    if (unit === 'Piece') return base * qty;
    return base * (qty / 1000); 
  };

  const formatQtyDisplay = (qty: number, unit: UnitType) => {
    if (unit === 'Piece') return `${qty} pc`;
    if (qty >= 1000) return `${qty / 1000} KG`;
    return `${qty} gram`;
  };

  const handleSmartUpdate = (pid: string, direction: 'plus' | 'minus') => {
    setBillItems(prev => prev.map(item => {
      if (item.productId !== pid) return item;

      let newQty = item.quantity;
      if (item.unit === 'Piece') {
        newQty = direction === 'plus' ? newQty + 1 : newQty - 1;
      } else {
        if (direction === 'plus') {
          newQty = newQty + 1000;
        } else {
          // Smart halving rule: 1KG -> 500g -> 250g -> 125g
          if (newQty > 1000) {
            newQty = 1000; 
          } else {
            newQty = Math.floor(newQty / 2);
          }
        }
      }

      if (newQty <= 0) return null as any;

      return {
        ...item,
        quantity: newQty,
        calculatedPrice: calculatePrice(item.basePrice, newQty, item.unit)
      };
    }).filter(Boolean));
  };

  const handleAddProduct = (p: Product) => {
    const existing = billItems.find(i => i.productId === p.id);
    if (existing) {
      handleSmartUpdate(p.id, 'plus');
    } else {
      const initialQty = p.unit === 'Piece' ? 1 : 1000; 
      setBillItems(prev => [...prev, {
        productId: p.id,
        name: p.name,
        basePrice: p.price,
        unit: p.unit,
        quantity: initialQty,
        calculatedPrice: calculatePrice(p.price, initialQty, p.unit)
      }]);
    }
    setProductSearch('');
  };

  const handleManualSave = () => {
    if (!manualEntry) return;
    const val = parseFloat(manualEntry.val);
    if (isNaN(val) || val <= 0) {
      setManualEntry(null);
      return;
    }

    setBillItems(prev => prev.map(item => {
      if (item.productId !== manualEntry.pid) return item;
      let qty = val;
      if (item.unit !== 'Piece' && manualEntry.unit === 'base') qty = val * 1000;
      return {
        ...item,
        quantity: qty,
        calculatedPrice: calculatePrice(item.basePrice, qty, item.unit)
      };
    }));
    setManualEntry(null);
  };

  const handleSafeExit = () => {
    if (billItems.length > 0) {
      if (confirm("Bill ban raha hai, kya aap wapas jana chahte ho?")) onCancel();
    } else {
      onCancel();
    }
  };

  const handleSaveBill = () => {
    if (!selectedCustomer) return alert("Pehle Grahak chuno re baba!");
    if (billItems.length === 0) return alert("Bill mein kuch toh daalo!");
    
    const paid = Number(paidAmt) || 0;
    const due = totalBill - paid;

    const newBill: Bill = {
      id: Date.now().toString(),
      billNumber: (billCount + 101).toString(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerMobile: selectedCustomer.mobile,
      items: billItems,
      totalAmount: totalBill,
      paidAmount: paid,
      dueAmount: Math.max(0, due),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: due <= 0 ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid')
    };
    onSave(newBill);
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdf2f2] pb-24 overflow-hidden">
      <div className="p-4 bg-white border-b border-pink-100 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={handleSafeExit} className="p-2 text-gray-400">←</button>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Billing</h2>
        </div>
        <div className="text-[10px] font-black bg-pink-100 text-pink-600 px-3 py-1 rounded-full uppercase">Shop Mode</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Step 1: Customer Selection */}
        <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">1. Grahak Search (Customer)</label>
          {!selectedCustomer ? (
            <div className="space-y-2">
              <input 
                value={custSearchTerm}
                onChange={e => setCustSearchTerm(e.target.value)}
                placeholder="Naam ya mobile..."
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-pink-300 text-sm font-bold"
              />
              {custSearchTerm && filteredCustomers.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-2 space-y-1 max-h-40 overflow-y-auto shadow-inner">
                  {filteredCustomers.map(c => (
                    <div key={c.id} onClick={() => { setSelectedCustId(c.id); setCustSearchTerm(''); }} className="p-3 bg-white rounded-xl border border-gray-100 text-sm font-bold active:bg-pink-50 flex justify-between items-center shadow-sm">
                      <span>{c.name}</span>
                      <span className="text-xs text-gray-400 font-normal">{c.mobile}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center p-4 bg-pink-50 rounded-2xl border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">👤</div>
                <div>
                  <p className="font-bold text-sm leading-none">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{selectedCustomer.mobile}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustId('')} className="text-[10px] font-bold text-pink-600 bg-white px-4 py-2 rounded-full shadow-sm">Change</button>
            </div>
          )}
        </section>

        {/* Step 2: Product Search */}
        <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase block">2. Saman Search (Products)</label>
          <div className="relative">
            <input 
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-pink-300 text-sm font-bold shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {filteredProducts.map(p => (
              <div key={p.id} onClick={() => handleAddProduct(p)} className="p-3 bg-white rounded-2xl border border-gray-100 flex justify-between items-center active:scale-95 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-lg">📦</div>
                  )}
                  <div>
                    <p className="font-bold text-sm leading-tight">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">₹{p.price} / {p.unit}</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">+</div>
              </div>
            ))}
          </div>
        </section>

        {/* Items List */}
        {billItems.map(item => (
          <div key={item.productId} className="bg-white p-4 rounded-3xl border-2 border-pink-50 shadow-md flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-black text-lg leading-tight text-gray-800">{item.name}</p>
                <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Rate: ₹{item.basePrice} / {item.unit}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-pink-600 text-2xl leading-none">₹{item.calculatedPrice.toFixed(1)}</p>
                <p className="text-[9px] text-gray-400 font-black uppercase mt-1">Subtotal</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-3">
              <div className="flex items-center gap-3">
                <button onClick={() => handleSmartUpdate(item.productId, 'minus')} className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-2xl text-gray-600 active:bg-pink-100">−</button>
                <div 
                  onClick={() => setManualEntry({ 
                    pid: item.productId, 
                    val: item.unit === 'Piece' ? item.quantity.toString() : (item.quantity >= 1000 ? (item.quantity/1000).toString() : item.quantity.toString()), 
                    unit: (item.unit !== 'Piece' && item.quantity >= 1000) ? 'base' : (item.unit !== 'Piece' ? 'sub' : 'base')
                  })}
                  className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 flex flex-col items-center justify-center min-w-[120px]"
                >
                  <span className="font-black text-sm text-gray-800">{formatQtyDisplay(item.quantity, item.unit)}</span>
                  <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest">Edit Qty</span>
                </div>
                <button onClick={() => handleSmartUpdate(item.productId, 'plus')} className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white active:scale-110 shadow-lg">+</button>
              </div>
              <button onClick={() => setBillItems(prev => prev.filter(i => i.productId !== item.productId))} className="text-gray-300 p-2">✕</button>
            </div>
          </div>
        ))}

        {/* Payment and Save */}
        <section className="bg-white p-6 rounded-[40px] border-4 border-pink-50 shadow-2xl space-y-5 sticky bottom-0 z-10">
          <div className="flex justify-between items-center">
            <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Grand Total</span>
            <span className="font-black text-gray-800 text-4xl">₹{totalBill.toFixed(1)}</span>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid Amount (₹)</label>
            <input 
              type="number" 
              value={paidAmt} 
              onChange={e => setPaidAmt(e.target.value)} 
              className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-black text-2xl text-pink-600 border border-gray-100"
              placeholder="0"
            />
          </div>
          
          <button 
            onClick={handleSaveBill} 
            className="w-full bg-pink-600 text-white p-6 rounded-[30px] font-black text-xl shadow-xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
          >
            BILL SAVE ✓
          </button>
        </section>
      </div>

      {manualEntry && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-8 animate-fade-in backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[45px] p-8 space-y-6 shadow-2xl">
            <h3 className="font-black text-gray-800 text-center">Set Quantity</h3>
            <div className="space-y-3">
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button 
                  onClick={() => setManualEntry({ ...manualEntry, unit: 'base' })}
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${manualEntry.unit === 'base' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
                >
                  {billItems.find(i => i.productId === manualEntry.pid)?.unit === 'Piece' ? 'Piece' : 'KG/L'}
                </button>
                {billItems.find(i => i.productId === manualEntry.pid)?.unit !== 'Piece' && (
                  <button 
                    onClick={() => setManualEntry({ ...manualEntry, unit: 'sub' })}
                    className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${manualEntry.unit === 'sub' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
                  >
                    Gram/ML
                  </button>
                )}
              </div>
              <input 
                autoFocus
                type="number" 
                step="any"
                value={manualEntry.val} 
                onChange={e => setManualEntry({ ...manualEntry, val: e.target.value })}
                className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-pink-100 outline-none font-black text-3xl text-center"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setManualEntry(null)} className="flex-1 p-5 bg-gray-100 rounded-3xl font-black text-gray-500 uppercase text-xs">Cancel</button>
              <button onClick={handleManualSave} className="flex-1 p-5 bg-pink-600 rounded-3xl font-black text-white uppercase text-xs shadow-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingView;
