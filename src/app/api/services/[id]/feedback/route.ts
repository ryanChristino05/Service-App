import { NextResponse } from "next/server";
import { createFeedbackSchema } from "@/lib/validations/service.schema";
import * as serviceService from "@/lib/services/service.service";
import { getCurrentUserId } from "@/lib/temp-auth/get-current-user";
import { handleApiError } from "@/lib/http/handle-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const userId = await getCurrentUserId(request);
    const body = await request.json();
    const input = createFeedbackSchema.parse(body);

    const feedback = await serviceService.submitFeedback(id, userId, input);
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}