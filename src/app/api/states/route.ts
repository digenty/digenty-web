import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  try {
    const response = await fetch(`https://api.countrystatecity.in/v1/countries/${code}/states`, {
      headers: { "X-CSCAPI-KEY": process.env.COUNTRY_STATE_API_KEY },
    });
    const states = await response.json();
    return NextResponse.json({ states });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ states: null }, { status: 500 });
  }
}
