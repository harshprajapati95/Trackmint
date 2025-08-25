import React, { useState } from 'react';
import { DollarSign, Briefcase, Calculator } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

const IncomeEntry = () => {
  const { userData, dispatch, actions } = useWizard();
  const [income, setIncome] = useState(userData.income);

  const handleIncomeChange = (field, value) => {
    const updatedIncome = { ...income, [field]: value };
    
    // Auto-calculate annual/monthly based on input
    if (field === 'monthly') {
      updatedIncome.annual = value * 12;
    } else if (field === 'annual') {
      updatedIncome.monthly = value / 12;
    }
    
    setIncome(updatedIncome);
    dispatch({ type: actions.UPDATE_INCOME, payload: updatedIncome });
  };

  return (
    <div className="wizard-step animate-fade-in">
      <div className="step-header text-center mb-8">
        <div className="step-icon bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Let's start with your income</h2>
        <p className="text-secondary">Enter your monthly or annual income to begin your financial planning journey</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Briefcase size={18} />
              Income Source
            </label>
            <select 
              className="form-select"
              value={income.source}
              onChange={(e) => handleIncomeChange('source', e.target.value)}
            >
              <option value="salary">Salary</option>
              <option value="business">Business</option>
              <option value="freelance">Freelancing</option>
              <option value="multiple">Multiple Sources</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Calculator size={18} />
                Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">₹</span>
                <input
                  type="number"
                  className="form-input pl-8"
                  placeholder="50,000"
                  value={income.monthly || ''}
                  onChange={(e) => handleIncomeChange('monthly', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <Calculator size={18} />
                Annual Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">₹</span>
                <input
                  type="number"
                  className="form-input pl-8"
                  placeholder="6,00,000"
                  value={income.annual || ''}
                  onChange={(e) => handleIncomeChange('annual', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {income.monthly > 0 && (
            <div className="mt-6 p-4 bg-light rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Income Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary">Monthly:</span>
                  <p className="font-semibold text-accent">₹{income.monthly.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-secondary">Annual:</span>
                  <p className="font-semibold text-accent">₹{income.annual.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary mb-4">
            💡 Your income information is used to create personalized budget recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeEntry;
