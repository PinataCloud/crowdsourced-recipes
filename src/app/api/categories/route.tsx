import pinata from "@/app/pinata";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const groups = await pinata.groups.list();
    return NextResponse.json({ data: groups }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
