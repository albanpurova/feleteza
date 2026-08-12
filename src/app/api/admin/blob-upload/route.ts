import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Ngarkim direkt klient → Vercel Blob (pa limitin 4.5MB të serverit).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Vetëm admini i loguar mund të marrë token ngarkimi
        const session = await getSession();
        if (!session) throw new Error("I paautorizuar");
        return {
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "video/mp4", "video/webm", "video/ogg", "video/quicktime",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 1024 * 1024 * 1024, // 1GB
        };
      },
      onUploadCompleted: async () => {
        // Opsionale: mund të ruash diçka pas përfundimit
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
