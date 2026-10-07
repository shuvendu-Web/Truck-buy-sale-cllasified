import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Legal Agreement</span>
        <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Marketplace Platform Agreement</h2>
          <p>
            SatyaDeal operates as an interactive classified vehicle marketplace connecting buyers and sellers across India. By accessing our platform, you agree to adhere to all terms, policies, and applicable Motor Vehicles Act regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Mandatory Super Admin Review Policy</h2>
          <p>
            All vehicle listings submitted by sellers undergo mandatory administrative review prior to public indexing. SatyaDeal reserves the right to approve, reject with reason, or modify listings containing inaccurate specifications or deceptive imagery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Buyer Inquiries & Contact Sharing</h2>
          <p>
            When a buyer submits an inquiry, they explicitly authorize SatyaDeal to transmit their contact name, phone, and message to the designated vehicle owner for transaction finalization.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Data Protection</span>
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            SatyaDeal collects registration information (name, email, phone number), listing metadata, vehicle specifications, and buyer inquiry logs to ensure safe peer-to-peer commerce.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Data Security & Storage</h2>
          <p>
            All user authentication credentials and transaction leads are secured via Firebase enterprise Firestore rules and access control policies.
          </p>
        </section>
      </div>
    </div>
  );
};
