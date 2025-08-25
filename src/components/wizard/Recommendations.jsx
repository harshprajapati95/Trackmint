import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Star, DollarSign, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { useWizard, generateRecommendations, calculateBudgetAllocation } from '../../context/WizardContext';
import { colors } from '../../constants/theme';

const Recommendations = () => {
  const { userData, dispatch, actions } = useWizard();

  useEffect(() => {
    const budgetAllocation = calculateBudgetAllocation(
      userData.income,
      userData.budgetRule,
      userData.customBudget
    );
    
    const recommendations = generateRecommendations(userData.riskAppetite, budgetAllocation);
    dispatch({ type: actions.SET_RECOMMENDATIONS, payload: recommendations });
  }, [userData.riskAppetite, dispatch, actions]);

  const budgetAllocation = calculateBudgetAllocation(
    userData.income,
    userData.budgetRule,
    userData.customBudget
  );

  const recommendations = userData.recommendations;
  const savingsAmount = budgetAllocation.savings;

  // Prepare data for charts
  const allocationData = [
    { name: 'Needs', amount: budgetAllocation.needs, color: colors.primary },
    { name: 'Wants', amount: budgetAllocation.wants, color: colors.accent },
    { name: 'Savings', amount: budgetAllocation.savings, color: colors.success },
  ];

  const portfolioData = recommendations.stocks?.map(stock => ({
    name: stock.symbol,
    value: (savingsAmount * stock.allocation) / 100,
    allocation: stock.allocation,
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-accent">₹{payload[0].value.toLocaleString()}</p>
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
          <p className="text-sm text-secondary">{data.allocation}% allocation</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="wizard-step animate-fade-in">
      <div className="step-header text-center mb-8">
        <div className="step-icon bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Your personalized recommendations</h2>
        <p className="text-secondary">Based on your profile, here's how to optimize your finances</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <Target size={20} />
              Monthly Budget Allocation
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allocationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E8ED" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {allocationData.map((item) => (
                <div key={item.name} className="text-center p-3 bg-light rounded-lg">
                  <p className="text-xs text-secondary">{item.name}</p>
                  <p className="font-semibold text-primary">₹{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {portfolioData.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Investment Portfolio Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(${180 + index * 40}, 60%, 50%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Stock Recommendations */}
        {recommendations.stocks && recommendations.stocks.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <DollarSign size={20} />
                Recommended Stocks for {userData.riskAppetite} Profile
              </h3>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <span>Risk Level:</span>
                <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                  userData.riskAppetite === 'Conservative' ? 'bg-blue-100 text-blue-600' :
                  userData.riskAppetite === 'Balanced' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {userData.riskAppetite}
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-primary">Stock</th>
                    <th className="text-right py-3 px-4 font-semibold text-primary">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-primary">Change</th>
                    <th className="text-right py-3 px-4 font-semibold text-primary">Allocation</th>
                    <th className="text-right py-3 px-4 font-semibold text-primary">Investment</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.stocks.map((stock, index) => {
                    const investmentAmount = (savingsAmount * stock.allocation) / 100;
                    const isPositive = stock.change > 0;
                    
                    return (
                      <tr key={index} className="border-b border-border hover:bg-light transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-primary">{stock.symbol}</p>
                            <p className="text-sm text-secondary">{stock.name}</p>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-semibold">₹{stock.price.toLocaleString()}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className={`flex items-center justify-end gap-1 ${
                            isPositive ? 'text-success' : 'text-danger'
                          }`}>
                            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            <span className="font-semibold">{Math.abs(stock.change)}%</span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <span className="font-semibold text-accent">{stock.allocation}%</span>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-semibold text-primary">₹{investmentAmount.toLocaleString()}</p>
                          <p className="text-sm text-secondary">
                            {Math.floor(investmentAmount / stock.price)} shares
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Investment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-secondary">Total Investment</p>
                  <p className="font-semibold text-primary">₹{savingsAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-secondary">Number of Stocks</p>
                  <p className="font-semibold text-primary">{recommendations.stocks.length}</p>
                </div>
                <div>
                  <p className="text-secondary">Avg. Allocation</p>
                  <p className="font-semibold text-primary">
                    {(100 / recommendations.stocks.length).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-secondary">Risk Level</p>
                  <p className="font-semibold text-accent">{userData.riskAppetite}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mutual Fund Recommendations */}
        {recommendations.mutualFunds && recommendations.mutualFunds.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
              <Target size={20} />
              Recommended Mutual Funds
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.mutualFunds.map((fund, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:border-accent transition-colors">
                  <h4 className="font-semibold text-primary mb-2">{fund.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-secondary">NAV</p>
                      <p className="font-semibold">₹{fund.nav}</p>
                    </div>
                    <div>
                      <p className="text-secondary">Returns (1Y)</p>
                      <p className="font-semibold text-success">{fund.returns}%</p>
                    </div>
                  </div>
                  {fund.allocation > 0 && (
                    <div className="mt-3 p-2 bg-light rounded">
                      <p className="text-xs text-secondary">Recommended Allocation</p>
                      <p className="font-semibold text-accent">{fund.allocation}% (₹{((savingsAmount * fund.allocation) / 100).toLocaleString()})</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Steps */}
        <div className="card">
          <h3 className="font-semibold text-primary mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-light rounded-lg">
              <h4 className="font-semibold text-primary mb-2">1. Set up your budget</h4>
              <p className="text-sm text-secondary">
                Start tracking your expenses according to the {userData.budgetRule} rule
              </p>
            </div>
            <div className="p-4 bg-light rounded-lg">
              <h4 className="font-semibold text-primary mb-2">2. Open investment accounts</h4>
              <p className="text-sm text-secondary">
                Set up a demat account and start with systematic investments
              </p>
            </div>
            <div className="p-4 bg-light rounded-lg">
              <h4 className="font-semibold text-primary mb-2">3. Review and adjust</h4>
              <p className="text-sm text-secondary">
                Monitor your portfolio monthly and rebalance quarterly
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary mb-4">
            💡 These recommendations are based on your risk profile and financial goals. 
            Consider consulting with a financial advisor for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
