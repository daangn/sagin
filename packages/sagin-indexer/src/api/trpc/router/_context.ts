import { type SourceService } from '@sagin/indexer/services';

type RequiredServices = {
  source: SourceService;
};

export type TrpcContext = {
  services: RequiredServices;
};
