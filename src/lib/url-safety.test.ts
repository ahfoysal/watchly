import { describe, it, expect } from "vitest";
import { isPublicHttp } from "./url-safety";

describe("isPublicHttp (SSRF guard)", () => {
  it("allows public http(s) URLs", () => {
    expect(isPublicHttp("https://hot.planeptune.us/manga/x/0001.png")).toBe(true);
    expect(isPublicHttp("http://cdn.example.com/a.jpg")).toBe(true);
  });

  it("rejects non-http protocols", () => {
    expect(isPublicHttp("file:///etc/passwd")).toBe(false);
    expect(isPublicHttp("ftp://example.com/x")).toBe(false);
    expect(isPublicHttp("data:text/html,hi")).toBe(false);
  });

  it("rejects localhost and private/link-local ranges", () => {
    expect(isPublicHttp("http://localhost:6379")).toBe(false);
    expect(isPublicHttp("http://127.0.0.1/x")).toBe(false);
    expect(isPublicHttp("http://10.0.0.5/x")).toBe(false);
    expect(isPublicHttp("http://192.168.1.10/x")).toBe(false);
    expect(isPublicHttp("http://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isPublicHttp("http://172.16.0.1/x")).toBe(false);
    expect(isPublicHttp("http://printer.local/x")).toBe(false);
  });

  it("rejects garbage", () => {
    expect(isPublicHttp("not a url")).toBe(false);
    expect(isPublicHttp("")).toBe(false);
  });
});
