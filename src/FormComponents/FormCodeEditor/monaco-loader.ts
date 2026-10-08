import { loader } from '@monaco-editor/react';

export type MonacoSource = () => Promise<typeof import('monaco-editor')>;
export const defaultMonacoSource: MonacoSource = () => import('monaco-editor');
const pending = new WeakMap<MonacoSource, Promise<void>>();

export function initializeMonaco(source: MonacoSource) {
  let promise = pending.get(source);
  if (!promise) {
    promise = Promise.resolve()
      .then(source)
      .then(async (monaco) => {
        loader.config({
          monaco,
          'vs/nls': { availableLanguages: { '*': 'ru' } },
        });
        await loader.init();
      })
      .catch((error) => {
        pending.delete(source);
        throw error;
      });
    pending.set(source, promise);
  }
  return promise;
}

export function retryMonaco(source: MonacoSource) {
  pending.delete(source);
}
