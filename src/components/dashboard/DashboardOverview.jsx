import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, ArrowUp, ArrowDown, Wallet, Receipt } from 'lucide-react';
import { calculateBudgetAllocation } from '../../context/WizardContext';
import { colors } from '../../constants/theme';

const DashboardOverview = ({ userData }) => {
  const budgetAllocation = calculateBudgetAllocation(
    userData.income,
    userData.budgetRule,
    userData.customBudget
  );

  // Calculate dynamic values based on user data
  const monthlyIncome = userData.income?.monthly || 50000;
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  
  // Calculate realistic expenses based on user's budget allocation
  const calculateExpenses = () => {
    const needsAmount = budgetAllocation.needs;
    const wantsAmount = budgetAllocation.wants;
    const savingsAmount = budgetAllocation.savings;
    
    // Add some realistic variation (±10%)
    const variation = () => 0.9 + (Math.random() * 0.2);
    
    return {
      needs: Math.round(needsAmount * variation()),
      wants: Math.round(wantsAmount * variation()),
      savings: Math.round(savingsAmount * variation())
    };
  };

  const currentExpenses = calculateExpenses();
  
  // Calculate portfolio value based on savings and some growth
  const monthsSinceStart = Math.max(1, currentMonthIndex + 1);
  const totalSavings = budgetAllocation.savings * monthsSinceStart;
  const portfolioGrowth = 0.08; // 8% annual growth
  const portfolioValue = Math.round(totalSavings * (1 + (portfolioGrowth * monthsSinceStart / 12)));
  
  // Mock data for charts with more realistic values
  const monthlyExpenses = [
    { month: 'Jan', needs: budgetAllocation.needs * 0.95, wants: budgetAllocation.wants * 1.1, savings: budgetAllocation.savings * 1.0 },
    { month: 'Feb', needs: budgetAllocation.needs * 0.92, wants: budgetAllocation.wants * 1.05, savings: budgetAllocation.savings * 1.0 },
    { month: 'Mar', needs: budgetAllocation.needs * 1.04, wants: budgetAllocation.wants * 0.85, savings: budgetAllocation.savings * 1.0 },
    { month: 'Apr', needs: budgetAllocation.needs * 0.96, wants: budgetAllocation.wants * 0.95, savings: budgetAllocation.savings * 1.0 },
    { month: 'May', needs: budgetAllocation.needs * 0.88, wants: budgetAllocation.wants * 1.15, savings: budgetAllocation.savings * 1.0 },
    { month: 'Jun', needs: currentExpenses.needs, wants: currentExpenses.wants, savings: currentExpenses.savings },
  ];

  const portfolioHistory = [
    { month: 'Jan', value: totalSavings * 0.2 * 1.00 },
    { month: 'Feb', value: totalSavings * 0.4 * 1.02 },
    { month: 'Mar', value: totalSavings * 0.6 * 0.98 },
    { month: 'Apr', value: totalSavings * 0.8 * 1.05 },
    { month: 'May', value: totalSavings * 0.9 * 1.07 },
    { month: 'Jun', value: portfolioValue },
  ];

  const budgetBreakdown = [
    { name: 'Needs', value: budgetAllocation.needs, color: colors.primary },
    { name: 'Wants', value: budgetAllocation.wants, color: colors.accent },
    { name: 'Savings', value: budgetAllocation.savings, color: colors.success },
  ];

  // Calculate current month totals using dynamic data
  const currentMonth = monthlyExpenses[monthlyExpenses.length - 1];
  const currentPortfolio = portfolioHistory[portfolioHistory.length - 1];
  const previousPortfolio = portfolioHistory[portfolioHistory.length - 2];
  const portfolioChange = ((currentPortfolio.value - previousPortfolio.value) / previousPortfolio.value * 100);

  const totalExpenses = currentMonth.needs + currentMonth.wants;
  const budgetUtilization = (totalExpenses / (budgetAllocation.needs + budgetAllocation.wants)) * 100;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-accent">₹{data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-secondary">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Last updated</p>
          <p className="font-semibold text-primary">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Monthly Income</p>
              <p className="text-2xl font-bold text-primary">
                ₹{userData.income.monthly?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Total Expenses</p>
              <p className="text-2xl font-bold text-primary">₹{totalExpenses.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${budgetUtilization > 100 ? 'text-danger' : 'text-success'}`}>
                  {budgetUtilization.toFixed(1)}% of budget
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Portfolio Value</p>
              <p className="text-2xl font-bold text-primary">₹{currentPortfolio.value.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                {portfolioChange >= 0 ? (
                  <ArrowUp size={14} className="text-success" />
                ) : (
                  <ArrowDown size={14} className="text-danger" />
                )}
                <span className={`text-xs ${portfolioChange >= 0 ? 'text-success' : 'text-danger'}`}>
                  {Math.abs(portfolioChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Monthly Savings</p>
              <p className="text-2xl font-bold text-primary">₹{currentMonth.savings.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-success">
                  {((currentMonth.savings / userData.income.monthly) * 100).toFixed(1)}% of income
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Target size={24} className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <div className="card">
          <h3 className="font-semibold text-primary mb-4">Monthly Expenses Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8ED" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="needs" fill={colors.primary} radius={[2, 2, 0, 0]} />
                <Bar dataKey="wants" fill={colors.accent} radius={[2, 2, 0, 0]} />
                <Bar dataKey="savings" fill={colors.success} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <span>Needs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }}></div>
              <span>Wants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }}></div>
              <span>Savings</span>
            </div>
          </div>
        </div>

        {/* Portfolio Growth Chart */}
        <div className="card">
          <h3 className="font-semibold text-primary mb-4">Portfolio Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E8ED" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                  labelStyle={{ color: colors.textPrimary }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.accent} 
                  strokeWidth={3}
                  dot={{ fill: colors.accent, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: colors.accent }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Budget Allocation and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Allocation Pie Chart */}
        <div className="card lg:col-span-1">
          <h3 className="font-semibold text-primary mb-4">Budget Allocation</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {budgetBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {budgetBreakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-border rounded-lg hover:border-accent transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <Receipt size={20} className="text-accent" />
                <span className="font-semibold text-primary">Add Expense</span>
              </div>
              <p className="text-sm text-secondary">Record a new expense transaction</p>
            </button>
            
            <button className="p-4 border border-border rounded-lg hover:border-accent transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-accent" />
                <span className="font-semibold text-primary">Review Portfolio</span>
              </div>
              <p className="text-sm text-secondary">Check your investment performance</p>
            </button>
            
            <button className="p-4 border border-border rounded-lg hover:border-accent transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <Target size={20} className="text-accent" />
                <span className="font-semibold text-primary">Set New Goal</span>
              </div>
              <p className="text-sm text-secondary">Create a new financial goal</p>
            </button>
            
            <button className="p-4 border border-border rounded-lg hover:border-accent transition-colors text-left">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign size={20} className="text-accent" />
                <span className="font-semibold text-primary">Budget Review</span>
              </div>
              <p className="text-sm text-secondary">Analyze your spending patterns</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
