type LocatorValidity =
  | {
      kind: 'valid';
    }
  | {
      kind: 'invalid';
      reason: string;
    };

export interface SourceService {
  validateLocator(sourceType: string, sourceLocator: string): Promise<LocatorValidity>;
}
