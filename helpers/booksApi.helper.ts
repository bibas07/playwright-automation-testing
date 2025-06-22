const BASE_URL = "https://demoqa.com/BookStore";
const BASE_V1_URL = `${BASE_URL}/v1`;
export class ApiHelper {
  public async getAllBooks() {
    const response = await fetch(`${BASE_V1_URL}/Books`);
    return this.buildResponse(response);
  }

  public async getBookByISBN(isbn) {
    const response = await fetch(`${BASE_V1_URL}/Books/${isbn}`);

    return await this.buildResponse(response);
  }

  public async addBook(userId, isbns) {
    const body = {
      userId,
      collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
    };

    const response = await fetch(`${BASE_V1_URL}/Books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return this.buildResponse(response);
  }

  public async updateBook(isbn, title, author) {
    const updatedBook = { isbn, title, author };
    const response = await fetch(`${BASE_V1_URL}/Books/${isbn}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
    });
    return this.buildResponse(response);
  }

  public async deleteBook(isbn) {
    const response = await fetch(`${BASE_V1_URL}/Books/${isbn}`, {
      method: "DELETE",
    });
    return { status: response.status };
  }

  public async buildResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    const status = response.status;
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return { status, body: data };
  }
}
