import { Page } from "playwright";
import { expect } from "playwright/test";

export class DemoModalHelper {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  private getModalContainer() {
    const modal = this.page.getByRole("document").getByRole("dialog");
    return modal;
  }

  private async getModalTitle() {
    const modal = this.getModalContainer();
    await expect(modal).toBeVisible();
    const title = await modal.locator("div.modal-header").textContent();
    return title;
  }

  public async waitForModalClose() {
    const modal = this.getModalContainer();
    await expect(modal).not.toBeVisible();
  }

  public async closeModal() {
    const modal = this.getModalContainer();
    const closeButton = modal.getByRole("button", { name: "Close" });
    await closeButton.click();
    await this.verifyModalIsClosed();
  }

  private async verifyModalIsClosed() {
    const modal = this.getModalContainer();
    await expect(modal).not.toBeVisible();
  }

  public async checkModalTitle(value: string) {
    const title = await this.getModalTitle();
    expect(title).toContain(value);
  }
}
