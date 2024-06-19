export const sessionKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionKeys.all, "list"] as const,
  list: () => [...sessionKeys.lists()] as const,
  detail: (id: string) => [...sessionKeys.all, id] as const,
  labels: (id: string) => [...sessionKeys.detail(id), "labels"] as const,
};
