import { faker } from "@faker-js/faker";
import { Insight } from "../../src/types";

async function generateInsight(userId: string): Promise<Insight> {
    const insight: Insight = {
        _id: faker.database.mongodbObjectId(),
        basalRate: faker.number.int({ min: 1000, max: 3000 }),
        bmi: faker.number.float({ min: 18, max: 30, fractionDigits: 1 }),
        date: faker.date.recent().toLocaleDateString('pt-BR'),
        fatMass: faker.number.float({ min: 5, max: 20, fractionDigits: 1 }),
        fatPercentage: faker.number.float({ min: 8, max: 25, fractionDigits: 1 }),
        filename: faker.system.fileName({ extensionCount: 1 }) + '.pdf',
        visceralFat: faker.number.int({ min: 1, max: 10 }),
        protein: faker.number.float({ min: 8, max: 15, fractionDigits: 1 }),
        userId,
        water: faker.number.float({ min: 35, max: 50, fractionDigits: 1 }),
        waistAndHips: faker.number.float({ min: 0.7, max: 1, fractionDigits: 2 }),
        weight: faker.number.float({ min: 55, max: 90, fractionDigits: 1 }),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
    };

    return insight;
};


export { generateInsight };