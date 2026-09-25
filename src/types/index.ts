interface Insight {
    _id: string;
    basalRate: number;
    bmi: number;
    date: string;
    fatMass: number;
    fatPercentage: number;
    filename: string;
    visceralFat: number;
    protein: number;
    userId: string;
    water: number;
    waistAndHips: number;
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}

interface User {
  _id: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { Insight, User }