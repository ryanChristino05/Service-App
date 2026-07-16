import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  ServiceNotFoundError,
  ForbiddenServiceActionError,
  LocalisationRequiredError,
  DuplicateFeedbackError,
} from "@/lib/services/service.service";
import { UnauthorizedError ,ForbiddenAdminError} from "@/lib/temp-auth/get-current-user";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Données invalides", details: error.flatten() },
      { status: 400 }
    );
  }
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof ForbiddenAdminError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof ServiceNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof LocalisationRequiredError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
if (error instanceof DuplicateFeedbackError) {
  return NextResponse.json({ error: error.message }, { status: 409 });
}
  console.error("Erreur inattendue:", error);
  return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
}