import { type SourceService } from './source';
import { type SystemService } from './system';

export type RequiredServices = {
  system: SystemService;
  source: SourceService;
};

export type Context = {
  services: RequiredServices;
};
