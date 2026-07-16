import { NextResponse } from "next/server";
import { serviceQuerySchema } from "@/lib/validations/service.schema";
import * as serviceService from "@/lib/services/service.service";
import { getCurrentUserId } from "@/lib/temp-auth/get-current-user";
import { handleApiError } from "@/lib/http/handle-error";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId(request);
    const { searchParams } = new URL(request.url);
    const query = serviceQuerySchema.parse(Object.fromEntries(searchParams));

    const result = await serviceService.listOwnServices(userId, query);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}