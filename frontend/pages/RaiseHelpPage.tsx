import React from 'react';
import Layout from '../components/Layout';
import HelpRequestForm from '../components/HelpRequestForm';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RaiseHelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <button 
        onClick={() => navigate('/student')}
        className="mb-6 flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>
      <div className="max-w-3xl mx-auto">
        <HelpRequestForm isFullPage={true} />
      </div>
    </Layout>
  );
};

export default RaiseHelpPage;
