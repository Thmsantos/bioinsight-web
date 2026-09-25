import { faker } from '@faker-js/faker';
import type { User } from '../../src/types/index';

async function generateUsers(qty: number): Promise<User[]>{
    const users: User[] = new Array<User>()

    for(let x: number = 0; x < qty; x++){
        const user: User = {
            _id: faker.database.mongodbObjectId(),
            email: `user${x + 1}@bioinsight.app`,
            password: faker.internet.password({ length: 20 }),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent()
        }

        users.push(user)
    }

    return users;
}

const mockedUsers = await generateUsers(5)
export { mockedUsers }