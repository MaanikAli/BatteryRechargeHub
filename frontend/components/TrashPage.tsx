import React from 'react';
import Header from './Header';
import TrashBin from './TrashBin';

const TrashPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header onAdminProfile={() => {}} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <TrashBin />
      </main>
    </div>
  );
};

export default TrashPage;
