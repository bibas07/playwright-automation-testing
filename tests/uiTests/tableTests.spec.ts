import test from "playwright/test";
import { TableHelper } from "../../helpers/table.helper";

const randomNumber = Math.floor(Math.random() * 10000000);
test.describe("Table", async () => {
  const TABLE_DATA: TableProps = {
    firstName: `Anne_${randomNumber}`,
    lastName: "Marie",
    userEmail: `testEmail${randomNumber}@gmail.com`,
    age: "23",
    salary: "12312",
    department: "Sales",
  };

  const EDITED_TABLE_DATA: TableProps = {
    firstName: `Post_${randomNumber}`,
    lastName: "Malone",
    userEmail: `editedEmail${randomNumber}@gmail.com`,
    age: "21",
    salary: "123",
    department: "Marketing",
  };

  test("Is table form accessible", async ({ page }) => {
    const tableHelper = new TableHelper(page);

    await tableHelper.init();
    await tableHelper.isTableHeadingVisible();
  });

  test("Add a new record to the table", async ({ page }) => {
    const tableHelper = new TableHelper(page);

    await tableHelper.init();
    await tableHelper.submitTableForm(TABLE_DATA);
    await tableHelper.checkTableByFirstName(TABLE_DATA.firstName);
  });

  test("View a record from the table", async ({ page }) => {
    const tableHelper = new TableHelper(page);

    await tableHelper.init();
    await tableHelper.submitTableForm(TABLE_DATA);
    await tableHelper.checkTableByFirstName(TABLE_DATA.firstName);
    await tableHelper.checkTableByLastName(TABLE_DATA.lastName);
    await tableHelper.checkTableByAge(TABLE_DATA.age);
    await tableHelper.checkTableByEmail(TABLE_DATA.userEmail);
    await tableHelper.checkTableBySalary(TABLE_DATA.salary);
    await tableHelper.checkTableByDepartment(TABLE_DATA.department);
  });

  test("Update an existing record in the table", async ({ page }) => {
    const tableHelper = new TableHelper(page);

    await tableHelper.init();
    await tableHelper.editTable(EDITED_TABLE_DATA);
    await tableHelper.checkTableByFirstName(EDITED_TABLE_DATA.firstName);
  });

  test("Delete a record from the table", async ({ page }) => {
    const tableHelper = new TableHelper(page);

    await tableHelper.init();
    await tableHelper.deleteRowFromListing();
  });
});
