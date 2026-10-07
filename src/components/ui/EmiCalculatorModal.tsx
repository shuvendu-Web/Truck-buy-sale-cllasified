import React, { useState, useMemo } from 'react';
import { Vehicle, EmiBank } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  X, 
  Calculator, 
  Send, 
  ShieldCheck, 
  Percent, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface EmiCalculatorModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { settings, submitEmiInquiry } = useMarketplace();

  const banks = settings?.emiBanks || [];
  const defaultBank = banks[0] || {
    id: 'default',
    bankName: 'Standard Auto Loan',
    annualInterestRate: 8.5,
    minDownPaymentPercent: 15,
    tenureMonths: [12, 24, 36, 48, 60, 84],
    processingFee: '0.5% (Min ₹1,500)',
  };

  const [selectedBankId, setSelectedBankId] = useState<string>(defaultBank.id);
  const selectedBank = banks.find(b => b.id === selectedBankId) || defaultBank;

  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [customDownPayment, setCustomDownPayment] = useState<number>(
    Math.round((vehicle.price * 20) / 100)
  );

  // Form inputs
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerCity, setBuyerCity] = useState(user?.city || vehicle.location.city || 'Kolkata');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // EMI Calculations
  const loanAmount = Math.max(0, vehicle.price - customDownPayment);
  const annualRate = selectedBank.annualInterestRate || 8.5;
  const monthlyRate = annualRate / 12 / 100;

  const monthlyEmi = useMemo(() => {
    if (loanAmount <= 0) return 0;
    if (monthlyRate === 0) return Math.round(loanAmount / tenureMonths);
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
  }, [loanAmount, monthlyRate, tenureMonths]);

  const totalPayable = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  const handlePercentChange = (pct: number) => {
    setDownPaymentPercent(pct);
    setCustomDownPayment(Math.round((vehicle.price * pct) / 100));
  };

  const handleCustomDownPaymentChange = (val: number) => {
    const clamped = Math.min(vehicle.price, Math.max(0, val));
    setCustomDownPayment(clamped);
    setDownPaymentPercent(Math.round((clamped / vehicle.price) * 100));
  };

  const handleSubmitEmi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) return;

    setSubmitting(true);
    try {
      await submitEmiInquiry({
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        vehicleImage: vehicle.featuredImage || vehicle.images[0],
        vehiclePrice: vehicle.price,
        buyerName,
        buyerPhone,
        buyerEmail: user?.email || '',
        buyerCity,
        bankName: selectedBank.bankName,
        loanAmount,
        downPayment: customDownPayment,
        tenureMonths,
        monthlyEmi,
        interestRate: annualRate,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Green Finance Branding */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                  SatyaDeal Finance Desk
                </span>
                <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  {annualRate}% p.a.
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Vehicle EMI Loan Calculator
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle Preview Bar */}
        <div className="px-4 py-2.5 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={vehicle.featuredImage || vehicle.images[0]}
              alt={vehicle.title}
              className="w-10 h-8 object-cover rounded-lg border border-emerald-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-xs truncate max-w-[220px]">{vehicle.title}</h4>
              <span className="text-[10px] text-slate-500">Vehicle On-Road / Asking Price</span>
            </div>
          </div>
          <span className="font-black text-slate-900 text-sm shrink-0">
            ₹{vehicle.price.toLocaleString('en-IN')}
          </span>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">EMI Loan Request Submitted!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                Your loan calculation of <strong className="text-emerald-700">₹{monthlyEmi.toLocaleString('en-IN')}/mo</strong> via <strong>{selectedBank.bankName}</strong> has been sent to our Super Admin Finance Desk.
              </p>
            </div>

            {/* Application Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between text-slate-600">
                <span>Applicant:</span>
                <span className="font-bold text-slate-900">{buyerName} ({buyerPhone})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Loan Amount:</span>
                <span className="font-bold text-blue-600">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tenure:</span>
                <span className="font-bold text-slate-900">{tenureMonths} Months ({Math.round(tenureMonths/12)} Yrs)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Bank:</span>
                <span className="font-bold text-emerald-700">{selectedBank.bankName}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Our auto loan specialist will call <span className="font-semibold text-slate-700">{buyerPhone}</span> within 2 hours for instant digital sanction.
            </p>

            <button
              onClick={onClose}
              className="w-full sm:w-60 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition mx-auto cursor-pointer"
            >
              Close & Continue Browsing
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* 1. SELECT FINANCING BANK */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Choose Financing Partner Bank</span>
                </label>
                <span className="text-[10px] text-slate-400">Managed by Admin</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {banks.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBankId(b.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedBankId === b.id
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-slate-900 truncate max-w-[110px]">{b.bankName}</span>
                      {b.isPopular && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">Top</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between text-[11px]">
                      <span className="text-emerald-700 font-extrabold">{b.annualInterestRate}% p.a.</span>
                      <span className="text-[10px] text-slate-400">{b.processingFee.split(' ')[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. DOWN PAYMENT & TENURE SLIDERS */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3 text-xs">
              
              {/* Down payment control */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-700">Down Payment ({downPaymentPercent}%)</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span>₹</span>
                    <input
                      type="number"
                      value={customDownPayment}
                      onChange={(e) => handleCustomDownPaymentChange(Number(e.target.value))}
                      className="w-24 px-2 py-0.5 rounded-lg border border-slate-300 bg-white text-right text-xs font-bold text-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={downPaymentPercent}
                  onChange={(e) => handlePercentChange(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>10% (₹{Math.round(vehicle.price * 0.1).toLocaleString('en-IN')})</span>
                  <span>50% (₹{Math.round(vehicle.price * 0.5).toLocaleString('en-IN')})</span>
                  <span>80% (₹{Math.round(vehicle.price * 0.8).toLocaleString('en-IN')})</span>
                </div>
              </div>

              {/* Loan Tenure Selector */}
              <div>
                <span className="block font-bold text-slate-700 mb-1.5">Loan Duration / Tenure</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {(selectedBank.tenureMonths || [12, 24, 36, 48, 60, 84]).map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setTenureMonths(months)}
                      className={`py-1.5 px-1 rounded-xl text-center text-xs font-bold border transition cursor-pointer ${
                        tenureMonths === months
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{months} Mo</span>
                      <span className="block text-[9px] font-normal opacity-80">{Math.round(months/12)} yr</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. CALCULATED EMI SUMMARY BANNER (60% Blue, 30% Green, 10% Red) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Estimated Monthly EMI
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                    ₹{monthlyEmi.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  @ {annualRate}% annual interest with {selectedBank.bankName}
                </span>
              </div>

              {/* Breakdown Stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] w-full sm:w-auto bg-white/80 p-2 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Loan Amount</span>
                  <span className="font-bold text-blue-700">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Interest</span>
                  <span className="font-bold text-rose-600">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* 4. COMPACT BUYER SUBMIT CONTACT INFO */}
            <form onSubmit={handleSubmitEmi} className="pt-2 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">Submit Instant EMI Loan Interest</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Instant Sanction Lead
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Your Contact Number *"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/20 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting || !buyerName.trim() || !buyerPhone.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Application...' : 'Apply for EMI & Send to Admin'}</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                Data is securely transferred to Super Admin & {selectedBank.bankName} loan desk. Zero spam guarantee.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
