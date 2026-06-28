import { Page } from "@playwright/test";

export class RegisterPage {
    constructor(private page: Page) {
        
    }
    get firstName() {
        return this.page.getByLabel('First Name');
    }
    get lastName() {
        return this.page.getByLabel('Last Name');
    }
    get email() {
        return this.page.getByLabel('Email');
    }
    get password() {
        return this.page.getByRole('textbox', { name: /^Password$/ });
    }
    get confirmPassword() {
        return this.page.getByLabel('Confirm Password');
    }
    get registerButton() {
        return this.page.getByRole('button', { name: 'Register' });
    }
    get logoutButton() {
        return this.page.getByRole('button', { name: 'Log Out' });
    }
    async register(firstName: string, lastName: string, email: string, password: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.confirmPassword.fill(password);
        await this.registerButton.click();
    }
}
