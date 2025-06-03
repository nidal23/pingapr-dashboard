export const mockUsageScenarios = {
  // Near PR limit - should show warning
  nearLimit: {
    usage: {
      prCount: 42,
      tier: 'FREE' as const,
      limit: 50,
      resetDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days
    },
    userCount: 4,
    needsUpgrade: true
  },

  // Over user limit - should show warning
  overUserLimit: {
    usage: {
      prCount: 28,
      tier: 'FREE' as const,
      limit: 50,
      resetDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days
    },
    userCount: 7,
    needsUpgrade: true
  },

  // At PR limit - should show critical warning
  atLimit: {
    usage: {
      prCount: 50,
      tier: 'FREE' as const,
      limit: 50,
      resetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
    },
    userCount: 5,
    needsUpgrade: true
  },

  // Both limits exceeded - should show critical warning
  bothLimits: {
    usage: {
      prCount: 47,
      tier: 'FREE' as const,
      limit: 50,
      resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days
    },
    userCount: 8,
    needsUpgrade: true
  },

  // Early usage - should show gentle upgrade prompt
  earlyUsage: {
    usage: {
      prCount: 32,
      tier: 'FREE' as const,
      limit: 50,
      resetDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString() // 20 days
    },
    userCount: 4,
    needsUpgrade: false
  },

  // Professional user - should show no warnings
  professional: {
    usage: {
      prCount: 150,
      tier: 'PROFESSIONAL' as const,
      limit: null,
      resetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    userCount: 12,
    needsUpgrade: false
  },

  // New user - minimal usage
  newUser: {
    usage: {
      prCount: 3,
      tier: 'FREE' as const,
      limit: 50,
      resetDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString() // 25 days
    },
    userCount: 2,
    needsUpgrade: false
  }
};

// Function to get mock data based on scenario
export const getMockUsageData = (scenario: keyof typeof mockUsageScenarios = 'nearLimit') => {
  return mockUsageScenarios[scenario];
};

// Hook to switch between scenarios for testing
export const useMockUsage = () => {
  const scenarios = Object.keys(mockUsageScenarios) as Array<keyof typeof mockUsageScenarios>;
  
  const switchScenario = (scenario: keyof typeof mockUsageScenarios) => {
    const data = mockUsageScenarios[scenario];
    localStorage.setItem('mock-usage-scenario', scenario);
    window.dispatchEvent(new CustomEvent('mock-usage-changed', { detail: data }));
  };
  
  const getCurrentScenario = (): keyof typeof mockUsageScenarios => {
    return (localStorage.getItem('mock-usage-scenario') as keyof typeof mockUsageScenarios) || 'nearLimit';
  };
  
  return {
    scenarios,
    switchScenario,
    getCurrentScenario,
    currentData: mockUsageScenarios[getCurrentScenario()]
  };
};
