import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { URL_ROUTES } from "../core/Constants/api.constants";
import { ObjectDto } from "../core/Types/common.types";
import { AccessNestedObject, step } from "../core/Utils/common.utils";

export interface FormProps {
  firstName: string;
  lastName: string;
  userEmail?: string;
  gender: "Male" | "Female" | "Other";
  userNumber?: string;
  dateOfBirthInput?: string;
  subjectsInput?: string;
  hobbies?: "Sports" | "Reading" | "Music";
  pictire?: boolean;
  "Current Address"?: string;
}

const FORM_SCHEMA = {
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
  },

  gender: {
    type: "radio",
    required: true,
  },

  userNumber: {
    type: "number",
    required: true,
  },

  dateOfBirthInput: {
    type: "date",
  },

  subjectsInput: {
    type: "reference_select",
  },

  hobbies: {
    type: "checkbox",
  },

  picture: {
    type: "file",
  },

  "Current Address": {
    type: "textarea",
  },
};

const DUMMPY_DATA: FormProps = {
  firstName: "John",
  lastName: "Doe",
  userEmail: "hello@gmail.com",
  gender: "Male",
  userNumber: "9812312323",
  // dateOfBirthInput:''
  subjectsInput: "Social Studies",
  hobbies: "Sports",
  pictire: true,
  "Current Address": "USA",
};

