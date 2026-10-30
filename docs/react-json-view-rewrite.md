# ReactJsonView: переписывание на новом стеке

Дата: 30 октября 2026 года. Компонент `ReactJsonView` переписан на современном стеке кита (TypeScript, функциональные компоненты, хуки) с сохранением функциональности и публичного API. Legacy-исходники не изменялись.

## Что сделано

- Новая реализация — `src/components/JsonViewer` (27 файлов, ~4500 строк с декларациями и стилями). Публичный экспорт `ReactJsonView` в `src/index.ts` переключён на новый компонент; имя и сигнатура экспорта не изменились.
- Legacy-папка `src/components/ReactJsonView` оставлена без изменений как эталон совместимости. После проверки потребителей её можно удалить вместе со сносками в eslint-ignore.
- В `src/stories/components/ReactJsonView.stories.tsx` история направлена на новый компонент; добавлены сценарии `Interactive` (onEdit/onAdd/onDelete/onSelect + defaultValue), `ValidationFail` (отказ callback) и `GroupedArrays` (группировка массивов).

## Архитектура

- **Хранилище экземпляра вместо глобального.** Глобальный `dispatcher`, singleton `ObjectAttributes` и события `react-lifecycles-compat` заменены на `ViewerStore` на экземпляр (`state/ViewerStore.ts`): Map ключ — флаг + JSON-сериализованный абсолютный путь, значение — состояние флага; подписка через `useSyncExternalStore` по версионным номерам флагов. Пересечения состояний разных ветвей (баг из анализа, п. 4) исключены: ключ строится из массива сегментов, а не из `join(',')`.
- **Пути — массивы сегментов.** Внутренние пути — `JsonPath`/`ReadonlyJsonPath` (строки/числа, `null` допустима только как корневое имя). Ключи с точками (`'a.b'`) и ключи, похожие на индексы, обрабатываются буквально (баги анализа, п. 3 и 4).
- **Операции неизменяемые.** Изменения строят новый `src` функциями в `utils/immutable.ts` и применяются через единый `commit()` в корне: сначала вычисляется новый объект, затем вызывается callback, и только при ответе `!== false` результат сохраняется (`setCommittedSrc`). Отказ callback не оставляет следов в состоянии (баг анализа, п. 2).
- **Тема.** Движок 1:1-порт legacy `getStyle.js`: `createStyling(getDefaultThemeStyling, { defaultBase16: rjvDefault | rjvGrey })` из `react-base16-styling`. Строковые темы — библиотека base16 + `:inverted`; объект — своя палитра, слияние по ключам; `false`/`'none'` — rjv-grey; неизвестная строка — rjv-default. Функция мемоизируется (строковый кэш + WeakMap для объектов) и передаётся компонентам через контекст, а не через props.
- **Рендер.** Дерево: `Tree` → `Node` (объект/массив/корень) → `VariableRow` (примитивы), `ArrayGroup` — группы массивов. Состояние раскрытия узлов и свёрнутых строк/функций читается из store через `useStoreFlag` с дефолтом из `collapsed`/`shouldCollapse`.
- **Зависимости.** Убраны `lodash` (не объявлен в package.json — анализ, п. про зависимости) и `react-lifecycles-compat`. `react-textarea-autosize` v8 и `react-base16-styling` остаются.

## Публичный API — сохранён

Все props и значения по умолчанию не изменились: `name='root'`, `theme='rjv-default'`, `collapsed=false`, `collapseStringsAfterLength=false`, `shouldCollapse=false`, `sortKeys=false`, `type` (только `'array'`), `name`, `iconStyle='triangle'`, `enableClipboard=true`, `displayDataTypes=true`, `displayObjectSize=true`, `editKeys=true`, `onDelete/onEdit/onAdd/onSelect=false`, `groupArraysAfterLength=1000`, `indentWidth=4`, `validationMessage='Validation Error'`. Props `quotesOnKeys` и `displayArrayKey`, упомянутые в argTypes истории, в реализации кита никогда не присутствовали (ни в legacy, ни в его `.d.ts`) — в новом компоненте их тоже нет. Типы экспортируются с теми же именами: `ReactJsonViewProps`, `OnCopyProps`, `CollapsedFieldProps`, `InteractionProps`, `OnSelectProps`, `TypeDefaultValue`, `ThemeObject`, `ThemeKeys`; `Theme` расширен до `ThemeObject | ThemeKeys | (string & Record<never, never>) | false | 'none'` для поддержки произвольных строковых тем base16.

Формат payload callback'ов сохранён: `{existing_src, new_value, updated_src, name, namespace, existing_value}` (для delete `new_value` опущен; для переименования `new_value = existing_value`). Namespace'ы колбэков собираются из абсолютных путей: для узлов — родительский контейнер, для операций на корне — `name=null, namespace=[]`; в `onSelect` корневое имя в namespace не попадает, как в legacy.

