import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import IncomeEntry from './IncomeEntry';
import BudgetRuleSelection from './BudgetRuleSelection';
import ExpensesAllocation from './ExpensesAllocation';
import RiskAppetiteSelection from './RiskAppetiteSelection';
import Recommendations from './Recommendations';

const FinanceWizard = ({ onComplete }) => {
  const { currentStep, totalSteps, userData, dispatch, actions } = useWizard();

  const steps = [
    { id: 1, title: 'Income', component: IncomeEntry },
    { id: 2, title: 'Budget Rule', component: BudgetRuleSelection },
    { id: 3, title: 'Expenses', component: ExpensesAllocation },
    { id: 4, title: 'Risk Profile', component: RiskAppetiteSelection },
    { id: 5, title: 'Recommendations', component: Recommendations },
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return userData.income.monthly > 0 || userData.income.annual > 0;
      case 2:
        return userData.budgetRule && (
          userData.budgetRule !== 'custom' || 
          (userData.customBudget.needs + userData.customBudget.wants + userData.customBudget.savings === 100)
        );
      case 3:
        return true; // Expenses are optional
      case 4:
        return userData.riskAppetite;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      dispatch({ type: actions.NEXT_STEP });
    } else {
      dispatch({ type: actions.COMPLETE_WIZARD });
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      dispatch({ type: actions.PREV_STEP });
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep) {
      const diff = stepNumber - currentStep;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          dispatch({ type: actions.NEXT_STEP });
        }
      } else {
        for (let i = 0; i < Math.abs(diff); i++) {
          dispatch({ type: actions.PREV_STEP });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-primary">TrackMint Setup</h1>
            <div className="text-sm text-secondary">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold cursor-pointer transition-all ${
                    step.id < currentStep
                      ? 'bg-success text-white'
                      : step.id === currentStep
                      ? 'bg-accent text-white'
                      : 'bg-border text-secondary hover:bg-accent/20'
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  {step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full ${
                    step.id < currentStep ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 text-center">
                <p className={`text-xs font-medium ${
                  step.id === currentStep ? 'text-accent' : 
                  step.id < currentStep ? 'text-success' : 'text-secondary'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {CurrentStepComponent && <CurrentStepComponent />}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-border sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`btn btn-outline flex items-center gap-2 ${
                currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="text-sm text-secondary">
              {currentStep === totalSteps ? 'Review your recommendations' : 'Continue to next step'}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`btn ${currentStep === totalSteps ? 'btn-success' : 'btn-accent'} flex items-center gap-2 ${
                !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentStep === totalSteps ? (
                <>
                  <Check size={18} />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceWizard;
