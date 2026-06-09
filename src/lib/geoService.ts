/** Shape of the response from ip-api.com */
interface IPApiResponse {
  status: string;
  city: string;
  country: string;
}

/**
 * Resolves an IP address to a human-readable location string using ip-api.com.
 *
 * Passing an empty string to the API causes it to auto-detect the caller's IP,
 * which is the desired behaviour on localhost where the IP is 127.0.0.1/::1.
 *
 * @param ip - IPv4 or IPv6 address to look up
 * @returns Location string like "Bratislava, Slovakia", or undefined if the
 *          lookup fails or the API returns a non-success status
 *
 * @example
 * const location = await getLocationFromIP("8.8.8.8");
 * // "Mountain View, United States"
 */
export async function getLocationFromIP(ip: string): Promise<string | undefined> {
  try {
    // ip-api.com returns "fail" for private/loopback addresses, so we pass an
    // empty string to let the API use the requesting server's public IP instead
    const resolvedIP = (ip === "127.0.0.1" || ip === "::1") ? "" : ip;
    const response = await fetch(`http://ip-api.com/json/${resolvedIP}`);
    const data: IPApiResponse = await response.json();

    if (data.status !== "success") {
      return undefined;
    }

    return `${data.city}, ${data.country}`;
  } catch {
    return undefined;
  }
}
