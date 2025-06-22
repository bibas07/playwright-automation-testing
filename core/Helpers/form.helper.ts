import { Locator, Page } from "playwright";
import { ObjectDto } from "../Types/common.types";
import { AccessNestedObject } from "../Utils/common.utils";
import { expect } from "playwright/test";
import { BaseHelper } from "./base.helper";

export class DemoFormHelper extends BaseHelper {
  constructor(page: Page) {
    super(page);
  }

  private async checkRadioButton(name: string, value: string) {
    const element = this.page.locator(
      `//input[@type='radio'][@name='${name}'][@value='${value}']//parent::div`
    );
    await expect(element).toBeVisible();
    await element.click();
  }

  private locateInputField(name: string) {
    const field = this.page.locator(`//input[@id='${name}']`);
    return field;
  }

  public async checkElementIsVisible(elementLocator: Locator) {
    const isVisible = await this.isElementVisible(elementLocator);
    expect(isVisible).toBe(true);
  }

  public async checkElementIsEnable(elementLocator: Locator) {
    const isEnabled = await this.isElementEnable(elementLocator);
    expect(isEnabled).toBe(true);
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

  private async isElementEnable(elementLocator: Locator) {
    const isElementEnable = await elementLocator.isEnabled();
    return isElementEnable;
  }

  private async fillInput(name: string, value: string) {
    const inputField = this.locateInputField(name);

    await this.checkElementIsVisible(inputField);
    await this.checkElementIsEnable(inputField);

    await inputField.fill(value);
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

  private async checkCheckboxButton(value: string) {
    const element = this.page.locator(
      `//label[text()='${value}']//parent::div`
    );

    await expect(element).toBeVisible();

    await element.click();
  }

  private async uploadFile() {
    await this.page.setInputFiles("#uploadPicture", "assets/student.jpg");
  }

  public async fillFormInformation(
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

  public async formSubmit(submitButton: string = "Submit") {
    const button = this.page.getByRole("button", { name: submitButton });
    await this.checkElementIsVisible(button);
    await this.checkElementIsEnable(button);
    await button.click();
  }
}
