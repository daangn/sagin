import { type SourceService } from './source.ts';
import { type SystemService } from './system.ts';

export type RequiredServices = {
  system: SystemService;
  source: SourceService;
};

export type Context = {
  services: RequiredServices;
};
