import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Category, VehicleCategoryType, Brand } from '../../types';
import { FolderTree, Plus, Trash2, Edit3, Save, X, Check, UploadCloud } from 'lucide-react';
import * as Icons from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, saveCategoryItem, deleteCategoryItem } = useMarketplace();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState('Dump Truck');
  const [description, setDescription] = useState('');
  const [subcategoriesText, setSubcategoriesText] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80');

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setIcon(cat.icon || 'Truck');
    setDescription(cat.description || '');
    setSubcategoriesText(cat.subcategories ? cat.subcategories.join(', ') : '');
    setImage(cat.image || '');
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setName('');
    setIcon('Truck');
    setDescription('');
    setSubcategoriesText('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      const existing = categories.find(c => c.id === editId);
      if (existing) {
        saveCategoryItem({
          ...existing,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          icon,
          description,
          subcategories: subcategoriesText.split(',').map(s => s.trim()),
          image,
        });
      }
    } else {
      const newCat: Category = {
        id: 'cat-' + Date.now(),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        icon,
        image,
        description,
        subcategories: subcategoriesText.split(',').map(s => s.trim()).filter(Boolean),
        listingCount: 0,
        active: true,
        sortOrder: categories.length + 1,
      };
      saveCategoryItem(newCat);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Taxonomy</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Categories & Subcategories</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage body types and classification hierarchy</p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp = (Icons as any)[cat.icon] || Icons.Truck;
          return (
            <div key={cat.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900">{cat.name}s</span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {cat.listingCount.toLocaleString()} listings
                </span>
              </div>

              <p className="text-xs text-slate-500">{cat.description}</p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Subcategories:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, idx) => (
                    <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove category "${cat.name}"?`)) {
                      deleteCategoryItem(cat.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900">Add Vehicle Category</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Minivan"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  required
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. Dump Truck, Truck, Bus, Shield"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
                <p className="text-[10px] text-slate-400 mt-1">Must be a valid lucide-react icon component name (e.g. Zap, Star)</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Hatchbacks, Compacts and Sedans"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcategories (comma separated)</label>
                <input
                  type="text"
                  value={subcategoriesText}
                  onChange={(e) => setSubcategoriesText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  {editId ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminBrandsPage: React.FC = () => {
  const { brands, saveBrandItem, deleteBrandItem } = useMarketplace();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandDesc, setBrandDesc] = useState('');

  const openAddModal = () => {
    setEditingBrand(null);
    setBrandName('');
    setBrandLogo('');
    setBrandDesc('');
    setModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setBrandLogo(brand.logo);
    setBrandDesc(brand.description);
    setModalOpen(true);
  };

  const handleReset = () => {
    if (editingBrand) {
      setBrandName(editingBrand.name);
      setBrandLogo(editingBrand.logo);
      setBrandDesc(editingBrand.description);
    } else {
      setBrandName('');
      setBrandLogo('');
      setBrandDesc('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    saveBrandItem({
      id: editingBrand ? editingBrand.id : 'brand-' + Date.now(),
      name: brandName,
      slug: editingBrand ? editingBrand.slug : brandName.toLowerCase().replace(/\s+/g, '-'),
      logo: brandLogo || `https://logo.clearbit.com/${brandName.toLowerCase().replace(/\s+/g, '')}.com`,
      category: editingBrand ? editingBrand.category : ['Dump Truck', 'Flatbed Truck'],
      description: brandDesc || 'No description provided.',
      listingCount: editingBrand ? editingBrand.listingCount : 0,
      active: editingBrand ? editingBrand.active : true,
    });
    setModalOpen(false);
    setEditingBrand(null);
    setBrandName('');
    setBrandDesc('');
    setBrandLogo('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Automaker Catalog</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Brand Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage certified manufacturers and logos</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((b) => (
          <div key={b.id} className="relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between group">
            <button
              onClick={() => openEditModal(b)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <div className="space-y-3 text-center">
              <div className="h-16 flex items-center justify-center p-2 bg-slate-50 rounded-2xl">
                <BrandLogo src={b.logo} name={b.name} className="h-10 w-10 max-h-10 max-w-[120px] object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{b.name}</h3>
                <span className="text-[11px] text-blue-600 font-semibold block">{b.listingCount} listings</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{b.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  if (confirm(`Delete brand "${b.name}"?`)) {
                    deleteBrandItem(b.id);
                  }
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900">{editingBrand ? 'Edit Automaker Brand' : 'Add Automaker Brand'}</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveBrand} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. BMW / Audi / Tata"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Logo *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-500 transition-colors bg-slate-50 cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    {brandLogo ? (
                      <div className="relative inline-block">
                        <img src={brandLogo} alt="Preview" className="h-20 w-auto object-contain rounded-lg shadow-sm" />
                        <button type="button" onClick={() => setBrandLogo('')} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 justify-center">
                          <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 2MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={brandDesc}
                  onChange={(e) => setBrandDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={handleReset} className="px-4 py-2 rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50 mr-auto">Reset</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
