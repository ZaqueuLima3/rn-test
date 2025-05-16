import { container } from '../container';

export function useInjection<T>(token: symbol): T {
  return container.resolve<T>(token);
}
