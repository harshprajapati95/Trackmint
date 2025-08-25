import React, { useState } from 'react';
import { Shield, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

const RiskAppetiteSelection = () => {
  const { userData, dispatch, actions } = useWizard();
  const [selectedRisk, setSelectedRisk] = useState(userData.riskAppetite);

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);
    dispatch({ type: actions.UPDATE_RISK_APPETITE, payload: risk });
  };

  const riskProfiles = [
    {
      id: 'Conservative',
      title: 'Conservative',
      subtitle: 'Safety First',
      description: 'You prefer stable returns with minimal risk of losing your principal investment',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      characteristics: [
        'Low risk tolerance',
        'Stable, predictable returns',
        'Capital preservation focus',
        'Short to medium investment horizon'
      ],
      expectedReturn: '6-8%',
      riskLevel: 'Low',
      suitableFor: 'Near retirement, risk-averse investors',
      investments: ['Fixed Deposits', 'Government Bonds', 'Conservative Mutual Funds', 'Blue-chip Stocks'],
    },
    {
      id: 'Balanced',
      title: 'Balanced',
      subtitle: 'Moderate Growth',
      description: 'You seek a balance between growth and stability, willing to accept moderate risk',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      characteristics: [
        'Moderate risk tolerance',
        'Balanced growth and stability',
        'Diversified portfolio',
        'Medium to long investment horizon'
      ],
      expectedReturn: '8-12%',
      riskLevel: 'Medium',
      suitableFor: 'Working professionals, balanced approach',
      investments: ['Hybrid Mutual Funds', 'Large-cap Stocks', 'Balanced ETFs', 'Corporate Bonds'],
      recommended: true,
    },
    {
      id: 'Aggressive',
      title: 'Aggressive',
      subtitle: 'High Growth',
      description: 'You are comfortable with high risk for potentially higher returns over the long term',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      characteristics: [
        'High risk tolerance',
        'Growth-focused strategy',
        'Can handle volatility',
        'Long investment horizon'
      ],
      expectedReturn: '12-16%',
      riskLevel: 'High',
      suitableFor: 'Young investors, high-income earners',
      investments: ['Small-cap Stocks', 'Growth Mutual Funds', 'Sector ETFs', 'Emerging Markets'],
    },
  ];

  return (
    <div className="wizard-step animate-fade-in">
      <div className="step-header text-center mb-8">
        <div className="step-icon bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">What's your risk appetite?</h2>
        <p className="text-secondary">Choose your investment risk level to get personalized recommendations</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {riskProfiles.map((profile) => {
            const Icon = profile.icon;
            const isSelected = selectedRisk === profile.id;
            
            return (
              <div
                key={profile.id}
                className={`card cursor-pointer transition-all duration-200 relative ${
                  isSelected 
                    ? 'border-accent shadow-lg transform scale-105' 
                    : 'hover:border-accent/50'
                }`}
                onClick={() => handleRiskChange(profile.id)}
              >
                {profile.recommended && (
                  <div className="absolute -top-3 -right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isSelected ? 'bg-accent text-white' : `${profile.bgColor} ${profile.color}`
                  }`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary">{profile.title}</h3>
                  <p className="text-sm text-accent font-medium">{profile.subtitle}</p>
                  <p className="text-sm text-secondary mt-2 leading-relaxed">{profile.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-light rounded-lg">
                      <p className="text-xs text-secondary">Expected Return</p>
                      <p className="font-bold text-accent">{profile.expectedReturn}</p>
                    </div>
                    <div className="text-center p-3 bg-light rounded-lg">
                      <p className="text-xs text-secondary">Risk Level</p>
                      <p className={`font-bold ${
                        profile.riskLevel === 'Low' ? 'text-blue-600' :
                        profile.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {profile.riskLevel}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-primary mb-2">Key Characteristics:</p>
                    <ul className="text-xs text-secondary space-y-1">
                      {profile.characteristics.map((char, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-primary mb-2">Suitable Investment Types:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.investments.slice(0, 3).map((investment, index) => (
                        <span key={index} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                          {investment}
                        </span>
                      ))}
                      {profile.investments.length > 3 && (
                        <span className="text-xs bg-border text-secondary px-2 py-1 rounded-full">
                          +{profile.investments.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-secondary">
                      <span className="font-semibold">Best for:</span> {profile.suitableFor}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedRisk && (
          <div className="card max-w-2xl mx-auto">
            <h3 className="font-semibold text-primary mb-4 text-center">
              Your Selected Risk Profile: {selectedRisk}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-light rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Time Horizon</h4>
                <p className="text-sm text-secondary">
                  {selectedRisk === 'Conservative' ? '1-3 years' :
                   selectedRisk === 'Balanced' ? '3-7 years' : '7+ years'}
                </p>
              </div>
              
              <div className="p-4 bg-light rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Max Drawdown</h4>
                <p className="text-sm text-secondary">
                  {selectedRisk === 'Conservative' ? '5-10%' :
                   selectedRisk === 'Balanced' ? '10-20%' : '20-30%'}
                </p>
              </div>
              
              <div className="p-4 bg-light rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Volatility</h4>
                <p className="text-sm text-secondary">
                  {selectedRisk === 'Conservative' ? 'Low' :
                   selectedRisk === 'Balanced' ? 'Moderate' : 'High'}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-primary text-center">
                💡 Based on your selection, we'll recommend a portfolio that matches your risk tolerance and financial goals.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-secondary">
            💡 Remember, higher returns typically come with higher risk. Choose what aligns with your comfort level and goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAppetiteSelection;
