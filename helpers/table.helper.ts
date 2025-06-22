import { Locator, Page } from "playwright";
import { URL_ROUTES } from "../core/Constants/api.constants";
import { expect } from "playwright/test";
import { step } from "../core/Utils/common.utils";
import { DemoModalHelper } from "../core/Helpers/modal.helper";
import { DemoFormHelper } from "../core/helpers/form.helper";
import { BaseHelper } from "../core/helpers/base.helper";
import { DemoListingHelper } from "../core/helpers/listing.helper";

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

export class TableHelper extends BaseHelper {
  private readonly tableHeading: Locator;
  protected readonly demoFormHelper: DemoFormHelper;
  protected readonly demoModalHelper: DemoModalHelper;
  protected readonly demoListingHelper: DemoListingHelper;

  constructor(page: Page) {
    super(page);
    this.demoFormHelper = new DemoFormHelper(page);
    this.demoModalHelper = new DemoModalHelper(page);
    this.demoListingHelper = new DemoListingHelper(page);

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
    await this.demoModalHelper.checkModalTitle(modalTitle);

    await this.demoModalHelper.closeModal();
  }

  @step("submit table form")
  public async submitTableForm(tableDetails: TableProps) {
    await this.clickAddTableButton();
    await this.demoFormHelper.fillFormInformation(TABLE_SCHEMA, tableDetails);
    await this.demoFormHelper.formSubmit();
    await this.demoModalHelper.waitForModalClose();
  }

  public async openEditActionForm(row: Locator) {
    const button = await this.demoListingHelper.getListingButton(row, "Edit");
    await button.click();

    await this.demoModalHelper.checkModalTitle("Registration Form");
  }

  @step("check table by first name")
  public async checkTableByFirstName(query: string) {
    await this.demoListingHelper.checkTableInList(query, "First Name");
  }

  @step("check table by last name")
  public async checkTableByLastName(query: string) {
    await this.demoListingHelper.checkTableInList(query, "Last Name");
  }

  @step("check table by age")
  public async checkTableByAge(query: string) {
    await this.demoListingHelper.checkTableInList(query, "Age");
  }

  @step("check table by email")
  public async checkTableByEmail(query: string) {
    await this.demoListingHelper.checkTableInList(query, "Email");
  }

  @step("check table by salary")
  public async checkTableBySalary(query: string) {
    await this.demoListingHelper.checkTableInList(query, "Salary");
  }

  @step("check table by department")
  public async checkTableByDepartment(query: string) {
    await this.demoListingHelper.checkTableInList(query, "Department");
  }

  @step("edit table form")
  public async editTable(tablesData: TableProps) {
    const row = await this.demoListingHelper.getFirstTableRow();
    await this.openEditActionForm(row);
    await this.demoFormHelper.fillFormInformation(TABLE_SCHEMA, tablesData);
    await this.demoFormHelper.formSubmit();
  }

  @step("delete row")
  public async deleteRowFromListing() {
    const row = await this.demoListingHelper.getFirstTableRow();
    const cellText = await this.demoListingHelper.getCellText(
      row,
      "First Name"
    );

    const button = await this.demoListingHelper.getListingButton(row, "Delete");
    await button.click();

    const deletedRow = await this.demoListingHelper.findRowInListing(
      cellText,
      "First Name"
    );
    await expect(deletedRow).not.toBeVisible();
  }
}
