export interface HttpExceptionBody {
  message?: string;
}

export class HttpException {
  public readonly response: Response;
  public readonly body?: HttpExceptionBody;

  constructor(
    response: Response,
    body?: HttpExceptionBody,
  ) {
    this.response = response;
    if (Array.isArray(body?.message)) {
      this.body = { message: body?.message?.join("\n") };
    } else {
      this.body = body;
    }
  }
}
