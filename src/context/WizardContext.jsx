import React, { createContext, useContext, useReducer } from 'react';

// Initial state for the finance wizard
const initialState = {
  currentStep: 1,
  totalSteps: 5,
  userData: {
    income: {
      monthly: 0,
      annual: 0,
      source: 'salary',
    },
    budgetRule: '50-30-20',
    customBudget: {
      needs: 50,
      wants: 30,
      savings: 20,
    },
    expenses: {
      needs: [],
      wants: [],
      totalNeeds: 0,
      totalWants: 0,
    },
    riskAppetite: 'Balanced',
    investmentGoals: [],
    recommendations: {
      stocks: [],
      mutualFunds: [],
      bonds: [],
    },
  },
  isComplete: false,
};

// Action types
const WIZARD_ACTIONS = {
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  UPDATE_INCOME: 'UPDATE_INCOME',
  UPDATE_BUDGET_RULE: 'UPDATE_BUDGET_RULE',
  UPDATE_CUSTOM_BUDGET: 'UPDATE_CUSTOM_BUDGET',
  UPDATE_EXPENSES: 'UPDATE_EXPENSES',
  UPDATE_RISK_APPETITE: 'UPDATE_RISK_APPETITE',
  UPDATE_GOALS: 'UPDATE_GOALS',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  COMPLETE_WIZARD: 'COMPLETE_WIZARD',
  RESET_WIZARD: 'RESET_WIZARD',
};

// Reducer function
function wizardReducer(state, action) {
  switch (action.type) {
    case WIZARD_ACTIONS.NEXT_STEP:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };
    
    case WIZARD_ACTIONS.PREV_STEP:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    
    case WIZARD_ACTIONS.UPDATE_INCOME:
      return {
        ...state,
        userData: {
          ...state.userData,
          income: { ...state.userData.income, ...action.payload },
        },
      };
    
    case WIZARD_ACTIONS.UPDATE_BUDGET_RULE:
      return {
        ...state,
        userData: {
          ...state.userData,
          budgetRule: action.payload,
        },
      };
    
    case WIZARD_ACTIONS.UPDATE_CUSTOM_BUDGET:
      return {
        ...state,
        userData: {
          ...state.userData,
          customBudget: { ...state.userData.customBudget, ...action.payload },
        },
      };
    
    case WIZARD_ACTIONS.UPDATE_EXPENSES:
      return {
        ...state,
        userData: {
          ...state.userData,
          expenses: { ...state.userData.expenses, ...action.payload },
        },
      };
    
    case WIZARD_ACTIONS.UPDATE_RISK_APPETITE:
      return {
        ...state,
        userData: {
          ...state.userData,
          riskAppetite: action.payload,
        },
      };
    
    case WIZARD_ACTIONS.UPDATE_GOALS:
      return {
        ...state,
        userData: {
          ...state.userData,
          investmentGoals: action.payload,
        },
      };
    
    case WIZARD_ACTIONS.SET_RECOMMENDATIONS:
      return {
        ...state,
        userData: {
          ...state.userData,
          recommendations: action.payload,
        },
      };
    
    case WIZARD_ACTIONS.COMPLETE_WIZARD:
      return {
        ...state,
        isComplete: true,
      };
    
    case WIZARD_ACTIONS.RESET_WIZARD:
      return initialState;
    
    default:
      return state;
  }
}

// Create context
const WizardContext = createContext();

// Provider component
export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const value = {
    ...state,
    dispatch,
    actions: WIZARD_ACTIONS,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

// Custom hook to use the wizard context
export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

// Helper functions for calculations
export const calculateBudgetAllocation = (income, budgetRule, customBudget) => {
  const monthlyIncome = income.monthly || income.annual / 12;
  
  if (budgetRule === '50-30-20') {
    return {
      needs: monthlyIncome * 0.5,
      wants: monthlyIncome * 0.3,
      savings: monthlyIncome * 0.2,
    };
  } else if (budgetRule === 'custom') {
    return {
      needs: monthlyIncome * (customBudget.needs / 100),
      wants: monthlyIncome * (customBudget.wants / 100),
      savings: monthlyIncome * (customBudget.savings / 100),
    };
  }
  
  return { needs: 0, wants: 0, savings: 0 };
};

export const generateRecommendations = (riskAppetite, budgetAllocation) => {
  const recommendations = {
    Conservative: {
      stocks: [
        { symbol: 'HDFC', name: 'HDFC Bank', price: 1650, change: 1.2, allocation: 20 },
        { symbol: 'ITC', name: 'ITC Limited', price: 425, change: 0.8, allocation: 15 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3450, change: 0.5, allocation: 15 },
      ],
      mutualFunds: [
        { name: 'HDFC Balanced Advantage Fund', nav: 45.67, returns: 8.5, allocation: 30 },
        { name: 'SBI Conservative Hybrid Fund', nav: 32.89, returns: 7.2, allocation: 20 },
      ],
    },
    Balanced: {
      stocks: [
        { symbol: 'INFY', name: 'Infosys Limited', price: 1789, change: 2.1, allocation: 25 },
        { symbol: 'HDFC', name: 'HDFC Bank', price: 1650, change: 1.2, allocation: 20 },
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2890, change: 1.8, allocation: 20 },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1234, change: 1.5, allocation: 15 },
      ],
      mutualFunds: [
        { name: 'Axis Bluechip Fund', nav: 67.45, returns: 12.3, allocation: 20 },
      ],
    },
    Aggressive: {
      stocks: [
        { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1456, change: 3.2, allocation: 20 },
        { symbol: 'TATASTEEL', name: 'Tata Steel', price: 145, change: 2.8, allocation: 20 },
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2890, change: 1.8, allocation: 25 },
        { symbol: 'INFY', name: 'Infosys Limited', price: 1789, change: 2.1, allocation: 20 },
        { symbol: 'TECHM', name: 'Tech Mahindra', price: 1567, change: 2.5, allocation: 15 },
      ],
      mutualFunds: [
        { name: 'Parag Parikh Flexi Cap Fund', nav: 89.23, returns: 16.7, allocation: 0 },
      ],
    },
  };

  return recommendations[riskAppetite] || recommendations.Balanced;
};
