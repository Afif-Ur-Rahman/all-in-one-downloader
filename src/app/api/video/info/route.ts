import { NextResponse } from "next/server";

const API_URL = "http://localhost:4000";

export const POST = async (request: Request) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/api/video/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": request.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(40000),
    });

    const data = await response.json();

    console.log("====================================");
    console.log(response);
    console.log("====================================");

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        message:
          "The service is unavailable right now. Please try again shortly.",
      },
      { status: 503 },
    );
  }
};
