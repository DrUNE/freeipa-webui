# CLAUDE.md

Новый веб-интерфейс FreeIPA: React 18, TypeScript (strict), PatternFly 6, Redux Toolkit + RTK Query, Vite, Vitest, Cypress (Gherkin). Работает поверх JSON-RPC FreeIPA (`ipa/session/json`), собственного бэкенда нет. Устройство и паттерны страниц: `ARCHITECTURE_SUMMARY.md` (читать перед новой сущностью; его утверждение про «REST API endpoints» неверно, нужны только существующие JSON-RPC команды). Среда разработки на контейнерах: `README.md`, `developer/README.md`. Правила Cypress: `cypress/README.md`.

В этой ветке (`feature/gpo-rpc`) идёт работа по управлению групповыми политиками (плагин `freeipa-server-gpo`, соседний репозиторий `../freeipa-server-gpo`); план: `../freeipa-server-gpo/doc/plans/WEBUI-MIGRATION.ru.md`, что хост даёт редактору: `WEBUI-ISLAND.ru.md`. Сервис-слой готов (`src/services/gpoCommands.ts`, `rpcGpo.ts`, `rpcChain.ts`, `rpcGpmaster.ts`, `rpcGpoEditor.ts`, `src/utils/gpoUtils.ts`), страницы — этап 2.

## Команды

| Что                | Команда                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Установка          | `npm clean-install` (Node 22, как в CI)                                                      |
| Dev-сервер         | `npm run dev` (нужен FreeIPA из `developer/dev-env.sh`; `/ipa/modern-ui`)                    |
| Тесты              | `npm test` (Vitest, jsdom); один файл: `npx vitest run путь`                                 |
| Lint / формат      | `npm run lint` (`--max-warnings 820`), `npm run prettier` (проверка), `npm run prettier:fix` |
| Неиспользуемый код | `npm run knip` (CI-условие: неиспользуемые файлы и экспорты — ошибка)                        |
| Сборка             | `npm run build` (`tsc -b && vite build`)                                                     |
| Типы переводов     | `npm run i18n:generate` (CI `i18n_strings` проверяет, что типы актуальны)                    |
| Аудит зависимостей | `npm run audit-ci`                                                                           |

CI (`.github/workflows/gating.yml`): audit-ci, prettier, lint, knip, build, test. Перед завершением работы прогнать prettier, lint, knip, `npx tsc -b`, `npm test`.

## Правила

- **Не запускать `npx tsc -b` без нужды и сразу после него удалять `dist/`**: он эмитит скомпилированные `.js` (в том числе тесты) в `dist/`, и Vitest потом гоняет и их. `dist/` в `.gitignore`.
- **Известные падения без наших изменений:** около 10 тестов в `src/components/Form/` (IpaCertificates, IpaSshPublicKeys, IpaCertificateMappingData). Проверять базу командой `git stash -u`, а не считать падения своими.
- **knip**: новый код, который ещё никто не использует, падает в CI. Временно добавлять файлы в `ignore` `knip.json` с пояснением и убирать, когда появится потребитель (сейчас так сделано для gpo-слоя).
- Стиль: Prettier (`.prettierrc`: 2 пробела, `trailingComma: es5`), ESLint с TypeScript и `@eslint-react`. Импорты через алиас `src/...`.
- Сущность = папка `src/pages/<Entity>/` (страница, вкладки, таблица, настройки), модалки добавления/удаления, `src/services/rpc<Entity>.ts`, хук данных `src/hooks/use<Entity>SettingsData.tsx`, утилиты `src/utils/<entity>Utils.tsx`, типы в `src/utils/datatypes/`, пункты меню в `navigation/NavRoutes.ts`, маршруты в `navigation/AppRoutes.tsx`, Cypress-сценарии `cypress/e2e/<entity>/`. Общие файлы (`rpc.ts`, `globalDataTypes.ts`, `NavRoutes.ts`, `AppRoutes.tsx`) трогать минимально: плагинной инфраструктуры нет, правки идут через ядро и могут конфликтовать с другими PR.
- **RTK Query.** Эндпоинты добавляются через `api.injectEndpoints` в файле сущности; теги кэша (`tagTypes`) объявлены в `services/rpc.ts`. Запросы собирают `getCommand` (добавляет `version`, второй элемент `params` должен быть объектом) и `getBatchCommand`. Формы запросов, которые можно проверить без сервера, выносить в чистые функции и покрывать тестами (образец: `src/services/gpoCommands.ts` и его тест).
- **Ответы FreeIPA:** одиночные значения приходят списком из одного элемента или скаляром, отсутствующий атрибут означает пусто. Приводить в `src/utils/<entity>Utils.tsx` (`convertApiObj` или собственные функции), в компонентах с «сырыми» ответами не работать.
- **Переводы** приходят с сервера (`i18n_messages`), типы ключей генерируются `npm run i18n:generate`; хук `useTranslation`. Строки сторонних плагинов (GPO) там пока нет: решение открыто (см. план миграции).
- **Раздел плагина показывать только при его наличии:** `useGpoPluginAvailable` (по `json_metadata`); без плагина команды отвечают ошибкой.
- Секреты и конфигурацию окружения не коммитить.

## Правила работы

- Коммиты и PR делает пользователь; без просьбы не коммитить и не пушить. Сообщения коммитов пользователь пишет сам.
- Не доверять числам и фактам из прошлых сообщений и доков: проверять командой (`git status`, прогон тестов).
- Экономия контекста: вывод команд обрезать (`head`, `grep`, `tail`), большие файлы читать кусками, широкий поиск делегировать субагенту.
- Работая над GPO-слоем, держать соседний репозиторий в согласии: контракт `gpo_editor_*` (`../freeipa-server-gpo/tests/contracts/`) и версию API (`API_VERSION`); копия типов `src/utils/datatypes/gpoEditorRpc.ts` не правится руками, её переносят из плагина.
