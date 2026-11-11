export const dynamic = "force-static";

export function GET() {
  return Response.json({ version: Number(process.env.NEXT_PUBLIC_KANAKO_BUILD_VERSION) });
}
