import { type SourceService } from '@sagin/indexer/services';

export const sourceService: SourceService = {
  async validateSourceId(id) {
    return false;
  },
};
