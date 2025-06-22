import { Locator, Page } from "playwright";
import { FormHelper } from "./form.helper";
import { URL_ROUTES } from "../core/Constants/api.constants";
import { expect } from "playwright/test";
import { step } from "../core/Utils/common.utils";

export interface TableProps {
  firstName: string;
  lastName: string;
  userEmail: string;
  age: string;
  salary: string;
  department: string;
}

const TABLE_SCHEMA = {
  firstName: {
    type: "text",
    required: true,
  },

  lastName: {
    type: "text",
    required: true,
  },

  userEmail: {
    type: "text",
    required: true,
  },

  age: {
    type: "text",
    required: true,
  },

  salary: {
    type: "text",
    required: true,
  },

  department: {
    type: "text",
    required: true,
  },
};

export class TableHelper extends FormHelper {
  private readonly tableHeading: Locator;
  constructor(page: Page) {
    super(page);
    this.tableHeading = page.getByRole("heading", { name: "Web Tables" });
  }

  @step("navigate to table")
  public async init() {
    await this.page.goto(URL_ROUTES.TABLE);
  }

  @step("Is table heading visible")
  public async isTableHeadingVisible() {
    const isVisible = await this.tableHeading.isVisible();
    expect(isVisible).toBe(true);
  }

  private async clickAddTableButton() {
    const locateButton = this.page.getByRole("button", { name: "Add" });
    await locateButton.click();
  }

  public async verifyFormModalTitle() {
    const modalTitle = "Registration Form";
    await this.checkModalTitle(modalTitle);

    await this.closeModal();
  }

  @step("submit table form")
  public async submitTableForm(tableDetails: TableProps) {
    await this.clickAddTableButton();
    await this.fillFormInformation(TABLE_SCHEMA, tableDetails);
    await this.formSubmit();
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

  private async findRowInListing(query: string, columnName: string) {
    const index = await this.findColumnIndex(columnName);
    const container = this.listingContainer();

    const rowGroup = container.locator(
      `//div[@role='rowgroup'] //div[@role='row'] //div[@role='gridcell'][${
        index + 1
      }][text()='${query}']//ancestor::div[@role='row']`
    );

    return rowGroup;
  }

  private async getFirstTableRow() {
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

  private async getCellText(row: Locator, columnName: string) {
    const cell = await this.getCell(row, columnName);
    return await cell.innerText();
  }

  private async getListingButton(row: Locator, buttonName: "Edit" | "Delete") {
    const cell = await this.getCell(row, "Action");
    const button = cell.locator(`//span[@title="${buttonName}"]`);

    return button;
  }

  public async openEditActionForm(row: Locator) {
    const button = await this.getListingButton(row, "Edit");
    await button.click();

    await this.checkModalTitle("Registration Form");
  }

  private async checkTableInList(query: string, columnName: string) {
    await this.searchInList(query);
    const row = await this.findRowInListing(query, columnName);
    await expect(row).toBeVisible();
  }

  @step("check table by first name")
  public async checkTableByFirstName(query: string) {
    await this.checkTableInList(query, "First Name");
  }

  @step("check table by last name")
  public async checkTableByLastName(query: string) {
    await this.checkTableInList(query, "Last Name");
  }

  @step("check table by age")
  public async checkTableByAge(query: string) {
    await this.checkTableInList(query, "Age");
  }

  @step("check table by email")
  public async checkTableByEmail(query: string) {
    await this.checkTableInList(query, "Email");
  }

  @step("check table by salary")
  public async checkTableBySalary(query: string) {
    await this.checkTableInList(query, "Salary");
  }

  @step("check table by department")
  public async checkTableByDepartment(query: string) {
    await this.checkTableInList(query, "Department");
  }

  @step("edit table form")
  public async editTable(tablesData: TableProps) {
    const row = await this.getFirstTableRow();
    await this.openEditActionForm(row);
    await this.fillFormInformation(TABLE_SCHEMA, tablesData);
    await this.formSubmit();
  }

  @step("delete row")
  public async deleteRowFromListing() {
    const row = await this.getFirstTableRow();
    const cellText = await this.getCellText(row, "First Name");

    const button = await this.getListingButton(row, "Delete");
    await button.click();

    const deletedRow = await this.findRowInListing(cellText, "First Name");
    await expect(deletedRow).not.toBeVisible();
  }
}
