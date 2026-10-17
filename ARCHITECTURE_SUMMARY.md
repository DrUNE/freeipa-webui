# Архитектура freeipa-webui

## Технологический стек

### Frontend
- **React 18.3** — основной UI фреймворк
- **TypeScript 6.0** — строгая типизация
- **Vite 8.3** — сборщик и dev server
- **PatternFly 6.6** — UI компоненты и стили
- **React Router 7.18** — роутинг
- **Redux Toolkit 2.13** — состояние приложения
- **RTK Query** — управление API запросами

### Тестирование
- **Cypress 15** — integration tests (Gherkin/Feature files)
- **Vitest** — unit tests
- **Testing Library** — тесты компонентов

## Архитектурная структура

```
src/
├── components/         # React компоненты
│   ├── layouts/       # Макеты (Toolbar, Title, Modal и т.д.)
│   ├── modals/        # Модальные окна
│   ├── tables/        # Табличные компоненты
│   └── [feature]/     # Специфичные компоненты
├── pages/             # Страницы приложения (каждая страница = route)
│   ├── [Entity]/      # Папка с компонентами страницы
│   │   ├── [Entity].tsx      # Main page component
│   │   └── [Entity]Tabs.tsx  # Tabs component
│   └── Login/         # Страницы аутентификации
├── services/          # API сервисы (RTK Query endpoints)
│   ├── rpc.ts         # Базовый API клиент
│   └── rpc[Entity].ts # Эндпоинты для каждой сущности
├── store/             # Redux store
│   ├── store.ts       # Конфигурация store
│   ├── Global/        # Глобальное состояние
│   └── hooks.ts       # TypeScript хуки
├── hooks/             # Кастомные React хуки
├── navigation/        # Конфигурация навигации
│   ├── NavRoutes.ts   # Структура меню
│   └── AppRoutes.tsx  # React Router routes
├── utils/             # Утилиты и type definitions
│   ├── datatypes/     # TypeScript типы
│   └── [utils].ts     # Вспомогательные функции
└── App.tsx            # Корневой компонент
```

## Паттерны и подходы

### 1. Структура страницы (Page Pattern)

Каждая страница в `pages/[Entity]/` следует единому паттерну:

```tsx
// Пример: pages/Hosts/Hosts.tsx
const Hosts = () => {
  // 1. URL parameters (page, search, perPage)
  const { page, perPage, searchValue } = useListPageSearchParams();
  
  // 2. API calls через RTK Query
  const hostDataResponse = useGettingHostQuery({ ... });
  
  // 3. Состояние таблицы
  const [hostsList, setHostsList] = useState<Host[]>([]);
  
  // 4. Toolbar items (Add, Delete, Refresh, Search, Pagination)
  const toolbarItems: ToolbarItem[] = [ ... ];
  
  // 5. Модальные окна (Add, Delete, Confirm)
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <>
      <TitleLayout>Hosts</TitleLayout>
      <ToolbarLayout toolbarItems={toolbarItems} />
      <HostsTable data={hostsTableData} />
      <AddHost show={showAddModal} />
      <DeleteHosts show={showDeleteModal} />
    </>
  );
};
```

### 2. API взаимодействие (RTK Query)

Каждая сущность имеет свой сервис файл:

```typescript
// services/rpcHosts.ts
const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHostsFullData: build.query<HostFullData, string>({
      query: (hostId) => getCommand({
        method: "host_show",
        params: [[hostId], { all: true }],
      }),
    }),
    addHost: build.mutation<FindRPCResponse, HostAddPayload>({
      query: (payload) => getCommand({
        method: "host_add",
        params: [[payload.fqdn], { ... }],
      }),
    }),
    // ... остальные эндпоинты
  }),
});
```

**Используемые API команды FreeIPA:**
- `*_find` — поиск сущностей
- `*_show` — получение детальной информации
- `*_add` — создание
- `*_mod` — модификация
- `*_del` — удаление
- `batch` — пакетное выполнение

### 3. Навигация (Redux + React Router)

```typescript
// navigation/NavRoutes.ts
export const getNavigationRoutes = (config) => [
  {
    label: "Identity",
    items: [
      { label: "Users", path: "active-users" },
      { label: "Hosts", path: "hosts" },
      // ...
    ]
  },
  // ...
];
```

### 4. Состояние (Redux Store)

```typescript
// store/store.ts
configureStore({
  reducer: {
    api: api.reducer,           // RTK Query cache
    global: globalReducer,      // глобальное состояние
    routes: routesReducer,      // текущий route
    alerts: alertsReducer,      // уведомления
    contextualHelp: contextualHelpReducer, // помощь
  }
});
```

### 5. Компоновка UI (PatternFly + Custom Layouts)

**Стандартные макеты:**
- `TitleLayout` — заголовок страницы
- `ToolbarLayout` — панель инструментов
- `SearchInputLayout` — поле поиска
- `PaginationLayout` — пагинация
- `ModalWithFormLayout` — модальное окно с формой
- `KebabLayout` — выпадающее меню (kebab menu)

### 6. Управление формами

