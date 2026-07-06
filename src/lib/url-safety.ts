import { isIP } from "node:net";

/**
 * SSRF guard for the image/streaming proxies: only allow public http(s) URLs,
 * never localhost or private/link-local ranges.
 */
export function isPublicHttp(target: string): boolean {
  let u: URL;
  try {
    u = new URL(target);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  const normalizedHost = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
  if (
    normalizedHost === "localhost" ||
    normalizedHost === "0.0.0.0" ||
    normalizedHost.endsWith(".local") ||
    /^127\./.test(normalizedHost) ||
    /^10\./.test(normalizedHost) ||
    /^192\.168\./.test(normalizedHost) ||
    /^169\.254\./.test(normalizedHost) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(normalizedHost)
  ) {
    return false;
  }
  if (isPrivateIpv6(normalizedHost)) return false;
  return true;
}

function isPrivateIpv6(host: string): boolean {
  if (isIP(host) !== 6) return false;
  const expanded = expandIpv6(host);
  if (!expanded) return false;
  const parts = expanded.split(":");

  if (expanded === "0000:0000:0000:0000:0000:0000:0000:0001") return true;

  const first = parts[0];

  return (
    first.startsWith("fc") ||
    first.startsWith("fd") ||
    (first >= "fe80" && first <= "febf") ||
    (parts.slice(0, 6).join(":") === "0000:0000:0000:0000:0000:ffff" &&
      isPrivateMappedIpv4(parts.slice(6).join(":")))
  );
}

function isPrivateMappedIpv4(tail: string): boolean {
  const parts = tail.split(":").map((part) => parseInt(part, 16));
  if (parts.length !== 2 || parts.some(Number.isNaN)) return false;
  const octets = [parts[0] >> 8, parts[0] & 255, parts[1] >> 8, parts[1] & 255];
  const ipv4 = octets.join(".");

  return (
    ipv4 === "0.0.0.0" ||
    /^127\./.test(ipv4) ||
    /^10\./.test(ipv4) ||
    /^192\.168\./.test(ipv4) ||
    /^169\.254\./.test(ipv4) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ipv4)
  );
}

function expandIpv6(host: string): string | null {
  const [left, right = ""] = host.split("::");
  const leftParts = left ? left.split(":").filter(Boolean) : [];
  const rightParts = right ? right.split(":").filter(Boolean) : [];

  if (host.includes("::")) {
    const missing = 8 - (leftParts.length + rightParts.length);
    if (missing < 0) return null;
    return [...leftParts, ...Array(missing).fill("0"), ...rightParts]
      .map((part) => part.padStart(4, "0"))
      .join(":");
  }

  if (leftParts.length !== 8) return null;
  return leftParts.map((part) => part.padStart(4, "0")).join(":");
}
