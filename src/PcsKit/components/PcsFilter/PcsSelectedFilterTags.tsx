import PcsTagList from '../../ui/PcsTagList/PcsTagList';

import type { PcsFilterField } from './pcsFilterField.type';
import {
  buildPcsSelectedFilterTags,
  removeSelectedFilterValue,
} from './pcsFilterTagUtils';

export interface PcsSelectedFilterTagsProps {
  fields: PcsFilterField[];
  values?: Record<string, unknown>;
  className?: string;
  tagClassName?: string;
  onChange: (values: Record<string, unknown>) => void;
}

const PcsSelectedFilterTags = ({
  fields,
  values = {},
  className,
  tagClassName,
  onChange,
}: PcsSelectedFilterTagsProps) => {
  const tags = buildPcsSelectedFilterTags(fields, values);

  return (
    <PcsTagList
      className={className}
      closeLabel={(tag) => `Убрать фильтр ${tag.label}`}
      tagClassName={tagClassName}
      tags={tags}
      onRemove={(tag) => {
        onChange(removeSelectedFilterValue(values, tag));
      }}
    />
  );
};

export default PcsSelectedFilterTags;
