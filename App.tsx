
import React, { useState, useEffect, useMemo } from 'react';
import { AppTab, Customer, Product, Bill } from './types';
import TabNavigation from './components/TabNavigation';
import BabuRaoAssistant from './components/BabuRaoAssistant';
import BillingView from './components/BillingView';
import InventoryView from './components/InventoryView';
import CustomersView from './components/CustomersView';
import HomeView from './components/HomeView';
import CustomerDetail from './components/CustomerDetail';
import BillDetailView from './components/BillDetailView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Home);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  const [pin, setPin] = useState<string | null>(() => localStorage.getItem('ks_pin'));

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ks_customers');
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ks_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('ks_bills');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('ks_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('ks_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('ks_bills', JSON.stringify(bills)); }, [bills]);

  const stats = useMemo(() => {
    const totalSales = bills.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalDues = bills.reduce((sum, b) => sum + b.dueAmount, 0);
    return { totalSales, totalDues };
  }, [bills]);

  const handleAddBill = (newBill: Bill) => {
    setBills(prev => [...prev, newBill]);
    setViewingBill(newBill);
    setActiveTab(AppTab.Home);
  };

  const handleDeleteBill = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
    setViewingBill(null);
  };

  const handleAddProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const handleUpdateProduct = (p: Product) => setProducts(prev => prev.map(old => old.id === p.id ? p : old));
  const handleAddCustomer = (c: Customer) => setCustomers(prev => [...prev, c]);

  const handleSetPin = (newPin: string) => {
    setPin(newPin);
    localStorage.setItem('ks_pin', newPin);
  };

  return (
    <div className="max-w-md mx-auto bg-[#fdf2f2] min-h-screen relative overflow-x-hidden pb-20 no-print">
      <main className="h-full">
        {viewingBill ? (
          <BillDetailView 
            bill={viewingBill} 
            onBack={() => setViewingBill(null)} 
            onDelete={handleDeleteBill}
            pin={pin}
          />
        ) : selectedCustomerId ? (
          <CustomerDetail 
            customer={customers.find(c => c.id === selectedCustomerId)!}
            bills={bills.filter(b => b.customerId === selectedCustomerId)}
            onBack={() => setSelectedCustomerId(null)}
            onBillSelect={setViewingBill}
          />
        ) : (
          <>
            {activeTab === AppTab.Home && (
              <HomeView stats={stats} bills={bills} onNavigate={setActiveTab} onBillSelect={setViewingBill} />
            )}
            {activeTab === AppTab.Billing && (
              <BillingView 
                customers={customers} 
                products={products} 
                onSave={handleAddBill} 
                billCount={bills.length}
                onCancel={() => setActiveTab(AppTab.Home)}
              />
            )}
            {activeTab === AppTab.Inventory && (
              <InventoryView products={products} onAdd={handleAddProduct} onUpdate={handleUpdateProduct} />
            )}
            {activeTab === AppTab.Customers && (
              <CustomersView 
                customers={customers} 
                bills={bills} 
                onAdd={handleAddCustomer} 
                onSelect={setSelectedCustomerId}
              />
            )}
            {activeTab === AppTab.BabuRao && (
              <div className="h-[calc(100vh-72px)]">
                <BabuRaoAssistant customers={customers} products={products} bills={bills} />
              </div>
            )}
            {activeTab === AppTab.Settings && (
              <SettingsView 
                pin={pin} 
                onSetPin={handleSetPin} 
                onClearData={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              />
            )}
          </>
        )}
      </main>

      {!selectedCustomerId && !viewingBill && (
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
};

export default App;
