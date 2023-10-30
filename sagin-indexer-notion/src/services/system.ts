import { type SystemService } from '@sagin/indexer/services';

export const systemService: SystemService = {
  async healthCheck() {
    return {
      category: 'not_healthy',
      label: 'Unavailable',
      description: 'Not implemented yet',
    };
  },
};
