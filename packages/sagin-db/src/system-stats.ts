export const SystemStatsCategory = Object.freeze({
  GlobalState: 'global_state',
  Config: 'config',
});

export const SystemStats = Object.freeze({
  InitiatedBy: {
    category: SystemStatsCategory.GlobalState,
    key: 'initiated_by',
  },
});
