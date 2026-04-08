import { NextResponse } from "next/server";
import countriesData from "@/constants/countries.json";

export async function GET() {
  try {
    return NextResponse.json({ countries: countriesData });
  } catch (error) {
    console.error("Error fetching countries data:", error);
    return NextResponse.json({ countries: null }, { status: 500 });
  }
}
