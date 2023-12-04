import { type ValueOf } from '@sagin/core/utils';

export const DataProtectionPolicy = Object.freeze({
  /**
   * Data must be protected, so it will never be shared with external APIs
   */
  Restricted: 'restricted',

  /**
   * Data might be shared for its purpose, like to request text embeddings to external AI models.
   */
  Relaxed: 'relaxed',
});

export type DataProtectionPolicy = ValueOf<typeof DataProtectionPolicy>;
