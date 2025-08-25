import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Receipt, Plus, Trash2, Calculator } from 'lucide-react';
import { useWizard, calculateBudgetAllocation } from '../../context/WizardContext';
import { colors } from '../../constants/theme';

const ExpensesAllocation = () => {
  const { userData, dispatch, actions } = useWizard();
  const [expenses, setExpenses] = useState(userData.expenses);
  const [newExpense, setNewExpense] = useState({ category: 'needs', name: '', amount: '' });

  const budgetAllocation = calculateBudgetAllocation(
    userData.income,
    userData.budgetRule,
    userData.customBudget
  );

  useEffect(() => {
    dispatch({ type: actions.UPDATE_EXPENSES, payload: expenses });
  }, [expenses, dispatch, actions]);

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
      };

      const updatedExpenses = {
        ...expenses,
        [newExpense.category]: [...expenses[newExpense.category], expense],
      };

      // Recalculate totals
      updatedExpenses.totalNeeds = updatedExpenses.needs.reduce((sum, exp) => sum + exp.amount, 0);
      updatedExpenses.totalWants = updatedExpenses.wants.reduce((sum, exp) => sum + exp.amount, 0);

      setExpenses(updatedExpenses);
      setNewExpense({ category: 'needs', name: '', amount: '' });
    }
  };

  const removeExpense = (category, expenseId) => {
    const updatedExpenses = {
      ...expenses,
      [category]: expenses[category].filter(exp => exp.id !== expenseId),
    };

    // Recalculate totals
    updatedExpenses.totalNeeds = updatedExpenses.needs.reduce((sum, exp) => sum + exp.amount, 0);
    updatedExpenses.totalWants = updatedExpenses.wants.reduce((sum, exp) => sum + exp.amount, 0);

    setExpenses(updatedExpenses);
  };

  // Prepare data for pie chart
  const chartData = [
    {
      name: 'Needs (Allocated)',
      value: expenses.totalNeeds,
      color: colors.primary,
      budget: budgetAllocation.needs,
    },
    {
      name: 'Wants (Allocated)',
      value: expenses.totalWants,
      color: colors.accent,
      budget: budgetAllocation.wants,
    },
    {
      name: 'Available Needs',
      value: Math.max(0, budgetAllocation.needs - expenses.totalNeeds),
      color: '#E3E8ED',
      budget: 0,
    },
    {
      name: 'Available Wants',
      value: Math.max(0, budgetAllocation.wants - expenses.totalWants),
      color: '#F5F7FA',
      budget: 0,
    },
  ].filter(item => item.value > 0);

  const savingsAmount = budgetAllocation.savings;
  const totalAllocated = expenses.totalNeeds + expenses.totalWants;
  const budgetUsed = ((totalAllocated / (budgetAllocation.needs + budgetAllocation.wants)) * 100) || 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-accent">₹{data.value.toLocaleString()}</p>
          {data.budget > 0 && (
            <p className="text-sm text-secondary">Budget: ₹{data.budget.toLocaleString()}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="wizard-step animate-fade-in">
      <div className="step-header text-center mb-8">
        <div className="step-icon bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Receipt size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Allocate your expenses</h2>
        <p className="text-secondary">Add your expected monthly expenses to see how they fit your budget</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expense Entry */}
          <div className="space-y-6">
            {/* Add New Expense */}
            <div className="card">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Plus size={20} />
                Add Expense
              </h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option value="needs">Needs (Essential)</option>
                    <option value="wants">Wants (Lifestyle)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Expense Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Groceries, Rent, Entertainment"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">₹</span>
                    <input
                      type="number"
                      className="form-input pl-8"
                      placeholder="5,000"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-accent w-full"
                  onClick={addExpense}
                  disabled={!newExpense.name || !newExpense.amount}
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="card">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Calculator size={20} />
                Budget Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-light rounded-lg">
                  <span className="font-medium">Needs Budget</span>
                  <span className="font-semibold text-primary">₹{budgetAllocation.needs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-light rounded-lg">
                  <span className="font-medium">Wants Budget</span>
                  <span className="font-semibold text-accent">₹{budgetAllocation.wants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <span className="font-medium">Savings</span>
                  <span className="font-semibold text-success">₹{savingsAmount.toLocaleString()}</span>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Budget Used</span>
                    <span className={`font-bold ${budgetUsed > 100 ? 'text-danger' : 'text-accent'}`}>
                      {budgetUsed.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budgetUsed > 100 ? 'bg-danger' : 'bg-accent'
                      }`}
                      style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization and Expense Lists */}
          <div className="space-y-6">
            {/* Pie Chart */}
            {chartData.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-primary mb-4">Expense Allocation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Expense Lists */}
            {(expenses.needs.length > 0 || expenses.wants.length > 0) && (
              <div className="card">
                <h3 className="font-semibold text-primary mb-4">Your Expenses</h3>
                
                {expenses.needs.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-primary mb-3">Needs (₹{expenses.totalNeeds.toLocaleString()})</h4>
                    <div className="space-y-2">
                      {expenses.needs.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-2 bg-primary/5 rounded-lg">
                          <span className="text-sm font-medium">{expense.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹{expense.amount.toLocaleString()}</span>
                            <button
                              onClick={() => removeExpense('needs', expense.id)}
                              className="text-danger hover:bg-danger/10 p-1 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expenses.wants.length > 0 && (
                  <div>
                    <h4 className="font-medium text-primary mb-3">Wants (₹{expenses.totalWants.toLocaleString()})</h4>
                    <div className="space-y-2">
                      {expenses.wants.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-2 bg-accent/5 rounded-lg">
                          <span className="text-sm font-medium">{expense.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹{expense.amount.toLocaleString()}</span>
                            <button
                              onClick={() => removeExpense('wants', expense.id)}
                              className="text-danger hover:bg-danger/10 p-1 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-secondary">
            💡 Try to keep your total expenses within your budget allocation for better financial health
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpensesAllocation;
