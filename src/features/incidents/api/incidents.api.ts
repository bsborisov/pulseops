import { patchJson } from "@/lib/http";
import type {
  Incident,
  IncidentStatus,
} from "@shared/monitoring";

export interface UpdateIncidentStatusInput {
  incidentId: string;
  status: IncidentStatus;
}

export function updateIncidentStatus(
  input:
    UpdateIncidentStatusInput,
) {
  return patchJson<
    Incident,
    {
      status:
      IncidentStatus;
    }
  >(
    `/api/incidents/${encodeURIComponent(
      input.incidentId,
    )}`,
    {
      status:
        input.status,
    },
  );
}