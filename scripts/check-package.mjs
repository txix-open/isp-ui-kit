import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, normalize, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const project = fileURLToPath(new URL('..', import.meta.url));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const runNpm = (args, cwd) =>
  execFileSync(npm, args, { cwd, encoding: 'utf8' });
const [archive] = process.argv.slice(2);
const directory = await mkdtemp(join(tmpdir(), 'isp-ui-kit-package-'));
const consumers = join(directory, 'app');
const entrypoints = {
  'isp-ui-kit/search': ['SearchInput', 'SearchInputProps'],
  'isp-ui-kit/json-viewer': ['ReactJsonView', 'ThemeObject'],
  'isp-ui-kit/code-editor': [
    'FormCodeEditor',
    'FormCodeEditorProps<{ value: string }>',
  ],
};

try {
  const tarball = archive
    ? resolve(archive)
    : join(
        directory,
        JSON.parse(
          runNpm(
            [
              'pack',
              '--ignore-scripts',
              '--json',
              '--pack-destination',
              directory,
            ],
            project,
          ),
        )[0].filename,
      );
  const lock = JSON.parse(
    await readFile(join(project, 'package-lock.json'), 'utf8'),
  );
  const typePackages = ['@types/react', '@types/react-dom'];
  const peers = Object.fromEntries(
    [...Object.keys(lock.packages[''].peerDependencies), ...typePackages].map(
      (name) => [name, lock.packages[`node_modules/${name}`].version],
    ),
  );
  await mkdir(consumers);
  await writeFile(
    join(consumers, 'package.json'),
    JSON.stringify({
      name: 'isp-ui-kit-package-check',
      private: true,
      dependencies: { ...peers, 'isp-ui-kit': `file:${tarball}` },
    }),
  );
  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumers);

  const subpaths = JSON.stringify(entrypoints);
  const runtime = `
    for (const [path, [name]] of Object.entries(${subpaths})) {
      const entry = await load(path);
      assert.equal(typeof entry[name], 'function');
      assert.equal(entry[name], root[name]);
    }
    for (const name of ['Column', 'LayoutMenu', 'ConfigForm', 'useAuth']) {
      assert.equal(typeof root[name], 'function');
    }
    const custom = await load('isp-ui-kit/code-editor/custom');
    assert.equal(typeof root.FormCodeEditorWithLoader, 'function');
    assert.equal(custom.FormCodeEditorWithLoader, root.FormCodeEditorWithLoader);
  `;
  await writeFile(
    join(consumers, 'runtime.mjs'),
    `
    import assert from 'node:assert/strict';
    import * as root from 'isp-ui-kit';
    import * as legacy from './node_modules/isp-ui-kit/dist/index.esm.js';
    import { createRequire } from 'node:module';
    const require = createRequire(import.meta.url);
    const load = (path) => import(path);
    assert.equal(legacy.SearchInput, root.SearchInput);
    ${runtime}
    await (async () => {
      const root = require('isp-ui-kit');
      const load = require;
      assert.equal(require('./node_modules/isp-ui-kit/dist/index.cjs.js'), root);
      ${runtime}
    })();
  `,
  );
  execFileSync(process.execPath, ['runtime.mjs'], {
    cwd: consumers,
    stdio: 'inherit',
  });

  const typeImports = Object.entries(entrypoints)
    .map(([path, [name, props]]) => {
      const typeName = props.split('<')[0];
      return `
      import { ${name}, type ${typeName} } from '${path}';
      export const check${name}: typeof Root.${name} = ${name};
      export type Props${name} = ${props};
    `;
    })
    .join('');
  const sources = ['types.mts', 'types.cts'];
  await Promise.all(
    sources.map((name) =>
      writeFile(
        join(consumers, name),
        `
    import * as Root from 'isp-ui-kit';
    import { FormCodeEditorWithLoader, type FormCodeEditorWithLoaderProps } from 'isp-ui-kit';
    ${typeImports}
    export const customEditor: typeof FormCodeEditorWithLoader<{ value: string }> = FormCodeEditorWithLoader;
    export const editorApiLoader: FormCodeEditorWithLoaderProps<{ value: string }>['loadMonaco'] =
      () => import('monaco-editor/esm/vs/editor/editor.api.js');
    // @ts-expect-error A custom editor requires a Monaco loader.
    export const missingLoader: FormCodeEditorWithLoaderProps<{ value: string }>['loadMonaco'] = undefined;
  `,
      ),
    ),
  );
  execFileSync(
    process.execPath,
    [
      join(project, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--module',
      'nodenext',
      ...sources,
    ],
    { cwd: consumers, stdio: 'inherit' },
  );

  const intermediary = join(
    consumers,
    'node_modules',
    '@fixture',
    'admin-ui-kit',
  );
  await mkdir(intermediary, { recursive: true });
  await writeFile(
    join(intermediary, 'package.json'),
    JSON.stringify({
      type: 'module',
      exports: './index.js',
      peerDependencies: { 'isp-ui-kit': '*' },
    }),
  );
  await writeFile(
    join(intermediary, 'index.js'),
    `
    export { Column, SearchInput, ReactJsonView } from 'isp-ui-kit';
  `,
  );
  const jsonLoader = `
    import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';
    import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker';
    export async function loadMonaco() {
      globalThis.MonacoEnvironment = {
        getWorker: (_, label) => label === 'json' ? new JsonWorker() : new EditorWorker(),
      };
      await import('monaco-editor/esm/vs/language/json/monaco.contribution.js');
      return import('monaco-editor/esm/vs/editor/editor.api.js');
    }
  `;
  const demos = {
    search: "export { SearchInput } from 'isp-ui-kit/search';",
    'root-search': "export { SearchInput } from 'isp-ui-kit';",
    'root-json': "export { ReactJsonView } from 'isp-ui-kit';",
    admin:
      "export { Column, SearchInput, ReactJsonView } from '@fixture/admin-ui-kit';",
    editor: "export { FormCodeEditor } from 'isp-ui-kit';",
    'editor-custom': "export { FormCodeEditorWithLoader } from 'isp-ui-kit';",
    'editor-json': `
      export { FormCodeEditorWithLoader } from 'isp-ui-kit';
      ${jsonLoader}
    `,
  };
  let searchEntryBytes;
  for (const [name, source] of Object.entries(demos)) {
    const input = join(consumers, `${name}.mjs`);
    await writeFile(input, source);
    const { output } = await build({
      root: consumers,
      configFile: false,
      logLevel: 'error',
      build: {
        write: false,
        rollupOptions: { input, preserveEntrySignatures: 'strict' },
      },
    });
    const chunks = output.filter((file) => file.type === 'chunk');
    const referencesAsset = (fileName) =>
      chunks.some(({ code }) => code.includes(fileName.split('/').at(-1)));
    const usesMonaco = (chunk) =>
      Object.keys(chunk.modules).some((id) =>
        /[\\/]node_modules[\\/]monaco-editor[\\/]/.test(normalize(id)),
      );
    const usesMonacoReact = (chunk) =>
      Object.keys(chunk.modules).some((id) =>
        /[\\/]node_modules[\\/]@monaco-editor[\\/]react[\\/]/.test(
          normalize(id),
        ),
      );
    if (name === 'editor') {
      assert(
        chunks.some((chunk) => chunk.isDynamicEntry && usesMonaco(chunk)),
        'The editor must load Monaco through a dynamic chunk',
      );
      assert(!chunks.some((chunk) => chunk.isEntry && usesMonaco(chunk)));
    } else if (name === 'editor-json') {
      const workerNames = output
        .map(({ fileName }) => fileName)
        .filter(
          (fileName) =>
            fileName.includes('.worker-') && referencesAsset(fileName),
        );
      assert.equal(workerNames.length, 2);
      for (const language of ['editor', 'json']) {
        assert(
          workerNames.some((fileName) =>
            fileName.includes(`/${language}.worker-`),
          ),
        );
      }
      assert(
        !chunks.some((chunk) =>
          Object.keys(chunk.modules).some((id) =>
            /[\\/]monaco-editor[\\/].*[\\/]editor\.main\.js$/.test(id),
          ),
        ),
        'The JSON-only editor includes the full Monaco entry',
      );
    } else {
      assert(!chunks.some(usesMonaco), `The ${name} bundle includes Monaco`);
      assert(
        !output.some(
          ({ fileName }) =>
            /(?:\.worker-|\/codicon-)/.test(fileName) &&
            referencesAsset(fileName),
        ),
        `The ${name} bundle references Monaco assets`,
      );
    }
    if (name === 'editor-custom') {
      assert(
        chunks.some(usesMonacoReact),
        'The editor needs the React integration',
      );
    } else if (['search', 'root-search', 'root-json'].includes(name)) {
      assert(
        !chunks.some(usesMonacoReact),
        `The ${name} bundle includes Monaco React`,
      );
    }
    if (['search', 'root-search', 'admin'].includes(name)) {
      assert(
        chunks.some(({ code }) => code.includes('.kit-search')),
        `The ${name} bundle lost SearchInput styles`,
      );
    }
    if (name === 'root-json' || name === 'admin') {
      assert(chunks.some(({ code }) => code.includes('.react-json-view')));
    }
    if (name.startsWith('editor')) {
      assert(chunks.some(({ code }) => code.includes('.form-code-editor')));
    }
    const entryBytes = chunks.reduce(
      (total, chunk) => total + Buffer.byteLength(chunk.code),
      0,
    );
    if (name === 'search') searchEntryBytes = entryBytes;
    if (name === 'root-search') {
      assert(
        entryBytes <= searchEntryBytes * 1.05,
        'SearchInput through the root retains unrelated code',
      );
    }
    const assetBytes = output
      .filter((file) => file.type === 'asset')
      .reduce((total, file) => total + Buffer.byteLength(file.source), 0);
    console.log(
      `${name}: ${Math.round(entryBytes / 1024)} KiB JS chunks, ${Math.round(assetBytes / 1024)} KiB assets`,
    );
  }
  console.log('Checked the npm archive with Node.js, TypeScript and Vite.');
} finally {
  await rm(directory, { recursive: true, force: true });
}
