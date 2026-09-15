import type {
  Incident,
  IncidentStatus,
  OverviewSnapshot,
} from "@shared/monitoring";

export function setIncidentStatusInSnapshot(
  snapshot:
    OverviewSnapshot,
  incidentId: string,
  status: IncidentStatus,
  updatedAt: string,
): OverviewSnapshot {
  return {
    ...snapshot,

    incidents:
      snapshot.incidents.map(
        (incident) =>
          incident.id ===
            incidentId
            ? {
              ...incident,
              status,
              updatedAt,
            }
            : incident,
      ),
  };
}

export function replaceIncidentInSnapshot(
  snapshot:
    OverviewSnapshot,
  incident: Incident,
): OverviewSnapshot {
  return {
    ...snapshot,

    incidents:
      snapshot.incidents.map(
        (current) =>
          current.id ===
            incident.id
            ? incident
            : current,
      ),
  };
}