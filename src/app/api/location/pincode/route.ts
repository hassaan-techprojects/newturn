import { NextRequest, NextResponse } from "next/server";

type PostalOffice = { Name?: string; District?: string; State?: string; Block?: string; Division?: string; Pincode?: string };
type PostalResponse = { Status?: string; PostOffice?: PostalOffice[] };

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get("pincode") ?? "";
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ ok: false, message: "Enter a valid 6-digit pincode." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Postal directory unavailable");
    const payload = (await response.json()) as PostalResponse[];
    const offices = payload[0]?.PostOffice ?? [];
    if (payload[0]?.Status !== "Success" || offices.length === 0) {
      return NextResponse.json({ ok: false, message: "No postal area was found for this pincode." }, { status: 404 });
    }

    const state = offices[0]?.State ?? "";
    const district = offices[0]?.District ?? "";
    const isBengaluru = /karnataka/i.test(state) && /bengaluru|bangalore/i.test(district);
    if (!isBengaluru) {
      return NextResponse.json({
        ok: false,
        serviceable: false,
        message: `This pincode belongs to ${district}, ${state}. NewTurn pickup is currently limited to Bengaluru, Karnataka.`,
        district,
        state,
      }, { status: 200 });
    }

    const areas = [...new Set(offices.map((office) => office.Name).filter((name): name is string => Boolean(name)))];
    return NextResponse.json({
      ok: true,
      serviceable: true,
      pincode,
      district,
      state,
      areas,
      message: `Pincode verified in ${district}, Karnataka.`,
    });
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn't verify this pincode right now. Please try again." }, { status: 503 });
  }
}
