export const mockReportsData = {
  earnings: {
    totalIncome: 500,
    totalExpenses: 105,
    totalProfit: 395,
    margin: 79,
    monthly: {
      income: 0,
      trips: 0,
      expenses: 0,
      profit: 0,
      margin: 0,
    },
    trips: [],
  },
  expenses: {
    fuel: 80,
    allowance: 25,
    details: [
      {
        date: "29/2/2024",
        type: "Combustible",
        description: "Gasolina para el viaje",
        amount: 80,
        trip: "Ciudad A → Ciudad B",
      },
      {
        date: "29/2/2024",
        type: "Viático",
        description: "Alimentación del chofer",
        amount: 25,
        trip: "Ciudad A → Ciudad B",
      },
    ],
  },
  allowances: {
    total: 25,
    details: [
      {
        date: "29/2/2024",
        description: "Viático por alimentación",
        amount: 25,
        trip: "Ciudad A → Ciudad B",
      },
    ],
  },
};
