export type ComponentStatus =
  | {
      category: 'not_available';
    }
  | {
      category: 'healthy' | 'pending' | 'not_healthy';
      label: string;
    };

export interface SystemService {
  checkDatabaseStatus(): Promise<ComponentStatus>;
  checkStoreStatus(): Promise<ComponentStatus>;
}
