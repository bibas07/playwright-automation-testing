import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { URL_ROUTES } from "../core/Constants/api.constants";
import { step } from "../core/Utils/common.utils";
import { DemoModalHelper } from "../core/Helpers/modal.helper";
import { DemoFormHelper } from "../core/Helpers/form.helper";
import { BaseHelper } from "../core/Helpers/base.helper";

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

export class FormHelper extends BaseHelper {
  private readonly formHeading: Locator;
  protected readonly modalHelper: DemoModalHelper;
  protected readonly demoFormHelper: DemoFormHelper;

  constructor(page: Page) {
    super(page);
    this.modalHelper = new DemoModalHelper(page);
    this.demoFormHelper = new DemoFormHelper(page);
    this.formHeading = page.getByRole("heading", { name: "Practice Form" });
  }

  @step("navigate to Form")
  public async init() {
    await this.page.goto(URL_ROUTES.FORM);
  }

  @step("check form heading visible")
  public async isFormHeadingVisible() {
    const isVisible = await this.formHeading.isVisible();
    expect(isVisible).toBe(true);
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

  @step("fill form information")
  public async submitStudentRegistrationForm(formData: FormProps) {
    await this.demoFormHelper.fillFormInformation(FORM_SCHEMA, formData);
    await this.selectState();
    await this.selectCity();
    await this.demoFormHelper.formSubmit();
  }

  @step("check modal title then close")
  public async verifyFormModalTitle() {
    const modalTitle = "Thanks for submitting the form";
    await this.modalHelper.checkModalTitle(modalTitle);
    await this.modalHelper.closeModal();
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

  @step("empty form submit")
  public async emptyFormSubmit() {
    await this.demoFormHelper.formSubmit();
    await this.checkAllInputError(["firstName", "lastName", "userNumber"]);
  }

  @step("empty first name submission")
  public async emptyFirstName() {
    await this.demoFormHelper.fillFormInformation(FORM_SCHEMA, DUMMPY_DATA, [
      "firstName",
    ]);
    await this.demoFormHelper.formSubmit();
    await this.checkAllInputError(["firstName"]);
  }

  @step("empty last name submission")
  public async emptyLastName() {
    await this.demoFormHelper.fillFormInformation(FORM_SCHEMA, DUMMPY_DATA, [
      "lastName",
    ]);
    await this.demoFormHelper.formSubmit();
    await this.checkAllInputError(["lastName"]);
  }

  @step("empty mobile number submission")
  public async emptyMobileNumber() {
    await this.demoFormHelper.fillFormInformation(FORM_SCHEMA, DUMMPY_DATA, [
      "userNumber",
    ]);
    await this.demoFormHelper.formSubmit();
    await this.checkAllInputError(["userNumber"]);
  }
}
