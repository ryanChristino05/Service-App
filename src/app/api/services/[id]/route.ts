import { NextResponse } from "next/server";
import { updateServiceSchema } from "@/lib/validations/service.schema";
import * as serviceService from "@/lib/services/service.service";
import { getCurrentUserId } from "@/lib/temp-auth/get-current-user";
import { handleApiError } from "@/lib/http/handle-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const service = await serviceService.getServiceDetail(id);
    return NextResponse.json(service);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const userId = await getCurrentUserId(request);
    const body = await request.json();
    const input = updateServiceSchema.parse(body);

    const service = await serviceService.updateService(id, userId, input);
    return NextResponse.json(service);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const userId = await getCurrentUserId(request);
    await serviceService.deleteService(id, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}