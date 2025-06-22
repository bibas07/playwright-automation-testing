import { Locator, Page } from "playwright";
import { BaseHelper } from "./base.helper";
import { expect } from "playwright/test";

export class DemoListingHelper extends BaseHelper {
  constructor(page: Page) {
    super(page);
  }

  private async searchInList(query: string) {
    const locateInput = this.page.locator('//input[@id="searchBox"]');
    await locateInput.fill(query);
    await this.page.keyboard.press("Enter");
  }

  private listingContainer() {
    const container = this.page.getByRole("grid");
    return container;
  }

  private getListingRow() {
    const container = this.page.getByRole("row");
    return container;
  }

  private getListingRowGroup() {
    const rowGroup = this.page.getByRole("rowgroup").getByRole("row");
    return rowGroup;
  }

  private async getRandomRowGroup() {
    const rowGroup = this.getListingRowGroup();
    const randomRow = await this.getRandomValue(rowGroup);

    return rowGroup.nth(randomRow);
  }

  private getListingHeader() {
    const container = this.listingContainer();
    const row = container.locator(this.getListingRow());
    const heading = row.getByRole("columnheader").allInnerTexts();
    return heading;
  }

  private async findColumnIndex(columnName: string) {
    const heading = await this.getListingHeader();

    return heading.indexOf(columnName);
  }

  public async findRowInListing(query: string, columnName: string) {
    const index = await this.findColumnIndex(columnName);
    const container = this.listingContainer();

    const rowGroup = container.locator(
      `//div[@role='rowgroup'] //div[@role='row'] //div[@role='gridcell'][${
        index + 1
      }][text()='${query}']//ancestor::div[@role='row']`
    );

    return rowGroup;
  }

  public async getFirstTableRow() {
    const row = this.getListingRowGroup();
    return row.first();
  }

  private async getLastTableRow() {
    const row = this.getListingRowGroup();
    return row.last();
  }

  private async getCell(row: Locator, columnName: string) {
    const index = await this.findColumnIndex(columnName);
    const cell = row.locator(`//div[@role='gridcell'][${index + 1}]`);
    return cell;
  }

  public async getCellText(row: Locator, columnName: string) {
    const cell = await this.getCell(row, columnName);
    return await cell.innerText();
  }

  public async getListingButton(row: Locator, buttonName: "Edit" | "Delete") {
    const cell = await this.getCell(row, "Action");
    const button = cell.locator(`//span[@title="${buttonName}"]`);

    return button;
  }

  public async checkTableInList(query: string, columnName: string) {
    await this.searchInList(query);
    const row = await this.findRowInListing(query, columnName);
    await expect(row).toBeVisible();
  }
}
