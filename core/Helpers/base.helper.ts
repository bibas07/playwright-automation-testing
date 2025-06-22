import { Locator, Page } from "playwright";

export class BaseHelper {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getRandomValue(options: Locator) {
    const countOptions = await options.count();
    const randomValue = Math.floor(Math.random() * countOptions);
    return randomValue;
  }
}
