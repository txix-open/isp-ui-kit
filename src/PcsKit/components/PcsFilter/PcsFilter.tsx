import { Card, Dropdown, Form } from 'antd';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { PcsTuningIcon } from '../../assets/icons';
import PcsFilterFieldControl from './PcsFilterFieldControl';
import type { PcsFilterField } from './pcsFilterField.type';

import './PcsFilter.scss';

export interface PcsFilterLabels {
  apply: ReactNode;
  cancel: ReactNode;
  reset: ReactNode;
  triggerAriaLabel: string;
}

export interface PcsFilterProps {
  fields: PcsFilterField[];
  values?: Record<string, unknown>;
  onApply: (values: Record<string, unknown>) => void;
  onReset: () => void;
  inline?: boolean;
  labels?: Partial<PcsFilterLabels>;
  trigger?: ReactNode;
}

const DEFAULT_FILTER_LABELS: PcsFilterLabels = {
  apply: 'Применить',
  cancel: 'Отмена',
  reset: 'Сбросить фильтры',
  triggerAriaLabel: 'Открыть фильтры',
};

const PcsFilter = ({
  fields,
  values,
  onApply,
  onReset,
  inline = false,
  labels,
  trigger,
}: PcsFilterProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const filterLabels = {
    ...DEFAULT_FILTER_LABELS,
    ...labels,
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(values || {});
    }
  }, [form, open, values]);

  const handleApply = () => {
    form.validateFields().then((values) => {
      onApply(values);
      setOpen(false);
    });
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const triggerNode =
    trigger ||
    (inline ? (
      <button
        aria-label={filterLabels.triggerAriaLabel}
        className="pcs-filter__trigger"
        type="button"
      >
        <PcsTuningIcon className="pcs-filter__icon" aria-hidden="true" />
      </button>
    ) : (
      <button
        aria-label={filterLabels.triggerAriaLabel}
        className="pcs-filter__button"
        type="button"
      >
        <PcsTuningIcon className="pcs-filter__icon" aria-hidden="true" />
      </button>
    ));

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      classNames={{ root: 'pcs-filter__overlay' }}
      popupRender={() => (
        <Card className="pcs-filter__dropdown">
          <Form form={form} layout="horizontal" className="pcs-filter__form">
            {fields.map((field) => (
              <Form.Item key={field.name} name={field.name} label={field.label}>
                <PcsFilterFieldControl field={field} />
              </Form.Item>
            ))}
            <div className="pcs-filter__actions">
              <button
                className="pcs-filter__reset"
                type="button"
                onClick={handleReset}
              >
                {filterLabels.reset}
              </button>
              <div className="pcs-filter__buttons">
                <button
                  className="pcs-filter__action pcs-filter__action--silver"
                  type="button"
                  onClick={handleCancel}
                >
                  {filterLabels.cancel}
                </button>
                <button
                  className="pcs-filter__action pcs-filter__action--lightblue"
                  type="button"
                  onClick={handleApply}
                >
                  {filterLabels.apply}
                </button>
              </div>
            </div>
          </Form>
        </Card>
      )}
      trigger={['click']}
      placement="bottomLeft"
    >
      {triggerNode}
    </Dropdown>
  );
};

export default PcsFilter;
