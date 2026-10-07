import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  VehicleCategoryType, 
  FuelType, 
  TransmissionType, 
  OwnershipType, 
  ConditionType,
  Vehicle 
} from '../../types';
import * as Icons from 'lucide-react';

interface AddVehiclePageProps {
  editVehicleId?: string | null;
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
];

export const AddVehiclePage: React.FC<AddVehiclePageProps> = ({ 
  editVehicleId, 
  onNavigate,
  onSelectVehicle 
}) => {
  const { user } = useAuth();
  const { brands, categories, locations, addVehicle, updateVehicle, getVehicleById } = useMarketplace();
  const { showToast } = useNotification();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [category, setCategory] = useState<VehicleCategoryType>('Car');
  const [brandName, setBrandName] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState<number>(2021);
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>('Manual');
  const [kmDriven, setKmDriven] = useState<number>(35000);
  const [color, setColor] = useState('Pearl Arctic White');
  const [engine, setEngine] = useState('1197 cc 4-Cylinder');
  const [ownership, setOwnership] = useState<OwnershipType>('First Owner');
  const [registrationNumber, setRegistrationNumber] = useState('WB 02 AK 9876');
  const [insurance, setInsurance] = useState('Comprehensive Valid till 2027');
  const [condition, setCondition] = useState<ConditionType>('Excellent');
  const [price, setPrice] = useState<number>(550000);
  const [negotiable, setNegotiable] = useState(true);
  const [description, setDescription] = useState(
    'Single owner driven vehicle in mint condition. Complete regular service history with authorized service center. Spotless interior, brand new tyres, touchscreen infotainment with Apple CarPlay and reverse parking camera.'
  );
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('West Bengal');
  const [city, setCity] = useState('Kolkata');
  const [area, setArea] = useState('Salt Lake Sector V');
  const [pincode, setPincode] = useState('700091');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [sellerName, setSellerName] = useState(user?.name || 'Rohit Sharma');
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '+91 98765 43210');
  const [sellerEmail, setSellerEmail] = useState(user?.email || 'rohit.seller@satyadeal.com');

  // Pre-fill if editing
  useEffect(() => {
    if (editVehicleId) {
      const existing = getVehicleById(editVehicleId);
      if (existing) {
        setCategory(existing.category);
        setBrandName(existing.brandName);
        setModel(existing.model);
        setVariant(existing.variant);
        setYear(existing.year);
        setFuelType(existing.fuelType);
        setTransmission(existing.transmission);
        setKmDriven(existing.kmDriven);
        setColor(existing.color);
        setEngine(existing.engine);
        setOwnership(existing.ownership);
        setRegistrationNumber(existing.registrationNumber);
        setInsurance(existing.insurance);
        setCondition(existing.condition);
        setPrice(existing.price);
        setNegotiable(existing.negotiable);
        setDescription(existing.description);
        setCountry(existing.location.country);
        setState(existing.location.state);
        setCity(existing.location.city);
        setArea(existing.location.area);
        setPincode(existing.location.pincode);
        setImages(existing.images);
        setSellerName(existing.sellerInfo.name);
        setSellerPhone(existing.sellerInfo.phone);
        setSellerEmail(existing.sellerInfo.email);
      }
    }
  }, [editVehicleId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const brandObj = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase()) || brands[0];
      const catObj = categories.find(c => c.name === category) || categories[0];

      const vehicleTitle = `${brandName} ${model || 'Vehicle'} ${variant}`.trim();

      const payload = {
        sellerId: user?.id || 'seller-rohit',
        title: vehicleTitle,
        category,
        categoryId: catObj.id,
        categoryName: catObj.name,
        brandId: brandObj.id,
        brandName: brandObj.name,
        brandLogo: brandObj.logo,
        model: model || 'Standard',
        variant: variant || 'Base',
        year,
        price,
        negotiable,
        fuelType,
        transmission,
        kmDriven,
        color,
        engine,
        ownership,
        registrationNumber,
        registrationState: state,
        insurance,
        condition,
        description,
        images: images.length > 0 ? images : [SAMPLE_PHOTO_PRESETS[0]],
        featuredImage: images[0] || SAMPLE_PHOTO_PRESETS[0],
        location: {
          country,
          state,
          city,
          area,
          pincode,
        },
        sellerInfo: {
          id: user?.id || 'seller-rohit',
          name: sellerName,
          phone: sellerPhone,
          email: sellerEmail,
          avatar: user?.avatar,
          sellerType: 'Direct Owner' as const,
          isVerified: true,
          memberSince: '2024',
          responseRate: '100% within 1 hour',
        },
        featured: false,
      };

      if (editVehicleId) {
        await updateVehicle(editVehicleId, payload);
        onNavigate('/dashboard/listings');
      } else {
        const newId = await addVehicle(payload);
        onNavigate('/dashboard/listings');
      }
    } catch (err) {
      showToast('error', 'Submission Failed', 'Please verify your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    'Category',
    'Basic Info',
    'Pricing',
    'Details & Specs',
    'Location',
    'Photos',
    'Seller Info',
    'Review & Submit',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {editVehicleId ? 'Update Listing' : 'Classified Wizard'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          {editVehicleId ? 'Edit Vehicle Listing' : 'Post a Vehicle for Sale'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Fill in your vehicle specifications. All listings undergo prompt Super Admin review before being indexed publicly.
        </p>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 pb-2 scrollbar-none">
          {stepsList.map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <button
                key={label}
                onClick={() => setStep(stepNum)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <span>{stepNum}.</span>
                <span>{label}</span>
                {isDone && <Icons.Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Choose Vehicle Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select the category that best matches your automobile</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((catObj) => {
                const IconComp = (Icons as any)[catObj.icon] || Icons.Car;
                return (
                  <button
                    key={catObj.id}
                    type="button"
                    onClick={() => setCategory(catObj.name)}
                    className={`p-6 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-3 ${
                      category === catObj.name
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20 shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category === catObj.name ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm">{catObj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFO */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Basic Vehicle Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">Specify brand, model name, year of manufacturing, and fuel type</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Make *</label>
                <select
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Swift / Creta / Classic 350"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Variant</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. VXI DualJet / SX(O) / Dark"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Manufacturing Year *</label>
                <input
                  type="number"
                  min={1990}
                  max={2026}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Type *</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  {(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'] as FuelType[]).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transmission *</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">KM Driven *</label>
                <input
                  type="number"
                  required
                  value={kmDriven}
                  onChange={(e) => setKmDriven(Number(e.target.value))}
                  placeholder="e.g. 45000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exterior Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Pearl Arctic White"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Pricing & Negotiation</h2>
              <p className="text-xs text-slate-500 mt-0.5">Set a competitive price in Indian Rupees (₹)</p>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-bold text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
                <span className="text-xs text-slate-400 block mt-1">
                  Formatted: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Is this price negotiable?</h4>
                  <p className="text-[11px] text-slate-400">Buyers appreciate open negotiation room</p>
                </div>
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SPECS & DETAILS */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: Vehicle Details & History</h2>
              <p className="text-xs text-slate-500 mt-0.5">Documentation, ownership history, and condition summary</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ownership *</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as OwnershipType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="First Owner">First Owner</option>
                  <option value="Second Owner">Second Owner</option>
                  <option value="Third Owner">Third Owner</option>
                  <option value="4+ Owners">4+ Owners</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. WB 02 AK 4421"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Validity</label>
                <input
                  type="text"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  placeholder="e.g. Comprehensive Valid till Dec 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Condition Rating *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ConditionType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Engine Details</label>
                <input
                  type="text"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  placeholder="e.g. 1197 cc DualJet 4-Cylinder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe vehicle health, service history, add-on accessories, and any notable features..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: LOCATION */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Vehicle Location</h2>
              <p className="text-xs text-slate-500 mt-0.5">Where can buyers inspect the vehicle?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. West Bengal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kolkata"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area / Neighborhood *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Salt Lake Sector V"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 700091"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PHOTOS */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 6: Vehicle Photos</h2>
              <p className="text-xs text-slate-500 mt-0.5">High quality daylight photos improve buyer response rate by 4x</p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center hover:bg-blue-50/50 transition relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Icons.Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Click to upload photos or drag and drop</span>
                <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 10MB each</span>
              </div>
            </div>

            {/* Quick Sample Photos Selector */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Or add from curated photo presets:</span>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetPhoto(preset)}
                    className="shrink-0 w-20 h-16 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 relative group"
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-blue-600/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[10px] font-bold">
                      + Add
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Images Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Uploaded Photos ({images.length})</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] group">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Main Photo
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                        title="Remove Photo"
                      >
                        <Icons.Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: SELLER INFO */}
        {step === 7 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 7: Seller Contact Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">This information will be provided to verified interested buyers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seller Full Name *</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: PREVIEW & SUBMIT */}
        {step === 8 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 8: Complete Listing Preview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review your submission before submitting for Super Admin review</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                Will be Submitted as: Pending Approval
              </span>
            </div>

            {/* Listing Summary Preview Card */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={images[0] || SAMPLE_PHOTO_PRESETS[0]}
                  alt="Vehicle Preview"
                  className="w-full sm:w-44 h-32 object-cover rounded-2xl bg-slate-200 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                      {category}
                    </span>
                    <span className="text-xs text-slate-400">• {year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {brandName} {model || 'Vehicle'} {variant}
                  </h3>
                  <span className="text-xl font-extrabold text-blue-600 block">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)}
                    {negotiable && <span className="text-xs text-slate-400 font-normal ml-2">(Negotiable)</span>}
                  </span>
                  <p className="text-xs text-slate-500">
                    Location: {area}, {city}, {state} ({pincode})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-3 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Fuel</span>
                  <span className="font-bold text-slate-700">{fuelType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Transmission</span>
                  <span className="font-bold text-slate-700">{transmission}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Driven</span>
                  <span className="font-bold text-slate-700">{kmDriven.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ownership</span>
                  <span className="font-bold text-slate-700">{ownership}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
              <Icons.ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Mandatory Super Admin Review System</span>
                <p className="text-blue-700 mt-0.5">
                  To keep SatyaDeal 100% safe, our administrative team reviews all listings before public publishing. You will receive an immediate notification once approved!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Icons.ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 8 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <span>Continue to Step {step + 1}</span>
              <Icons.ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-extrabold shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Icons.Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit for Admin Approval'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
