export const SystemStateCategory = Object.freeze({
  GlobalState: 'global_state',
});

export const SystemState = Object.freeze({
  InitiatedBy: {
    category: SystemStateCategory.GlobalState,
    key: 'initiated_by',
  },
});
