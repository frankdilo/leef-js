import leef from "../src/index";
import createTestServer from "create-test-server";
import { computeRequestURL } from "../src/utils";

describe("leef", () => {
  describe("successful responses", () => {
    it("GET empty response", async () => {
      const server = await createTestServer();
      server.get("/", (request, response) => {
        response.end();
      });

      const res = await leef.get(server.url);
      expect(res.status).toBe(200);

      await server.close();
    });

    it("GET json", async () => {
      const server = await createTestServer();
      server.get("/user", (request, response) => {
        response.json({ id: 1, username: "frankdilo" });
      });

      const api = leef.instance({ baseURL: server.url });
      const res = await api.get("/user");
      expect(res.data).toEqual({ id: 1, username: "frankdilo" });

      await server.close();
    });

    it("sends request headers", async done => {
      const server = await createTestServer();
      server.get("/", (request, response) => {
        expect(request.headers["x-custom-header"]).toBe("test header value");
        response.end();
        done();
      });

      await leef.get(server.url, { headers: { "x-custom-header": "test header value" } });

      await server.close();
    });

    it("parses response headers", async () => {
      const server = await createTestServer();
      server.get("/", (request, response) => {
        response.set("custom-header", "hello world").end();
      });

      const res = await leef.get(server.url);
      expect(res.headers["custom-header"]).toBe("hello world");

      await server.close();
    });

    it("POST json", async done => {
      const server = await createTestServer();
      server.post("/", (request, response) => {
        expect(request.body["string"]).toBe("hello");
        expect(request.body["number"]).toBe(123);
        response.end();
        done();
      });

      await leef.post(server.url, { string: "hello", number: 123 });

      await server.close();
    });

    it("PUT json", async done => {
      const server = await createTestServer();
      server.put("/", (request, response) => {
        expect(request.body["string"]).toBe("hello");
        expect(request.body["number"]).toBe(123);
        response.end();
        done();
      });

      await leef.put(server.url, { string: "hello", number: 123 });

      await server.close();
    });

    it("PATCH json", async done => {
      const server = await createTestServer();
      server.patch("/", (request, response) => {
        expect(request.body["string"]).toBe("hello");
        expect(request.body["number"]).toBe(123);
        response.end();
        done();
      });

      await leef.patch(server.url, { string: "hello", number: 123 });

      await server.close();
    });

    it("DELETE", async () => {
      const server = await createTestServer();
      server.delete("/", (request, response) => {
        response.end();
      });

      const res = await leef.delete(server.url);
      expect(res.status).toBe(200);

      await server.close();
    });

    it("HEAD", async () => {
      const server = await createTestServer();
      server.head("/", (request, response) => {
        response.end();
      });

      const res = await leef.head(server.url);
      expect(res.status).toBe(200);

      await server.close();
    });

    it("OPTIONS", async () => {
      const server = await createTestServer();
      server.options("/", (request, response) => {
        response.end();
      });

      const res = await leef.options(server.url);
      expect(res.status).toBe(200);

      await server.close();
    });
  });
});

describe("utils", () => {
  describe("computeRequestURL", () => {
    it("returns the correct url when both params provided", () => {
      const res = computeRequestURL("/users", "https://api.example.com");
      expect(res).toBe("https://api.example.com/users");
    });
    it("normalizes trailing and leading slashes", () => {
      const sameURL = "https://api.example.com/users";
      expect(computeRequestURL("users", "https://api.example.com")).toBe(sameURL);
      expect(computeRequestURL("/users", "https://api.example.com")).toBe(sameURL);
      expect(computeRequestURL("users", "https://api.example.com/")).toBe(sameURL);
      expect(computeRequestURL("/users", "https://api.example.com/")).toBe(sameURL);
    });
    it("ignores baseURL when path has protocol", () => {
      expect(computeRequestURL("https://google.com", "https://api.example.com/")).toBe("https://google.com");
    });
    it("works with just one param", () => {
      expect(computeRequestURL("https://google.com")).toBe("https://google.com");
    });
  });
});
