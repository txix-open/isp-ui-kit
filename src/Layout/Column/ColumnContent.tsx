import { Collapse, List, Skeleton } from 'antd';
import type { CollapseProps } from 'antd';
import { ReactNode } from 'react';
import { ColumnItem, GroupedItems } from './column.type';
import { NO_GROUP_KEY } from './column.utils';

type ColumnContentProps<T extends object> = {
  shouldShowGroups: boolean;
  sortedGroupedItems: GroupedItems<T>;
  activeGroupKeys: string[];
  onCollapseChange: (keys: string | string[]) => void;
  renderHeaderGroup?: (groupKey: string, items: ColumnItem<T>[]) => ReactNode;
  renderItem: (item: ColumnItem<T>) => ReactNode;
  isLoading?: boolean;
  hasItems: boolean;
};

const ColumnContent = <T extends object>({
  shouldShowGroups,
  sortedGroupedItems,
  activeGroupKeys,
  onCollapseChange,
  renderHeaderGroup,
  renderItem,
  isLoading,
  hasItems,
}: ColumnContentProps<T>) => {
  if (isLoading && !hasItems) {
    return <Skeleton active />;
  }

  if (!hasItems) {
    return null;
  }

  if (!shouldShowGroups) {
    const allItems = [...sortedGroupedItems.ungrouped];
    return <List dataSource={allItems} renderItem={renderItem} />;
  }

  const items: NonNullable<CollapseProps['items']> = Object.entries(
    sortedGroupedItems.grouped,
  ).map(([groupKey, groupItems]) => ({
    key: groupKey,
    className: 'column__group',
    label: renderHeaderGroup
      ? renderHeaderGroup(groupKey, groupItems)
      : `${groupKey} (${groupItems.length})`,
    children: <List dataSource={groupItems} renderItem={renderItem} />,
  }));

  if (sortedGroupedItems.ungrouped.length > 0) {
    items.push({
      key: NO_GROUP_KEY,
      className: 'column__group',
      label: `Без группы (${sortedGroupedItems.ungrouped.length})`,
      children: (
        <List
          dataSource={sortedGroupedItems.ungrouped}
          renderItem={renderItem}
        />
      ),
    });
  }

  return (
    <Collapse
      activeKey={activeGroupKeys}
      onChange={onCollapseChange}
      className="column__groups"
      items={items}
      bordered={false}
      classNames={{ header: 'column__group-header' }}
      styles={{
        body: { padding: 0, background: 'var(--ant-color-bg-container)' },
      }}
    />
  );
};

export default ColumnContent;
