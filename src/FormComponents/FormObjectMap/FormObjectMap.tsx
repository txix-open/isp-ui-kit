import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useController } from 'react-hook-form';

import './form-object-map.scss';
import {
  FieldEsiPropsType,
  ObjectEntriesValueType,
  ObjectFieldRendererPropsType,
} from '../ConfigForm';

export const ObjectFieldRenderer = ({
  name,
  control,
}: ObjectFieldRendererPropsType) => {
  const [entries, setEntries] = useState<FieldEsiPropsType>([]);
  const {
    field: { value },
  } = useController({ name, control });

  useEffect(() => {
    if (value && entries.length === 0) {
      setEntries(Object.entries(value));
    }
  }, [value]);
  const entriesToObject = (entries: FieldEsiPropsType) =>
    entries.reduce(
      (obj, [key, value]) => (key ? { ...obj, [key]: value } : obj),
      {},
    );

  const handleAddField = () => {
    const updatedEntries = [...entries, ['', '']];
    setEntries(updatedEntries);
  };

  const handleRemoveField = (
    index: number,
    onChange: (el: ObjectEntriesValueType) => void,
  ) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    onChange(entriesToObject(updatedEntries));
  };

  const getUpdatedEntries = (index: number, newValue: string, order: number) =>
    entries.map((entry, i) => {
      if (order === 0) {
        return i === index ? [newValue, entry[1]] : entry;
      }
      return i === index ? [entry[0], newValue] : entry;
    });

  const handleChangeKey = (
    index: number,
    newKey: string,
    onChange: (el: ObjectEntriesValueType) => void,
  ) => {
    const updatedEntries = getUpdatedEntries(index, newKey, 0);
    setEntries(updatedEntries);
    onChange(entriesToObject(updatedEntries));
  };

  const handleChangeValue = (
    index: number,
    newValue: string,
    onChange: (el: ObjectEntriesValueType) => void,
  ) => {
    const updatedEntries = getUpdatedEntries(index, newValue, 1);
    setEntries(updatedEntries);
    onChange(entriesToObject(updatedEntries));
  };
  const renderConditionFields = (
    onChange: (el: ObjectEntriesValueType) => void,
  ) => (
    <>
      {entries.map(([key, value], index) => (
        <div key={index} className="object-component__field">
          <Input
            data-testid={`object-component__key-${index}`}
            placeholder="Ключ"
            value={key}
            onChange={(e) => handleChangeKey(index, e.target.value, onChange)}
          />
          <Input
            data-testid={`object-component__value-${index}`}
            placeholder="Значение"
            value={value}
            onChange={(e) => handleChangeValue(index, e.target.value, onChange)}
          />
          <Button
            data-testid={`object-component__remove-btn-${index}`}
            className="object-component__field__remove-btn"
            danger
            type="primary"
            onClick={() => handleRemoveField(index, onChange)}
            icon={<DeleteOutlined />}
          />
        </div>
      ))}
    </>
  );
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="object-component">
          <div className="object-component__content">
            {renderConditionFields(field.onChange)}
          </div>
          <div className="object-component__add-btn">
            <span className="object-component__add-btn__description">
              Добавить ключ
            </span>
            <Button
              data-testid="object-component__add-btn"
              className="object-component__add-btn__btn"
              onClick={handleAddField}
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
            />
          </div>
        </div>
      )}
    />
  );
};

export default ObjectFieldRenderer;
