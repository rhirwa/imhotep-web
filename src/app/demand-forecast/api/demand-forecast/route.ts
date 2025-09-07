import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  const res = await fetch(`${backendUrl}/forecast/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
