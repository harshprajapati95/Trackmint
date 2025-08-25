import React, { useState } from 'react';
import { PieChart, Target, Settings, TrendingUp } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

const BudgetRuleSelection = () => {
  const { userData, dispatch, actions } = useWizard();
  const [selectedRule, setSelectedRule] = useState(userData.budgetRule);
  const [customBudget, setCustomBudget] = useState(userData.customBudget);

  const handleRuleChange = (rule) => {
    setSelectedRule(rule);
    dispatch({ type: actions.UPDATE_BUDGET_RULE, payload: rule });
  };

  const handleCustomBudgetChange = (field, value) => {
    const updated = { ...customBudget, [field]: parseInt(value) || 0 };
    
    // Ensure total doesn't exceed 100%
    const total = updated.needs + updated.wants + updated.savings;
    if (total <= 100) {
      setCustomBudget(updated);
      dispatch({ type: actions.UPDATE_CUSTOM_BUDGET, payload: updated });
    }
  };

  const customTotal = customBudget.needs + customBudget.wants + customBudget.savings;
  const monthlyIncome = userData.income.monthly || 0;

  const rules = [
    {
      id: '50-30-20',
      title: '50-30-20 Rule',
      subtitle: 'Popular & Balanced',
      description: 'Spend 50% on needs, 30% on wants, save 20%',
      icon: Target,
      breakdown: { needs: 50, wants: 30, savings: 20 },
      recommended: true,
    },
    {
      id: '60-20-20',
      title: '60-20-20 Rule',
      subtitle: 'Moderate Saving',
      description: 'Spend 60% on needs, 20% on wants, save 20%',
      icon: TrendingUp,
      breakdown: { needs: 60, wants: 20, savings: 20 },
    },
    {
      id: 'custom',
      title: 'Custom Rule',
      subtitle: 'Personalized',
      description: 'Create your own budget allocation',
      icon: Settings,
      breakdown: customBudget,
    },
  ];

  const calculateAmount = (percentage) => {
    return (monthlyIncome * percentage / 100).toLocaleString();
  };

  return (
    <div className="wizard-step animate-fade-in">
      <div className="step-header text-center mb-8">
        <div className="step-icon bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <PieChart size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Choose your budget rule</h2>
        <p className="text-secondary">Select a budgeting method that aligns with your financial goals</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {rules.map((rule) => {
            const Icon = rule.icon;
            const isSelected = selectedRule === rule.id;
            
            return (
              <div
                key={rule.id}
                className={`card cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-accent shadow-lg transform scale-105' 
                    : 'hover:border-accent/50'
                }`}
                onClick={() => handleRuleChange(rule.id)}
              >
                {rule.recommended && (
                  <div className="absolute -top-3 -right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-accent text-white' : 'bg-light text-accent'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-primary">{rule.title}</h3>
                  <p className="text-xs text-accent font-medium">{rule.subtitle}</p>
                  <p className="text-sm text-secondary mt-2">{rule.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Needs</span>
                    <span className="font-semibold text-primary">{rule.breakdown.needs}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Wants</span>
                    <span className="font-semibold text-primary">{rule.breakdown.wants}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Savings</span>
                    <span className="font-semibold text-success">{rule.breakdown.savings}%</span>
                  </div>
                </div>

                {monthlyIncome > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-secondary mb-2">Monthly Allocation:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Needs:</span>
                        <span className="font-semibold">₹{calculateAmount(rule.breakdown.needs)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wants:</span>
                        <span className="font-semibold">₹{calculateAmount(rule.breakdown.wants)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Savings:</span>
                        <span className="font-semibold text-success">₹{calculateAmount(rule.breakdown.savings)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedRule === 'custom' && (
          <div className="card max-w-md mx-auto">
            <h3 className="font-semibold text-primary mb-4">Customize Your Budget</h3>
            
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Needs ({customBudget.needs}%)</label>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={customBudget.needs}
                  onChange={(e) => handleCustomBudgetChange('needs', e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-secondary">
                  <span>30%</span>
                  <span>70%</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Wants ({customBudget.wants}%)</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={customBudget.wants}
                  onChange={(e) => handleCustomBudgetChange('wants', e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-secondary">
                  <span>10%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Savings ({customBudget.savings}%)</label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={customBudget.savings}
                  onChange={(e) => handleCustomBudgetChange('savings', e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-secondary">
                  <span>10%</span>
                  <span>40%</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${
                customTotal === 100 ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'
              }`}>
                <p className={`text-sm font-semibold ${
                  customTotal === 100 ? 'text-success' : 'text-warning'
                }`}>
                  Total: {customTotal}%
                  {customTotal !== 100 && ` (${100 - customTotal}% ${customTotal > 100 ? 'over' : 'remaining'})`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-secondary">
            💡 The 50-30-20 rule is recommended for beginners and provides a balanced approach to budgeting
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetRuleSelection;
