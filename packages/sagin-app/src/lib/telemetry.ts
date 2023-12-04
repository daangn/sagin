import { trace } from '@opentelemetry/api';

// biome-ignore lint/suspicious/noExplicitAny: intended
type Callable = (...args: any[]) => any;

export function withActiveSpan<T extends Callable>(fn: T, spanName: string): T {
  return ((...args) => {
    return trace.getTracer('sagin-app').startActiveSpan(spanName, span => {
      try {
        return fn(...args);
      } finally {
        span.end();
      }
    });
  }) as T;
}
