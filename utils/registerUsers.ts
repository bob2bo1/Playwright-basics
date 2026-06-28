import { faker } from '@faker-js/faker';

export function fakerUsers() {
    return {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
    
}