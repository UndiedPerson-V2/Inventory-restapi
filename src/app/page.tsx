'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Package, 
  MapPin, 
  AlertCircle, 
  ChevronRight,
  Minus,
  Plus as PlusIcon,
  Search,
  Box
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  zone: string;
}

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    zone: ''
  });

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/inventory${lowStockOnly ? '?low_stock=true' : ''}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', sku: '', quantity: 0, zone: '' });
        fetchInventory();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Validation Error');
      }
    } catch (err) {
      alert('Network Error');
    }
  };

  const adjustStock = async (id: string, change: number) => {
    try {
      const res = await fetch(`/api/inventory/${id}/adjust`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change })
      });
      if (res.ok) fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInventory();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold tracking-tight text-white drop-shadow-md"
          >
            Inventory
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 mt-2 font-medium"
          >
            Track and manage your stock with precision.
          </motion.p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md transition-all font-medium border",
              lowStockOnly 
                ? "bg-red-500/20 text-red-200 border-red-400/30" 
                : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20"
            )}
          >
            <AlertCircle size={18} />
            Low Stock
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="apple-button flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600">
                  <Box size={24} />
                </div>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-black/50 mb-4 font-mono">{product.sku}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Quantity</span>
                  <span className={cn(
                    "text-2xl font-bold",
                    product.quantity <= 10 ? "text-red-500" : "text-black"
                  )}>
                    {product.quantity}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Zone</span>
                  <span className="text-2xl font-semibold flex items-center gap-1">
                    <MapPin size={16} className="text-black/40" />
                    {product.zone}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-3">
                <button 
                  onClick={() => adjustStock(product.id, -1)}
                  className="flex-1 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors flex justify-center"
                >
                  <Minus size={18} />
                </button>
                <button 
                  onClick={() => adjustStock(product.id, 1)}
                  className="flex-1 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors flex justify-center"
                >
                  <PlusIcon size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {products.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center">
            <Package size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60 font-medium text-lg">No products found.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-8 relative overflow-hidden"
            >
              <h2 className="text-2xl font-bold mb-6">New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black/40 uppercase ml-1">Product Name</label>
                  <input 
                    required
                    className="apple-input w-full"
                    placeholder="MacBook Pro"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-black/40 uppercase ml-1">SKU</label>
                    <input 
                      required
                      className="apple-input w-full font-mono"
                      placeholder="MBP-2024"
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-black/40 uppercase ml-1">Zone</label>
                    <input 
                      required
                      className="apple-input w-full"
                      placeholder="A1"
                      value={formData.zone}
                      onChange={e => setFormData({...formData, zone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black/40 uppercase ml-1">Initial Quantity</label>
                  <input 
                    type="number"
                    className="apple-input w-full"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-black/5 font-medium hover:bg-black/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 apple-button"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
