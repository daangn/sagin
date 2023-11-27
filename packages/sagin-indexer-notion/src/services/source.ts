import { type SourceService } from '@sagin/indexer/services';

export const sourceService: SourceService = {
  async validateSourceLocator(type, id) {
    return {
      kind: 'invalid',
      reason: 'Not implemented yet',
    };
  },
};
