interface IPApiResponse {
  status: string;
  city: string;
  country: string;
}

export async function getLocationFromIP(ip: string): Promise<string | undefined> {
  try {
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