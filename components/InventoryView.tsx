
import React, { useState, useRef } from 'react';
import { Product, UnitType } from '../types';

interface InventoryViewProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, onAdd, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pName, setPName] = useState('');
  const [pCat, setPCat] = useState('Grocery');
  const [pPrice, setPPrice] = useState('');
  const [pUnit, setPUnit] = useState<UnitType>('Piece');
  const [pImage, setPImage] = useState<string | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setPName('');
    setPPrice('');
    setPUnit('Piece');
    setPCat('Grocery');
    setPImage(undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdate = () => {
    if (!pName || !pPrice) return;
    const prod: Product = {
      id: editingId || Date.now().toString(),
      name: pName,
      category: pCat,
      price: Number(pPrice),
      unit: pUnit,
      quantity: 0,
      dateAdded: new Date().toLocaleDateString(),
      image: pImage
    };

    if (editingId) {
      onUpdate(prod);
    } else {
      onAdd(prod);
    }
    resetForm();
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setPName(p.name);
    setPPrice(p.price.toString());
    setPUnit(p.unit);
    setPCat(p.category);
    setPImage(p.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-5 space-y-6">
      <h2 className="text-2xl font-black text-gray-800">Stock Management</h2>
      
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <p className="font-bold text-xs text-yellow-600 uppercase tracking-widest">{editingId ? 'Update Saman' : 'Naya Saman Add Karein'}</p>
        
        <div className="flex gap-4 items-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden active:scale-95 transition-all"
          >
            {pImage ? (
              <img src={pImage} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">📸</span>
            )}
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
          <div className="flex-1 space-y-2">
            <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Saman ka naam" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="Rate (₹)" className="p-4 bg-gray-50 rounded-2xl outline-none" />
          <select value={pUnit} onChange={e => setPUnit(e.target.value as UnitType)} className="p-4 bg-gray-50 rounded-2xl outline-none font-bold">
            <option value="Piece">Piece</option>
            <option value="KG">KG</option>
            <option value="L">Liter</option>
          </select>
        </div>
        <select value={pCat} onChange={e => setPCat(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold">
          <option>Grocery</option><option>Snacks</option><option>Drinks</option><option>Daily Use</option>
        </select>
        <div className="flex gap-2">
          {editingId && <button onClick={resetForm} className="flex-1 bg-gray-100 p-4 rounded-2xl font-bold uppercase text-xs">Cancel</button>}
          <button onClick={handleAddOrUpdate} className="flex-[2] bg-yellow-400 text-white p-4 rounded-2xl font-black shadow-lg uppercase">{editingId ? 'Update ✓' : 'Add Item +'}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map(p => (
          <div key={p.id} onClick={() => startEdit(p)} className="bg-white p-4 rounded-3xl border border-gray-50 shadow-sm active:bg-yellow-50 transition-colors">
            {p.image ? (
              <img src={p.image} className="w-full h-24 object-cover rounded-2xl mb-2" />
            ) : (
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-lg mb-2">📦</div>
            )}
            <p className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate">{p.name}</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase">₹{p.price}/{p.unit}</span>
              <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">{p.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryView;