export class FormHelper {
  protected readonly page: Page;
  private readonly formHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formHeading = page.getByRole("heading", { name: "Practice Form" });
  }

  @step("navigate to Form")
  public async init() {
    await this.page.goto(URL_ROUTES.FORM);
  }

  public async isFormHeadingVisible() {
    const isVisible = await this.formHeading.isVisible();
    expect(isVisible).toBe(true);
  }

  private locateInputField(name: string) {
    const field = this.page.locator(`//input[@id='${name}']`);
    return field;
  }

  private async filInputById(value: string) {
    const locateInput = this.page.locator("#currentAddress");
    await expect(locateInput).toBeVisible();

    await locateInput.fill(value);
  }

  private async isElementVisible(elementLocator: Locator) {
    const isVisible = await elementLocator.isVisible();
    return isVisible;
  }

  private async checkElementIsEmpty(elementLocator: Locator) {
    await expect(elementLocator).toBeEmpty();
  }

  private async isElementEnable(elementLocator: Locator) {
    const isElementEnable = await elementLocator.isEnabled();
    return isElementEnable;
  }

  private async checkElementIsVisible(elementLocator: Locator) {
    const isVisible = await this.isElementVisible(elementLocator);
    expect(isVisible).toBe(true);
  }

  private async checkElementIsEnable(elementLocator: Locator) {
    const isEnabled = await this.isElementEnable(elementLocator);
    expect(isEnabled).toBe(true);
  }

  private async fillInput(name: string, value: string) {
    const inputField = this.locateInputField(name);

    await this.checkElementIsVisible(inputField);
    await this.checkElementIsEnable(inputField);

    await inputField.fill(value);
  }

  private getInputWrapper(id: string) {
    const locateWrapper = this.page.locator(`#${id}`);
    return locateWrapper;
  }

  private async checkRadioButton(name: string, value: string) {
    const element = this.page.locator(
      `//input[@type='radio'][@name='${name}'][@value='${value}']//parent::div`
    );

    await expect(element).toBeVisible();

    await element.click();
  }

  private async checkCheckboxButton(value: string) {
    const element = this.page.locator(
      `//label[text()='${value}']//parent::div`
    );

    await expect(element).toBeVisible();

    await element.click();
  }

  private getSelectBoxContainer() {
    const container = this.page.locator("div.subjects-auto-complete__menu");

    return container;
  }

  private locateSelectBoxElement(value: string) {
    const container = this.getSelectBoxContainer();
    const locateList = container.locator(
      "div.subjects-auto-complete__menu-list"
    );
    const item = locateList
      .locator("div.subjects-auto-complete__option")
      .getByText(value, { exact: true });

    return item;
  }

  private async selectInputItem(name: string, value: string) {
    await this.fillInput(name, value);
    const item = this.locateSelectBoxElement(value);

    await this.checkElementIsVisible(item);

    await item.click();
  }

  private async uploadFile() {
    await this.page.setInputFiles("#uploadPicture", "./assets/student.jpg");
  }

  protected async getRandomValue(options: Locator) {
    const countOptions = await options.count();
    const randomValue = Math.floor(Math.random() * countOptions);

    return randomValue;
  }

  private async selectRandomOption() {
    const container = this.page.locator('//div[contains(@class,"-menu")]');
    const options = container.locator('//div[contains(@class,"-option")]');

    const value = await this.getRandomValue(options);
    await options.nth(value).click();
  }

  private async selectState() {
    const locateState = this.page.locator("#state");
    await locateState.click();

    await this.selectRandomOption();
  }

  private async selectCity() {
    const locateState = this.page.locator("#city");
    await locateState.click();

    await this.selectRandomOption();
  }

  protected async fillFormInformation(
    formSchema: ObjectDto,
    data: ObjectDto,
    ignoreField: string[] = []
  ) {
    for (const [key, schema] of Object.entries(formSchema)) {
      const name = schema?.name ?? key;
      const value = AccessNestedObject(data, name) ?? "";
      if (ignoreField.includes(name)) continue;
      if (!value) continue;

      switch (schema?.type) {
        case "radio":
          await this.checkRadioButton(name, value);
          break;

        case "date":
          await this.fillInput(name, value);
          break;

        case "checkbox":
          await this.checkCheckboxButton(value);
          break;

        case "reference_select":
          await this.selectInputItem(name, value);
          break;

        case "file":
          await this.uploadFile();
          break;

        case "textarea":
          await this.filInputById(value);
          break;

        default:
          await this.fillInput(name, value);
      }
    }
  }

  protected async formSubmit(submitButton: string = "Submit") {
    const button = this.page.getByRole("button", { name: submitButton });

    await this.checkElementIsVisible(button);
    await this.checkElementIsEnable(button);

    await button.click();
  }

  @step("fill form information")
  public async submitStudentRegistrationForm(formData: FormProps) {
    await this.fillFormInformation(FORM_SCHEMA, formData);
    await this.selectState();
    await this.selectCity();

    await this.formSubmit();
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

  public async checkModalTitle(value: string) {
    const title = await this.getModalTitle();
    expect(title).toContain(value);
  }

  @step("check modal title then close")
  public async verifyFormModalTitle() {
    const modalTitle = "Thanks for submitting the form";
    await this.checkModalTitle(modalTitle);

    await this.closeModal();
  }

  protected async closeModal() {
    const modal = this.getModalContainer();
    const closeButton = modal.getByRole("button", { name: "Close" });

    await closeButton.click();
    await this.verifyModalIsClosed();
  }

  private async verifyModalIsClosed() {
    const modal = this.getModalContainer();

    await expect(modal).not.toBeVisible();
  }

  private async checkAllInputError(id: string | string[]) {
    if (!Array.isArray(id)) return [id];

    for (let input of id) {
      const selector = `#${input}.form-control`;
      const isInvalid = await this.page.$eval(selector, (el) =>
        el.matches(":invalid")
      );

      expect(isInvalid).toBe(true);
    }
  }

  public async emptyFormSubmit() {
    await this.formSubmit();
    await this.checkAllInputError(["firstName", "lastName", "userNumber"]);
  }

  public async emptyFirstName() {
    await this.fillFormInformation(FORM_SCHEMA, DUMMPY_DATA, ["firstName"]);
    await this.formSubmit();
    await this.checkAllInputError(["firstName"]);
  }

  public async emptyLastName() {
    await this.fillFormInformation(FORM_SCHEMA, DUMMPY_DATA, ["lastName"]);
    await this.formSubmit();
    await this.checkAllInputError(["lastName"]);
  }
  public async emptyMobileNumber() {
    await this.fillFormInformation(FORM_SCHEMA, DUMMPY_DATA, ["userNumber"]);
    await this.formSubmit();
    await this.checkAllInputError(["userNumber"]);
  }
}
