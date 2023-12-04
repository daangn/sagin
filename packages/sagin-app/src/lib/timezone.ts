import { type Brand } from '@sagin/core/utils';

export type TimeZone = Brand<string, 'TimeZone'>;

export function validateTimeZone(zone: string): zone is TimeZone {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

export function resolveTimeZone(): TimeZone | null {
  return (Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZone) || null;
}
