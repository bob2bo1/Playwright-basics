import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  get loginLink() {
    return this.page.getByRole('link', { name: 'Log In' });
  }

  get email() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get password() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Log In' });
  }

  get logoutButton() {
    return this.page.getByRole('button', { name: 'Log Out' });
  }

  get errorMessage() {
    return this.page.getByText('Sorry, those credentials do not match');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async navigateToLogin() {
    await this.page.goto('/');
    await this.loginLink.click();
  }
}
