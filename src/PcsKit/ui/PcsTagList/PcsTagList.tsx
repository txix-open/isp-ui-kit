import { Tag } from 'antd';

import { PcsCloseMessageIcon } from '../../assets/icons';

import './PcsTagList.scss';

export interface PcsTagListItem {
  key: string;
  label: string;
}

export interface PcsTagListProps<Tag extends PcsTagListItem = PcsTagListItem> {
  tags: Tag[];
  className?: string;
  closeLabel?: (tag: Tag) => string;
  removable?: boolean;
  tagClassName?: string;
  onRemove?: (tag: Tag) => void;
}

const PcsTagList = <Tag extends PcsTagListItem = PcsTagListItem>({
  tags,
  className,
  closeLabel = (tag) => `Удалить ${tag.label}`,
  removable = true,
  tagClassName,
  onRemove,
}: PcsTagListProps<Tag>) => {
  if (!tags.length) return null;

  return (
    <div className={['pcs-tag-list', className].filter(Boolean).join(' ')}>
      {tags.map((tag) => (
        <Tag
          key={tag.key}
          className={['pcs-tag-list__tag', tagClassName]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="pcs-tag-list__label">{tag.label}</span>
          {removable && onRemove && (
            <button
              aria-label={closeLabel(tag)}
              className="pcs-tag-list__close"
              type="button"
              onClick={() => onRemove(tag)}
            >
              <PcsCloseMessageIcon
                className="pcs-tag-list__close-icon"
                aria-hidden="true"
              />
            </button>
          )}
        </Tag>
      ))}
    </div>
  );
};

export default PcsTagList;
