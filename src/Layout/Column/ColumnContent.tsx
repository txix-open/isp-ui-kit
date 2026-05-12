import { Collapse, List, Skeleton } from 'antd';
import { ReactNode } from 'react';
import { ColumnItem, GroupedItems } from './column.type';
import { NO_GROUP_KEY } from './column.utils';

const { Panel } = Collapse;

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

  const panels: ReactNode[] = [];

  if (Object.keys(sortedGroupedItems.grouped).length > 0) {
    Object.entries(sortedGroupedItems.grouped).forEach(
      ([groupKey, groupItems]) => {
        panels.push(
          <Panel
            key={groupKey}
            header={
              renderHeaderGroup
                ? renderHeaderGroup(groupKey, groupItems)
                : `${groupKey} (${groupItems.length})`
            }
          >
            <List dataSource={groupItems} renderItem={renderItem} />
          </Panel>,
        );
      },
    );
  }

  if (sortedGroupedItems.ungrouped.length > 0) {
    panels.push(
      <Panel
        key={NO_GROUP_KEY}
        header={`Без группы (${sortedGroupedItems.ungrouped.length})`}
      >
        <List
          dataSource={sortedGroupedItems.ungrouped}
          renderItem={renderItem}
        />
      </Panel>,
    );
  }

  return (
    <Collapse
      activeKey={activeGroupKeys}
      onChange={onCollapseChange}
      className="column__groups"
    >
      {panels}
    </Collapse>
  );
};

export default ColumnContent;
