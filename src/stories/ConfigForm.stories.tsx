import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { ConfigForm } from '../FormComponents';
import { FieldType, InputType } from '../FormComponents/ConfigForm';
import './styles.scss';

const meta: Meta<typeof ConfigForm> = {
  component: ConfigForm,
  title: 'FormComponents/RenderFormFields',
  args: {
    config: {
      name: 'RenderFields',
      id: 'configId',
      fieldId: '',
      endpoints: {
        create: {
          method: 'POST',
          endpoint: '/api/create',
        },
        update: {
          method: 'POST',
          endpoint: '/api/update',
        },
        delete: {
          method: 'DELETE',
          endpoint: '/api/delete',
        },
        getList: {
          method: 'GET',
          endpoint: '/api/get-list',
        },
        getOne: {
          method: 'GET',
          endpoint: '/api/get-one',
        },
      },
      fields: [
        {
          id: 'objectField',
          name: 'objectField',
          label: 'Object Field',
          type: FieldType.OBJECT,
          inputType: InputType.INPUT,
          settings: {
            rules: {
              required: true,
              min: 1,
              max: 10,
              minLength: 5,
              maxLength: 100,
            },
          },
        },
        {
          id: 'arrayField',
          name: 'arrayField',
          label: 'Array Field',
          type: FieldType.ARRAY,
          inputType: InputType.INPUT,
          settings: {},
        },
        {
          id: 'INPUT',
          name: 'INPUT',
          label: 'INPUT',
          type: FieldType.SINGLE,
          inputType: InputType.INPUT,
          settings: {},
        },
        {
          id: 'SELECT',
          name: 'SELECT',
          label: 'SELECT',
          type: FieldType.SINGLE,
          inputType: InputType.SELECT,
          settings: {
            options: [
              {
                value: 'das',
                label: 'fas',
              },
            ],
          },
        },
        {
          id: 'INPUT_PASSWORD',
          name: 'INPUT_PASSWORD',
          label: 'INPUT_PASSWORD',
          type: FieldType.SINGLE,
          inputType: InputType.INPUT_PASSWORD,
          settings: {},
        },
        {
          id: 'INPUT_NUMBER',
          name: 'INPUT_NUMBER',
          label: 'INPUT_NUMBER',
          type: FieldType.SINGLE,
          inputType: InputType.INPUT_NUMBER,
          settings: {},
        },
        {
          id: 'TEXT_AREA',
          name: 'TEXT_AREA',
          label: 'TEXT_AREA',
          type: FieldType.SINGLE,
          inputType: InputType.TEXT_AREA,
          settings: {},
        },
        {
          id: 'CHECKBOX',
          name: 'CHECKBOX',
          label: 'CHECKBOX',
          type: FieldType.SINGLE,
          inputType: InputType.CHECKBOX,
          settings: {},
        },
        {
          id: 'RADIO_GROUP',
          name: 'RADIO_GROUP',
          label: 'RADIO_GROUP',
          type: FieldType.SINGLE,
          inputType: InputType.RADIO_GROUP,
          settings: {
            options: [
              {
                value: 'test1',
                label: 'test1',
              },
              {
                value: 'test2',
                label: 'test2',
              },
            ],
          },
        },
        {
          id: 'MULTI_SELECT',
          name: 'MULTI_SELECT',
          label: 'MULTI_SELECT',
          type: FieldType.SINGLE,
          inputType: InputType.MULTI_SELECT,
          settings: {
            options: [
              {
                value: 'test1',
                label: 'test1',
              },
              {
                value: 'test2',
                label: 'test2',
              },
            ],
          },
        },
      ],
    },
    crudApi: {},
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент RenderFormFields рендерит поля формы на основе переданного конфига.',
      },
    },
  },
  argTypes: {
    config: {
      description: 'Конфигурация полей формы.',
    },
    crudApi: {
      description:
        'Объект CRUD API содержащий методы {create, update, delete, getList}',
    },
    onSubmit: {
      description: 'Коллбэк, вызываемый при успешной отправке формы.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConfigForm>;

const onSubmit = (data: unknown) => console.log('Form Submitted:', data);

export const Default: Story = {
  render: (args) => {
    const methods = useForm();
    const { control, handleSubmit } = methods;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ConfigForm {...args} onSubmit={onSubmit} />
      </form>
    );
  },
};

export const Validation: Story = {
  render: (args) => {
    const methods = useForm();
    const { handleSubmit, setError } = methods;

    setError('INPUT', {
      type: 'required',
      message: 'Поле обязательно для заполнения.',
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <ConfigForm {...args} onSubmit={onSubmit} />
      </form>
    );
  },
};
