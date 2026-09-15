import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateIncidentStatus,
  type UpdateIncidentStatusInput,
} from "@/features/incidents/api/incidents.api";

import {
  replaceIncidentInSnapshot,
  setIncidentStatusInSnapshot,
} from "@/features/incidents/lib/incident-cache";

import {
  overviewKeys,
} from "@/features/overview/queries/overview.queries";

import type {
  Incident,
  OverviewSnapshot,
} from "@shared/monitoring";

interface MutationContext {
  previousIncident:
  | Incident
  | undefined;
}

export function useUpdateIncidentStatusMutation() {
  const queryClient =
    useQueryClient();

  return useMutation<
    Incident,
    Error,
    UpdateIncidentStatusInput,
    MutationContext
  >({
    mutationKey: [
      "incidents",
      "update-status",
    ],

    mutationFn:
      updateIncidentStatus,

    onMutate: async (
      variables,
    ) => {
      await queryClient.cancelQueries({
        queryKey:
          overviewKeys.snapshot(),
      });

      const snapshot =
        queryClient.getQueryData<OverviewSnapshot>(
          overviewKeys.snapshot(),
        );

      const previousIncident =
        snapshot?.incidents.find(
          (incident) =>
            incident.id ===
            variables.incidentId,
        );

      if (snapshot) {
        queryClient.setQueryData(
          overviewKeys.snapshot(),

          setIncidentStatusInSnapshot(
            snapshot,
            variables.incidentId,
            variables.status,
            new Date().toISOString(),
          ),
        );
      }

      return {
        previousIncident,
      };
    },

    onError: (
      _error,
      _variables,
      context,
    ) => {
      if (
        !context
          ?.previousIncident
      ) {
        return;
      }

      queryClient.setQueryData<OverviewSnapshot>(
        overviewKeys.snapshot(),
        (current) => {
          if (!current) {
            return current;
          }

          return replaceIncidentInSnapshot(
            current,
            context.previousIncident,
          );
        },
      );
    },

    onSuccess: (
      incident,
    ) => {
      queryClient.setQueryData<OverviewSnapshot>(
        overviewKeys.snapshot(),
        (current) => {
          if (!current) {
            return current;
          }

          return replaceIncidentInSnapshot(
            current,
            incident,
          );
        },
      );
    },
  });
}