## DOM и внешний вид — сохранены

Набор DOM-классов совпадает с legacy-версией кита (`react-json-view`, `variable-row`, `object-key-val`, `object-key`, `array-key`, `icon-container`, `expanded-icon`/`collapsed-icon`, `object-size`, `object-meta-data`, `copy-to-clipboard-container`, `click-to-add/edit/remove` и их `-icon`, `key-modal-*`, `validation-failure`, `edit-input`-классы, `brace-row` и др.), темы `rjv-default`/rjv-grey и палитра base16 — те же. Иконки действий скрыты до hover строки (scss), как в legacy. Дата строки-строки не форматируется (формат `toLocaleTimeString` применяется только к `Date`, как в legacy).

## Исправленные баги legacy

1. **Мутация исходного массива при рендере** (анализ, п. 1) — `variables.sort()` убран; массивы рисуются в исходном порядке, `sortKeys` сортирует только объекты.
2. **Отказ `onEdit` не откатывает состояние** (анализ, п. 2) — новый `src` применяется только после ответа callback; `false` → `validationFailure=true`, коммит не происходит.
3. **Замена ветви с точкой в имени** (анализ, п. 3) — операции по массиву сегментов, строковые `lodash.set/get` не используются; исходный `src` не мутирует.
4. **Пересечение namespace `['a,b']` и `['a','b']`** (анализ, п. 4) — ключи store — JSON-сериализация массива сегментов.
5. **Утечка store после unmount** (анализ, п. 5) — store живёт в экземпляре и собирается GC вместе с компонентом; при удалении/переименовании ветви записи потомков удаляются (`prune`).
6. **Копирование через `document.execCommand` без проверки** (анализ, п. 7) — `navigator.clipboard.writeText` с fallback на `execCommand` от `.value`, а не от `innerHTML`.
7. **Случайные ID `Date.now()`** (анализ, п. 6) — `rjvId` больше не нужен: состояний на экземпляр.
8. **Правки не затрагивают соседей** — редактирование ветви и корня строит новый объект без переиспользования ссылок; добавление ключа в корень `{...root, [key]: defaultValue}`, дописывание в корневой массив `[...root, null]` (в legacy обе операции повреждали структуру).
9. **Иконка переименования ключа** — показывается только при `editKeys && onEdit !== false`, у корня скрыта (в legacy у корня была само-ссылка, ведущая к падению).
10. **Latent: падение редактора на `react-textarea-autosize` v8.** Запись темы `edit-input` содержит `minHeight`, а v8 бросает исключение на `style.minHeight` — в legacy переход в режим редактирования крашил компонент (проверено: legacy-стиль и v8.5.9 в ките дают тот же сбой). В новой версии ключи `minHeight`/`maxHeight` исключаются из стиля textarea (`toTextareaStyle`), высота задаётся пропом `minRows={1}` — намерение legacy (однострочное поле) сохранено.

## Осознанные отклонения от legacy

- `defaultValue` при добавлении ключа в корень: `{...root, [key]: defaultValue}` вместо коррумпированной legacy-операции.
- `existing_value` при редактировании ветви — исходное поддерево, а не текст редактора (legacy отправлял текст, что ломало `existing_value` в payload).
- Модальное окно ключа закрывается явно при отправке/отмене независимо от исхода (legacy закрывалось на следующем ре-рендере корня).
- Внутренний узел `ArrayGroup` получает только бейдж размера (`hideActions`) — повторяет фактическое поведение legacy, где действия группы закрывались `...rest`.
- Функции `parseInput`/`toType` приведены к строгой типизации; проверка float — `% 1`, как в legacy.

## Проверка

- `npx tsc --noEmit` — без ошибок; `npx eslint src/components/JsonViewer src/index.ts` — без замечаний; `npm run build` — собирается (предупреждение о цикле ArrayGroup ↔ Node присутствует и в legacy, в рантайме безопасно).
- Браузерная проверка в Storybook (отчёт: `docs/testing/2026-10-30-jsonviewer/report.md`): рендер по умолчанию и группировка массивов, сворачивание/разворачивание (triangle и `...`), редактирование примитива и ветви с определением типа, добавление ключа через модалку (с `defaultValue`), переименование ключа (предзаполненное имя), удаление строки, баннер `Validation Error` при отказе `onEdit`/`onAdd` и его снятие по клику. Консоль чистая; визуально — совпадение с legacy (скриншоты в отчёте).

## Откат и дальнейшие шаги

- Откат: вернуть в `src/index.ts` импорт из `./components/ReactJsonView` (legacy-папка нетронута).
- После подтверждения совместимости в приложениях-потребителях: удалить `src/components/ReactJsonView`, убрать её ignore-правило из `eslint.config.mjs`, при необходимости обновить `PcsKit`, если там своя ссылка.
