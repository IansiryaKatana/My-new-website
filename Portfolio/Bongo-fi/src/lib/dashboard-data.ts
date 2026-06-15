export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type Wallet = {
  id: string;
  currency: "USD" | "EUR" | "GBP";
  flag: string;
  balance: number;
  monthlyLimitUsed: number;
  monthlyLimit: number;
  status: "active" | "inactive";
};

export type Metric = {
  id: string;
  label: string;
  value: number;
  changePercentage: number;
  period: string;
  type: "earning" | "spending" | "income" | "revenue";
  highlighted?: boolean;
};

export type Transaction = {
  id: string;
  orderId: string;
  activity: string;
  price: number;
  status: "completed" | "pending" | "in_progress";
  date: string;
  icon: "app" | "hotel" | "flight" | "grocery" | "software";
};

export type IncomeChartItem = {
  month: string;
  profit: number;
  loss: number;
};

export type PaymentCard = {
  id: string;
  tone: "black" | "green";
  number: string;
  expiry: string;
  cvv: string;
  status: "Active";
};

export type DashboardOverview = {
  user: DashboardUser;
  totalBalance: number;
  balanceGrowth: number;
  wallets: Wallet[];
  metrics: Metric[];
  spendingLimit: {
    spent: number;
    limit: number;
  };
  cards: PaymentCard[];
  incomeChart: IncomeChartItem[];
  transactions: Transaction[];
};

export async function getDashboardOverviewData(): Promise<DashboardOverview> {
  return {
    user: {
      id: "usr_joseph_bongo",
      name: "Joseph Bongo",
      email: "Josephbongo@yahoo.com",
      avatarUrl: "",
    },
    totalBalance: 689_372,
    balanceGrowth: 5,
    wallets: [
      {
        id: "wal_usd",
        currency: "USD",
        flag: "US",
        balance: 22_678,
        monthlyLimitUsed: 5,
        monthlyLimit: 8,
        status: "active",
      },
      {
        id: "wal_eur",
        currency: "EUR",
        flag: "EU",
        balance: 18_345,
        monthlyLimitUsed: 8,
        monthlyLimit: 8,
        status: "active",
      },
      {
        id: "wal_gbp",
        currency: "GBP",
        flag: "GB",
        balance: 15_000,
        monthlyLimitUsed: 3,
        monthlyLimit: 5,
        status: "inactive",
      },
    ],
    metrics: [
      {
        id: "metric_earnings",
        label: "Total Earnings",
        value: 950,
        changePercentage: 7,
        period: "This month",
        type: "earning",
        highlighted: true,
      },
      {
        id: "metric_spending",
        label: "Total Spending",
        value: 700,
        changePercentage: -5,
        period: "This month",
        type: "spending",
      },
      {
        id: "metric_income",
        label: "Total Income",
        value: 1_050,
        changePercentage: 8,
        period: "This month",
        type: "income",
      },
      {
        id: "metric_revenue",
        label: "Total Revenue",
        value: 850,
        changePercentage: 4,
        period: "This month",
        type: "revenue",
      },
    ],
    spendingLimit: {
      spent: 1_400,
      limit: 5_500,
    },
    cards: [
      {
        id: "card_black",
        tone: "black",
        number: "**** **** 6782",
        expiry: "00/29",
        cvv: "811",
        status: "Active",
      },
      {
        id: "card_green",
        tone: "green",
        number: "**** **** 4356",
        expiry: "04/31",
        cvv: "209",
        status: "Active",
      },
    ],
    incomeChart: [
      { month: "Jan", profit: 37, loss: 24 },
      { month: "Feb", profit: 43, loss: 18 },
      { month: "Mar", profit: 36, loss: 15 },
      { month: "Apr", profit: 40, loss: 13 },
      { month: "May", profit: 44, loss: 17 },
      { month: "Jun", profit: 48, loss: 29 },
      { month: "Jul", profit: 41, loss: 21 },
      { month: "Aug", profit: 34, loss: 16 },
    ],
    transactions: [
      {
        id: "txn_76",
        orderId: "INV_000076",
        activity: "Mobile App Purchase",
        price: 25_500,
        status: "completed",
        date: "17 Apr, 2026 03:45 PM",
        icon: "app",
      },
      {
        id: "txn_75",
        orderId: "INV_000075",
        activity: "Hotel Booking",
        price: 32_750,
        status: "pending",
        date: "15 Apr, 2026 11:30 AM",
        icon: "hotel",
      },
      {
        id: "txn_74",
        orderId: "INV_000074",
        activity: "Flight Ticket Booking",
        price: 40_200,
        status: "completed",
        date: "15 Apr, 2026 12:00 PM",
        icon: "flight",
      },
      {
        id: "txn_73a",
        orderId: "INV_000073",
        activity: "Grocery Purchase",
        price: 50_200,
        status: "in_progress",
        date: "14 Apr, 2026 09:15 PM",
        icon: "grocery",
      },
      {
        id: "txn_73b",
        orderId: "INV_000073",
        activity: "Software License",
        price: 15_900,
        status: "completed",
        date: "10 Apr, 2026 06:00 AM",
        icon: "software",
      },
    ],
  };
}
