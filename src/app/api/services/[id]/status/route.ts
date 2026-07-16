import { NextResponse } from "next/server";
import { updateStatusSchema } from "@/lib/validations/service.schema";
import * as serviceService from "@/lib/services/service.service";
import { getCurrentUserId } from "@/lib/temp-auth/get-current-user";
import { handleApiError } from "@/lib/http/handle-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const adminUserId = await getCurrentUserId(request);
    const body = await request.json();
    const { statut } = updateStatusSchema.parse(body);

    const service = await serviceService.moderateService(id, adminUserId, statut);
    return NextResponse.json(service);
  } catch (error) {
    return handleApiError(error);
  }
}