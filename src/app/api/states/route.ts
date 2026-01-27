import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  try {
    const apiKey = process.env.COUNTRY_STATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ countries: null }, { status: 500 });
    }
    const response = await fetch(`https://api.countrystatecity.in/v1/countries/${code}/states`, {
      headers: { "X-CSCAPI-KEY": apiKey },
    });
    const states = await response.json();
    return NextResponse.json({ states });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ states: null }, { status: 500 });
  }
}