**Паттерн формы:**
```tsx
<ModalWithFormLayout
  title="Add Host"
  formId="add-host-modal"
  fields={formFields}
  show={showModal}
  actions={modalActions}
  onSubmit={handleSubmit}
/>
```

### 7. Типизация

**Глобальные типы:**
```typescript
// utils/datatypes/globalDataTypes.ts
interface Host {
  fqdn: string[];
  description?: string;
  userclass?: string;
  // ...
}

interface User {
  uid: string[];
  givenname?: string[];
  sn?: string[];
  // ...
}
```

## Интеграция с FreeIPA

### Authentication
- Kerberos ticket через `ipa/session/json`
- `useUserMetadataQuery` — получение метаданных пользователя
- Автоматическая редирект на login при ошибке аутентификации

### API Communication
```typescript
// services/rpc.ts
const getCommand = (commandData: Command) => ({
  url: "ipa/session/json",
  method: "POST",
  body: {
    method: commandData.method,
    params: commandData.params,
  },
});
```

### Batch Requests
```typescript
// Поддержка пакетных запросов для оптимизации
const getBatchCommand = (commands: Command[], apiVersion) => ({
  method: "batch",
  params: [commands, { version: apiVersion }],
});
```

## Модульность и переиспользование

### Компоненты MemberOf
Универсальные компоненты для управления членством:
- `MemberOfUserGroups`
- `MemberOfHostGroups`
- `MemberOfRoles`
- `MemberOfHbacRules`
- `MemberOfSudoRules`

### Секции конфигурации
```typescript
// components/[Entity]Sections/
- HostsSections
- UsersSections
- ServiceSections
- SudoRuleSections
- HBACRuleSections
// ... (для каждой сущности)
```

### Хуки для данных
```typescript
// hooks/use[Entity]SettingsData.ts
- useHostSettingsData
- useUserSettingsData
- useServiceSettingsData
- useHostGroupSettingsData
// ... (для каждой сущности)
```

## Дополнительные возможности

### Internationalization (i18n)
```typescript
// Auto-generated from FreeIPA server
import { TRANSLATIONS } from "src/utils/datatypes/InternationalizationKeys";
const { t } = useTranslation();
t("policy.added", "Policy added");
```

### Contextual Help
Система контекстной помощи через Redux state.

### Alerts System
```typescript
dispatch(addAlert({
  name: "success",
  title: "Host added successfully",
  variant: "success",
}));
```

### Error Handling
```typescript
const globalErrors = useApiError([]);
const modalErrors = useApiError([]);
```

## Отладка и тестирование

### Dev Server
```bash
./developer/dev-env.sh -d  # запуск dev server в контейнере
npm run dev                  # локальный dev server
```

### Integration Tests (Cypress)
```bash
./developer/dev-env.sh -c           # headless mode
./developer/dev-env.sh -C           # GUI mode
cypress/e2e/[feature].feature      # конкретный тест
```

### Unit Tests
```bash
npm test                    # запуск всех unit тестов
npm run test:watch         # watch mode
npm run test:coverage      # с покрытием
```

### Linting & Formatting
```bash
npm run lint       # eslint
npm run lint:fix   # eslint + auto-fix
npm run prettier   # проверка форматирования
npm run prettier:fix  # исправление форматирования
npm run knip       # проверка на неиспользуемый код
```

## Ключевые особенности архитектуры

1. **Single Source of Truth** — Redux store для глобального состояния
2. **RTK Query caching** — автоматическое кэширование API ответов
3. **Code splitting** — каждая страница импортируется отдельно
4. **Type safety** — строгая типизация через TypeScript
5. **Component composition** — переиспользуемые компоненты (MemberOf, Sections)
6. **Batch API calls** — оптимизация через пакетные запросы
7. **Separation of concerns** — страницы, сервисы, компоненты, хуки
8. **Consistent patterns** — единый подход ко всем страницам

## Возможности для интеграции GPO

Учитывая архитектуру freeipa-webui, для интеграции `freeipa-server-gpo` потребуется:

### 1. Backend API (freeipa-server-gpo)
- REST API endpoints для управления:
  - Policies (GPO)
  - Chains
  - Master
  - Groups linkage

### 2. Frontend (freeipa-webui)
- Новая страница `pages/GPO/`:
  - `GPO.tsx` — список политик
  - `GPOTabs.tsx` — вкладки с детальной информацией
- API сервис `services/rpcGPO.ts`
- Навигация в `navigation/NavRoutes.ts`
- Компоненты:
  - `modals/GPO/AddGPO.tsx`
  - `modals/GPO/DeleteGPO.tsx`
  - `modals/Chain/AddChain.tsx`
  - `modals/Chain/EditChain.tsx`

### 3. Паттерн реализации
Следовать существующим паттернам:
- Использовать `useGettingGenericQuery` для списков
- `api.injectEndpoints` для кастомных эндпоинтов
- PatternFly компоненты для UI
- Redux для состояния

### 4. Тесты
- Cypress feature files для integration tests
- Unit tests для компонентов

## Ссылки на документацию

- [FreeIPA API](https://freeipa.readthedocs.io/)
- [PatternFly](https://www.patternfly.org/)
- [React](https://react.dev/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
