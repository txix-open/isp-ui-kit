import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm, type FieldValues } from 'react-hook-form';
import { ConfigProvider } from 'antd';
import FormArrayMap from '../src/FormComponents/FormArrayMap/FormArrayMap';
import FormObjectMap from '../src/FormComponents/FormObjectMap/FormObjectMap';
import ConfigForm from '../src/FormComponents/ConfigForm/ConfigForm';
import FormRangeDatePicker from '../src/FormComponents/FormRangeDatePicker/FormRangeDatePicker';
import dayjs from '../src/cfg/dayjs-config';
import {
  FieldType,
  InputType,
} from '../src/FormComponents/ConfigForm/config-form.type';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;
const root = createRoot(document.getElementById('root')!);
const results = document.getElementById('results')!;
const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
const button = (name: string) => {
  const result = [
    ...document.querySelectorAll<HTMLButtonElement>('button'),
  ].find(
    (node) =>
      (node.getAttribute('aria-label') ?? node.textContent)?.trim() === name,
  );
  if (!result) throw new Error(`Missing button: ${name}`);
  return result;
};
const click = async (name: string) => {
  const node = button(name);
  await act(async () => {
    node.focus();
    node.click();
  });
};
const report = (message: string) => {
  results.textContent += `${message}\n`;
};
function Collection({ object }: { object: boolean }) {
  const { control, reset, getValues } = useForm<FieldValues>({
    defaultValues: {
      entries: object ? { first: 'one', second: 'two' } : ['one', 'two'],
    },
  });
  return (
    <>
      {object ? (
        <FormObjectMap control={control} name="entries" />
      ) : (
        <FormArrayMap control={control} name="entries" />
      )}
      <button
        onClick={() =>
          reset({ entries: object ? { external: 'loaded' } : ['loaded'] })
        }
      >
        External reset
      </button>
      <button
        onClick={() => {
          results.dataset.value = JSON.stringify(getValues().entries);
        }}
      >
        Read value
      </button>
    </>
  );
}
const inputField = {
  id: 'name',
  name: 'name',
  label: 'Название',
  type: FieldType.SINGLE,
  inputType: InputType.INPUT,
  settings: {},
};
const config = {
  name: 'Test',
  id: 'test',
  fieldId: 'name',
  endpoints: {},
  fields: [inputField],
};
const initialData = [{ name: 'Kept value' }];
function RangeFixture() {
  const { control, watch } = useForm<FieldValues>({
    defaultValues: { period: [null, '2026-12-01T00:00:00+03:00'] },
  });
  return (
    <ConfigProvider>
      <FormRangeDatePicker
        control={control}
        name="period"
        label="Период"
        allowEmpty={[true, true]}
        saveDateFormat="YYYY-MM-DD"
        presets={[
          { label: 'Only start', value: [dayjs('2026-11-23'), null] },
          { label: 'Only end', value: [null, dayjs('2026-12-01')] },
          {
            label: 'Complete',
            value: [dayjs('2026-11-23'), dayjs('2026-12-01')],
          },
        ]}
      />
      <output id="range-value">{JSON.stringify(watch('period'))}</output>
    </ConfigProvider>
  );
}
async function run() {
  for (const object of [false, true]) {
    await act(async () =>
      root.render(<Collection key={String(object)} object={object} />),
    );
    await click(object ? 'Удалить ключ 1' : 'Удалить элемент 1');
    assert(
      document.activeElement === document.querySelector('input'),
      'Deletion must focus the remaining row',
    );
    await click(object ? 'Удалить ключ 1' : 'Удалить элемент 1');
    assert(
      document.activeElement ===
        button(object ? 'Добавить ключ' : 'Добавить новый элемент'),
      'Last deletion must focus Add',
    );
    await click(object ? 'Добавить ключ' : 'Добавить новый элемент');
    assert(
      document.activeElement === document.querySelector('input'),
      'Add must focus the new field',
    );
    await click('Read value');
    assert(
      results.dataset.value === (object ? '{}' : '[]'),
      'Blank draft must not change the saved format',
    );
    await click('External reset');
    assert(
      document.querySelector('input')?.value ===
        (object ? 'external' : 'loaded'),
      'External reset must replace drafts',
    );
    report(
      `${object ? 'Object' : 'Array'}: focus, blank draft and reset passed`,
    );
  }
  let attempts = 0;
  await act(async () =>
    root.render(
      <ConfigProvider>
        <ConfigForm
          config={config}
          crudApi={{}}
          data={initialData}
          onSubmit={async () => {
            if (++attempts === 1) throw new Error('Expected failure');
          }}
        />
      </ConfigProvider>,
    ),
  );
  await click('Сохранить');
  assert(
    document
      .querySelector('[role="alert"]')
      ?.textContent?.includes('Не удалось сохранить'),
    'Rejected save must show an alert',
  );
  assert(
    document.querySelector('input')?.value === 'Kept value',
    'Save failure must preserve values',
  );
  await click('Сохранить');
  assert(
    attempts === 2 && !document.querySelector('[role="alert"]'),
    'Retry must succeed and clear the error',
  );
  report(
    'Save: rejected Promise, preserved values and successful retry passed',
  );

  function useOptions() {
    const [recovered, setRecovered] = useState(false);
    return {
      isError: !recovered,
      data: recovered ? [{ id: 'test', label: 'Тестовое' }] : undefined,
      refetch: async () => setRecovered(true),
    };
  }
  const remoteConfig = {
    ...config,
    fields: [
      {
        ...inputField,
        inputType: InputType.SELECT,
        settings: {
          dataSource: {
            config: 'source',
            valueField: 'id',
            labelField: 'label',
          },
        },
      },
    ],
  };
  await act(async () =>
    root.render(
      <ConfigProvider>
        <ConfigForm
          key="remote"
          config={remoteConfig}
          crudApi={{ source: { useGetListQuery: useOptions } }}
          data={[{}]}
          onSubmit={() => {}}
        />
      </ConfigProvider>,
    ),
  );
  assert(
    document
      .querySelector('[role="alert"]')
      ?.textContent?.includes('Не удалось загрузить'),
    'Source failure must differ from empty options',
  );
  await click('Повторить');
  assert(
    !document.querySelector('[role="alert"]') &&
      !!document.querySelector('[role="combobox"]'),
    'Retry must recover the source field',
  );
  report('Options: source error and recovery passed');

  const arrayConfig = {
    ...config,
    fields: [
      {
        ...inputField,
        name: 'hosts',
        id: 'hosts',
        label: 'Адреса',
        type: FieldType.ARRAY,
      },
    ],
  };
  await act(async () =>
    root.render(
      <ConfigProvider>
        <ConfigForm
          key="nested"
          config={arrayConfig}
          crudApi={{}}
          data={[{ hosts: ['one', 'two', 'three'] }]}
          onSubmit={() => {}}
        />
      </ConfigProvider>,
    ),
  );
  await click('Удалить элемент 2: Адреса');
  assert(
    document.activeElement?.getAttribute('name') === 'hosts[1]',
    'Nested deletion must focus the next row',
  );
  await click('Удалить элемент 2: Адреса');
  assert(
    document.activeElement?.getAttribute('name') === 'hosts[0]',
    'Last nested row deletion must focus the previous row',
  );
  await click('Удалить элемент 1: Адреса');
  assert(
    document.activeElement === button('Добавить элемент'),
    'Empty nested array must focus Add',
  );
  await click('Добавить элемент');
  assert(
    document.activeElement?.getAttribute('name') === 'hosts[0]',
    'Nested Add must focus the new field',
  );
  report('Nested array: next/previous/empty/add focus passed');

  let rejectOld: (reason?: unknown) => void = () => {
    throw new Error('Old submission not started');
  };
  const oldSave = new Promise<void>((_resolve, reject) => {
    rejectOld = reject;
  });
  const saveOld = () => oldSave;
  const oldRecord = [{ name: 'Record A' }];
  const newRecord = [{ name: 'Record B' }];
  await act(async () =>
    root.render(
      <ConfigProvider>
        <ConfigForm
          key="switch"
          config={config}
          crudApi={{}}
          data={oldRecord}
          onSubmit={saveOld}
        />
      </ConfigProvider>,
    ),
  );
  await click('Сохранить');
  await act(async () =>
    root.render(
      <ConfigProvider>
        <ConfigForm
          key="switch"
          config={config}
          crudApi={{}}
          data={newRecord}
          onSubmit={saveOld}
        />
      </ConfigProvider>,
    ),
  );
  await act(async () => {
    rejectOld(new Error('Late failure for A'));
  });
  assert(
    !document.querySelector('[role="alert"]'),
    'Old save failure must not appear on the new record',
  );
  assert(
    document.querySelector('input')?.value === 'Record B',
    'Late save must preserve the new record',
  );
  report('Save: late failure after record switch ignored');

  await act(async () => root.render(<RangeFixture />));
  const rangeInputs =
    document.querySelectorAll<HTMLInputElement>('.ant-picker input');
  assert(
    rangeInputs[0].value === '' && rangeInputs[1].value === '01.12.2026',
    'Stored open range must render a blank boundary',
  );
  for (const [label, expected] of [
    ['Only start', '["2026-11-23",null]'],
    ['Only end', '[null,"2026-12-01"]'],
    ['Complete', '["2026-11-23","2026-12-01"]'],
  ]) {
    await act(async () => {
      rangeInputs[0].focus();
      rangeInputs[0].click();
    });
    const preset = [
      ...document.querySelectorAll<HTMLElement>('.ant-picker-presets li'),
    ].find((node) => node.textContent === label);
    assert(preset, `Missing range preset: ${label}`);
    await act(async () => {
      preset!.click();
    });
    assert(
      document.getElementById('range-value')?.textContent === expected,
      `Incorrect stored range: ${label}`,
    );
  }
  const clear = document.querySelector<HTMLElement>('.ant-picker-clear');
  assert(clear, 'Missing range clear action');
  await act(async () => {
    clear!.click();
  });
  assert(
    document.getElementById('range-value')?.textContent === '',
    'Clear must preserve undefined',
  );
  assert(
    [...document.querySelectorAll<HTMLInputElement>('.ant-picker input')].every(
      (input) => input.value === '',
    ),
    'Clear must empty both visible inputs, including a prefilled default',
  );
  report(
    'Range: null boundaries, both open presets, complete range and clear passed',
  );
  document.body.dataset.result = 'passed';
}
run().catch((error) => {
  document.body.dataset.result = 'failed';
  report(
    error instanceof Error ? (error.stack ?? error.message) : String(error),
  );
});
