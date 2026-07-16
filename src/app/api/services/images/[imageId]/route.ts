import { NextResponse } from "next/server";
import * as serviceService from "@/lib/services/service.service";
import { getCurrentUserId } from "@/lib/temp-auth/get-current-user";
import { handleApiError } from "@/lib/http/handle-error";

type RouteContext = { params: Promise<{ imageId: string }> };

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { imageId: imageIdParam } = await params;
    const imageId = Number(imageIdParam);
    if (!Number.isInteger(imageId) || imageId <= 0) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const userId = await getCurrentUserId(request);
    await serviceService.deleteServiceImage(imageId, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}