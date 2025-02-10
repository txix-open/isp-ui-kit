import React, { useEffect, useState } from 'react';
import { Controller, useController } from 'react-hook-form';
import { Button, Input, Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { FormArrayMapProps } from './form-array-map.type';

import './form-array-map.scss';

const FormArrayMap = ({
  name,
  control,
  label,
  controlClassName = '',
}: FormArrayMapProps) => {
  const [entries, setEntries] = useState<unknown[]>([]);
  const {
    field: { value },
  } = useController({ name, control });

  useEffect(() => {
    if (value && entries.length === 0) {
      setEntries(value.map((el: unknown) => String(el)));
    }
  }, [value]);

  const handleAdd = () => {
    const updatedEntries = [...entries, ''];
    setEntries(updatedEntries);
  };

  const handleRemoveField = (
    index: number,
    onChange: (el: unknown[]) => void,
  ) => {
    const updatedEntries = entries.filter((value, i) => i !== index);
    setEntries(updatedEntries);
    onChange(updatedEntries.filter((entry) => entry !== ''));
  };

  const getUpdatedEntries = (index: number, newValue: string) =>
    entries.map((entry, i) => {
      return i === index ? newValue : entry;
    });

  const handleChange = (
    index: number,
    newKey: string,
    onChange: (el: unknown[]) => void,
  ) => {
    const updatedEntries = getUpdatedEntries(index, newKey);
    setEntries(updatedEntries);
    onChange(updatedEntries.filter((entry) => entry !== ''));
  };

  return (
    <div>
      {entries.map((item, index) => (
        <div className="form-array-map" key={index}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <>
                <Form.Item
                  className={controlClassName}
                  labelCol={{ span: 24 }}
                  label={
                    label
                      ? `${label}-${index + 1}`
                      : `Элемент массива-${index + 1}`
                  }
                >
                  <div className="form-array-map__wrapper">
                    <Input
                      onChange={(e) =>
                        handleChange(index, e.target.value, field.onChange)
                      }
                      value={String(item)}
                      placeholder="Значение"
                    />
                    <Button
                      danger
                      type="primary"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveField(index, field.onChange)}
                    />
                  </div>
                </Form.Item>
              </>
            )}
          />
        </div>
      ))}
      <Button className="form-array-map__btn" onClick={handleAdd}>
        Добавить новый элемент
      </Button>
    </div>
  );
};

export default FormArrayMap;
