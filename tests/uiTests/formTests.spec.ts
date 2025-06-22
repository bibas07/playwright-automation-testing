import test from "playwright/test";
import { FormHelper } from "../../helpers/form.helper";

test.describe("Form", async () => {
  const FormData: FormProps = {
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

  test("Is form accessible through URL", async ({ page }) => {
    const formHelper = new FormHelper(page);

    await formHelper.init();
    await formHelper.isFormHeadingVisible();
  });

  test("Is Student can be registered", async ({ page }) => {
    const formHelper = new FormHelper(page);

    await formHelper.init();
    await formHelper.submitStudentRegistrationForm(FormData);
    await formHelper.verifyFormModalTitle();
  });

  test("empty form submission", async ({ page }) => {
    const formHelper = new FormHelper(page);

    await formHelper.init();
    await formHelper.emptyFormSubmit();
  });

  test("empty firstname form submission", async ({ page }) => {
    const formHelper = new FormHelper(page);

    await formHelper.init();
    await formHelper.emptyFirstName();
  });

  test("empty lastname form submission", async ({ page }) => {
    const formHelper = new FormHelper(page);

    await formHelper.init();
    await formHelper.emptyLastName();
  });

  test("empty mobile number form submission", async ({ page }) => {
    const formHelper = new FormHelper(page);

    await formHelper.init();
    await formHelper.emptyMobileNumber();
  });
});
