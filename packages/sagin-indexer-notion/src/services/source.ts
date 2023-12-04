import { type SourceService } from '@sagin/indexer/services';

export const sourceService: SourceService = {
  async validateLocator(type, id) {
    return {
      kind: 'invalid',
      reason: 'Not implemented yet',
    };
  },
};
