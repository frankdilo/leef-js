import {request} from "../src/index";

describe('request', () => {
  it('works', async () => {
    const res = await request("https://google.com");
    expect(res.data).toBe("hello");
    expect(res.status).toBe(200);
  });
});
