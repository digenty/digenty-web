import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.countrystatecity.in/v1/countries", {
      headers: { "X-CSCAPI-KEY": process.env.COUNTRY_STATE_API_KEY },
    });
    const countries = await response.json();
    return NextResponse.json({ countries });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log(error, "####");
    return NextResponse.json({ countries: null }, { status: 500 });
  }
}
