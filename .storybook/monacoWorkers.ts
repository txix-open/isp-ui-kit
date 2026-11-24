import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Storybook uses Vite; consumer applications configure their own worker URLs.
export function configureStorybookMonacoWorkers() {
  self.MonacoEnvironment = {
    getWorker(_moduleId, label) {
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less')
        return new CssWorker();
      if (label === 'html' || label === 'handlebars' || label === 'razor')
        return new HtmlWorker();
      if (label === 'typescript' || label === 'javascript')
        return new TypeScriptWorker();
      return new EditorWorker();
    },
  };
}
