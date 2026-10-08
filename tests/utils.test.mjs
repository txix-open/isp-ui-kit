import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), 'kit-utils-'));
after(() => rmSync(output, { recursive: true, force: true }));
function load(source) {
  const filename = join(
    output,
    source.split('/').at(-1).replace('.ts', '.cjs'),
  );
  writeFileSync(
    filename,
    ts.transpileModule(readFileSync(new URL(source, import.meta.url), 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  );
  return require(filename);
}
const { getText, verifyTextKey, createTextGetter, createTextVerifier } = load(
  '../src/utils/textsUtils.ts',
);
const { getConfigProperty } = load('../src/utils/configUtils.ts');

test('text parameters are literal: punctuation in keys, dollar signs, repeated placeholders', () => {
  assert.equal(
    getText({ msg: '{{a.b}} {{axb}} {{a.b}}' }, 'msg', '', { 'a.b': '$&' }),
    '$& {{axb}} $&',
  );
  assert.equal(getText({ msg: '{{[}}' }, 'msg', '', { '[': '$1' }), '$1');
});
test('dictionary and parameter prototypes are not treated as application data', () => {
  const texts = Object.assign(Object.create({ inherited: 'secret' }), {
    msg: '{{own}} {{inherited}}',
  });
  const params = Object.assign(Object.create({ inherited: 'secret' }), {
    own: 'visible',
  });
  assert.equal(getText(texts, 'inherited', 'fallback'), 'fallback');
  assert.equal(getText(texts, 'msg', '', params), 'visible {{inherited}}');
  assert.equal(verifyTextKey(texts, 'inherited'), false);
  assert.equal(getText({}, 'toString', 'fallback'), 'fallback');
});
test('empty texts, fallback and undefined dictionary retain their existing semantics', () => {
  assert.equal(getText({ empty: '' }, 'empty', 'fallback'), '');
  assert.equal(
    getText({}, 'missing', 'Hello {{name}}', { name: 'Ada' }),
    'Hello Ada',
  );
  assert.equal(
    getText(undefined, 'missing', 'Hello {{name}}', { name: 'Ada' }),
    'Hello {{name}}',
  );
  assert.equal(getText(undefined, 'missing'), '');
  assert.equal(
    createTextVerifier({ empty: '', filled: 'yes' })('empty'),
    false,
  );
  assert.equal(
    createTextGetter({ msg: '{{name}}' })('msg', '', { name: 'Ada' }),
    'Ada',
  );
});
test('config is safe without window, and preserves own falsy values', () => {
  assert.equal(getConfigProperty('missing', 'fallback'), 'fallback');
  globalThis.window = {
    config: Object.assign(Object.create({ inherited: 'secret' }), {
      no: false,
      zero: 0,
      empty: '',
      nullable: null,
      explicit: undefined,
    }),
  };
  try {
    for (const [key, expected] of Object.entries(window.config))
      assert.equal(getConfigProperty(key, 'fallback'), expected);
    assert.equal(getConfigProperty('inherited', 'fallback'), 'fallback');
    assert.equal(getConfigProperty('service.url', 'fallback'), 'fallback');
  } finally {
    delete globalThis.window;
  }
});
