type LocatorValidity =
  | {
      kind: 'valid';
    }
  | {
      kind: 'invalid';
      reason: string;
    };

export interface SourceService {
  validateSourceLocator(sourceType: string, sourceLocator: string): Promise<LocatorValidity>;
}
