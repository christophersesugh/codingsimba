import { http, HttpResponse, type HttpHandler } from "msw";
import { faker } from "@faker-js/faker";

export const handlers: HttpHandler[] = [
  http.put(/^https:\/\/storage\.bunnycdn\.com\/.*$/, async ({ request }) => {
    const body = await request.arrayBuffer();
    const imageUrl = faker.image.url();
    console.log(
      `Mocked file upload to Bunny - received ${body.byteLength} bytes  and returned ${imageUrl}`,
    );
    return HttpResponse.json(imageUrl);
  }),
];
