import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Layout, Space, Tag } from 'antd';
import { useForm } from 'react-hook-form';
import {
  Column,
  ErrorPage,
  HomePage,
  LayoutMenu,
  LayoutSider,
  NotFoundPage,
} from '../../Layout';
import ConfigTable from '../../components/ConfigTable/ConfigTable';
import { FormInput, FormSwitch } from '../../FormComponents';
import { navigationConfig } from '../shared/NavigationExample';
import { useDesignPreview } from '../shared/DesignPreviewContext';
import './application-story.scss';

const modules = [
  { id: 'mapping', name: 'Преобразование входящих данных', version: '3.11.0' },
  { id: 'validation', name: 'Проверка обязательных полей', version: '1.8.0' },
  {
    id: 'delivery',
    name: 'Доставка сообщений внешним системам',
    version: '5.11.4',
  },
];

function Settings() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: 'Основное подключение',
      endpoint: 'https://api.example.test',
      enabled: true,
    },
  });
  const [saved, setSaved] = useState('');
  return (
    <form
      onSubmit={handleSubmit((data) => setSaved(JSON.stringify(data, null, 2)))}
      style={{ maxWidth: 520 }}
    >
      <h1>Настройки подключения</h1>
      <FormInput
        control={control}
        name="name"
        label="Название"
        rules={{ required: { value: true, message: 'Введите название' } }}
      />
      <FormInput
        control={control}
        name="endpoint"
        label="Адрес сервиса"
        rules={{ required: { value: true, message: 'Введите адрес' } }}
      />
      <FormSwitch
        control={control}
        name="enabled"
        label="Подключение включено"
      />
      <Button type="primary" htmlType="submit">
        Сохранить
      </Button>
      {saved && (
        <div role="status">
          <p>Сохранено в примере:</p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {saved}
          </pre>
        </div>
      )}
    </form>
  );
}

function ModulesTable() {
  const [query, setQuery] = useState('');
  return (
    <>
      <h1>Модули</h1>
      <ConfigTable
        rowKey="id"
        dataSource={modules.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        )}
        columns={[
          { title: 'Название', dataIndex: 'name' },
          { title: 'Версия', dataIndex: 'version', width: 100 },
        ]}
        isAddBtn={false}
        searchValue={query}
        totalItemsCount={modules.length}
        onSearch={setQuery}
        onResetSearch={() => setQuery('')}
        pagination={false}
      />
    </>
  );
}

function ThreeColumns() {
  const [selected, setSelected] = useState(['mapping', 'test', 'handler']);
  const [queries, setQueries] = useState(['', '', '']);
  const lists = [
    modules,
    selected[0]
      ? [
          { id: 'test', name: 'Тестовая среда' },
          { id: 'production', name: 'Рабочая среда' },
        ]
      : [],
    selected[1]
      ? [
          { id: 'handler', name: 'Обработка сообщения' },
          { id: 'validation', name: 'Проверка структуры' },
        ]
      : [],
  ];
  return (
    <div className="application-story__columns">
      {lists.map((items, index) => (
        <div className="application-story__column" key={index}>
          <Column
            title={['Модули', 'Среды', 'Обработчики'][index]}
            items={items.filter((item) =>
              item.name.toLowerCase().includes(queries[index].toLowerCase()),
            )}
            totalItemsCount={items.length}
            searchValue={queries[index]}
            selectedItemId={selected[index]}
            setSelectedItemId={(id) =>
              setSelected((previous) =>
                previous.map((value, i) =>
                  i < index ? value : i === index ? id : '',
                ),
              )
            }
            onChangeSearchValue={(value) =>
              setQueries((previous) =>
                previous.map((old, i) => (i === index ? value : old)),
              )
            }
            renderItems={(item) => (
              <div className="application-story__item">{item.name}</div>
            )}
            showAddBtn={false}
            showUpdateBtn={false}
            showRemoveBtn={false}
          />
        </div>
      ))}
    </div>
  );
}

function ApplicationExample() {
  const { theme } = useDesignPreview();
  const scheme = theme === 'dark' ? 'dark' : 'light';
  const [path, setPath] = useState('/home');
  const pageStyle = { height: '100%' };
  const homeAction = (
    <Button type="primary" onClick={() => setPath('/home')}>
      На главную
    </Button>
  );
  return (
    <Layout className="application-story">
      <LayoutSider
        breakpoint="md"
        collapsedWidth={80}
        theme={scheme}
        style={{ height: '100%' }}
      >
        <LayoutMenu
          currentPath={path}
          theme={scheme}
          menuConfig={[
            { key: 'home', label: 'Главная', permissions: [] },
            ...navigationConfig.filter((item) =>
              ['applications', 'modules', 'settings'].includes(item.key),
            ),
          ]}
          onHideMenuItem={() => false}
          onClickItem={({ key }) => setPath(`/${key}`)}
        />
      </LayoutSider>
      <Layout className="application-story__main">
        <header className="application-story__header">
          <strong>Управление сервисами</strong>
          <Space wrap>
            <Tag>Демонстрация</Tag>
            <Button size="small" onClick={() => setPath('/error')}>
              Ошибка 500
            </Button>
            <Button size="small" onClick={() => setPath('/missing')}>
              Страница 404
            </Button>
          </Space>
        </header>
        <Layout.Content className="application-story__content">
          {path === '/home' ? (
            <HomePage style={pageStyle}>
              <section style={{ maxWidth: 480 }}>
                <h1>Добро пожаловать</h1>
                <p>
                  Откройте модули, рабочую область с тремя колонками или
                  настройки.
                </p>
                <Space wrap>
                  <Button type="primary" onClick={() => setPath('/modules')}>
                    Открыть модули
                  </Button>
                  <Button onClick={() => setPath('/applications')}>
                    Рабочая область
                  </Button>
                </Space>
              </section>
            </HomePage>
          ) : path === '/error' ? (
            <ErrorPage style={pageStyle}>
              <Space wrap>
                <Button type="primary" onClick={() => setPath('/modules')}>
                  Повторить загрузку
                </Button>
                {homeAction}
              </Space>
            </ErrorPage>
          ) : path === '/missing' ? (
            <NotFoundPage style={pageStyle}>{homeAction}</NotFoundPage>
          ) : path === '/applications' ? (
            <ThreeColumns />
          ) : (
            <div className="application-story__body">
              {path === '/modules' ? <ModulesTable /> : <Settings />}
            </div>
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

const meta = {
  title: 'Редизайн/Приложение',
  component: ApplicationExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Общая композиция обновлённого кита: меню, шапка, ThreeColumns, таблица, форма и служебные страницы. Переходы, поиск и сохранение работают на локальных данных. Меню задаёт раздел, кнопки в шапке показывают 500/404. Высота страницы ограничена каркасом, Sider и страницы используют height: 100%. На узком экране Sider сворачивается, а рабочие колонки прокручиваются горизонтально. Тема и ширина управляются панелью Storybook. Это демонстрация композиции, без router, API и PcsKit.',
      },
    },
  },
} satisfies Meta<typeof ApplicationExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Example: Story = { name: 'Полный каркас приложения' };
