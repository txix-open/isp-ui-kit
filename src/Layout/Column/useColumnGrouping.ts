import { useEffect, useMemo, useRef, useState } from 'react';
import { ColumnItem, GroupedItems } from './column.type';
import {
  areSameStringSets,
  getAllGroupKeys,
  groupItems,
  hasValue,
  NO_GROUP_KEY,
  sortItemsByField,
} from './column.utils';

type UseColumnGroupingParams<T extends object> = {
  items: ColumnItem<T>[];
  groupBy?: keyof T;
  searchValue: string;
  selectedItemId: string;
  sortValue?: keyof T;
  directionValue?: string;
  sortGroups?: (a: string, b: string) => number;
};

type UseColumnGroupingResult<T extends object> = {
  groupedItems: GroupedItems<T>;
  sortedGroupedItems: GroupedItems<T>;
  shouldShowGroups: boolean;
  activeGroupKeys: string[];
  handleCollapseChange: (keys: string | string[]) => void;
};

export const useColumnGrouping = <T extends object>({
  items,
  groupBy,
  searchValue,
  selectedItemId,
  sortValue,
  directionValue,
  sortGroups,
}: UseColumnGroupingParams<T>): UseColumnGroupingResult<T> => {
  const [activeGroupKeys, setActiveGroupKeys] = useState<string[]>([]);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const prevSearchValueRef = useRef(searchValue);

  const groupedItems = useMemo(
    () => groupItems(items, groupBy),
    [items, groupBy],
  );

  const shouldShowGroups = useMemo(() => {
    if (!groupBy) return false;
    return Object.keys(groupedItems.grouped).length > 0;
  }, [groupBy, groupedItems]);

  const findSelectedItemGroup = useMemo(() => {
    if (!selectedItemId || !groupBy) return null;

    const activeItem = items.find(
      (item) => item.id.toString() === selectedItemId,
    );
    if (!activeItem) return null;

    const groupKey = activeItem[groupBy];
    if (!hasValue(groupKey)) return NO_GROUP_KEY;
    return String(groupKey);
  }, [selectedItemId, items, groupBy]);

  const groupsWithSearchResults = useMemo(() => {
    if (!searchValue || !groupBy) return new Set<string>();

    const result = new Set<string>();

    Object.entries(groupedItems.grouped).forEach(
      ([groupKey, groupItemsByKey]) => {
        const hasMatch = groupItemsByKey.some((item) =>
          item.name
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        );
        if (hasMatch) {
          result.add(groupKey);
        }
      },
    );

    if (groupedItems.ungrouped.length > 0) {
      const hasMatchInUngrouped = groupedItems.ungrouped.some((item) =>
        item.name.toString().toLowerCase().includes(searchValue.toLowerCase()),
      );
      if (hasMatchInUngrouped) {
        result.add(NO_GROUP_KEY);
      }
    }

    return result;
  }, [searchValue, groupBy, groupedItems]);

  useEffect(() => {
    if (!shouldShowGroups) return;

    const allGroupKeys = getAllGroupKeys(
      groupedItems.grouped,
      groupedItems.ungrouped.length > 0,
    );

    if (
      activeGroupKeys.length === 0 &&
      !isCollapse &&
      (!searchValue || searchValue.trim() === '')
    ) {
      if (allGroupKeys.length > 0) {
        setActiveGroupKeys(allGroupKeys);
      }
      return;
    }

    if (groupBy) {
      if (searchValue && searchValue.trim() !== '') {
        const groupsToOpen = Array.from(groupsWithSearchResults);
        if (!areSameStringSets(activeGroupKeys, groupsToOpen)) {
          if (groupsToOpen.length > 0) {
            setActiveGroupKeys(groupsToOpen);
            setIsCollapse(true);
          }
        }
        return;
      }

      const isSearchCleared =
        prevSearchValueRef.current.trim() !== '' && searchValue.trim() === '';
      if (!searchValue || searchValue.trim() === '') {
        if (isSearchCleared) {
          if (isCollapse) {
            setIsCollapse(false);
          }
          if (!areSameStringSets(activeGroupKeys, allGroupKeys)) {
            setActiveGroupKeys(allGroupKeys);
          }
        }
        return;
      }
    }

    if (
      findSelectedItemGroup &&
      !isCollapse &&
      !activeGroupKeys.includes(findSelectedItemGroup)
    ) {
      setActiveGroupKeys((prev) => [...prev, findSelectedItemGroup]);
    }
  }, [
    shouldShowGroups,
    activeGroupKeys,
    isCollapse,
    groupedItems,
    searchValue,
    groupBy,
    groupsWithSearchResults,
    findSelectedItemGroup,
  ]);

  useEffect(() => {
    prevSearchValueRef.current = searchValue;
  }, [searchValue]);

  const sortedGroupedItems = useMemo(() => {
    const { grouped, ungrouped } = groupedItems;
    const sortedGroupKeys = Object.keys(grouped).sort(
      sortGroups || ((a, b) => a.localeCompare(b)),
    );
    const sortedGroups: Record<string, ColumnItem<T>[]> = {};

    sortedGroupKeys.forEach((key) => {
      sortedGroups[key] = sortItemsByField(
        grouped[key],
        sortValue,
        directionValue,
      );
    });

    return {
      grouped: sortedGroups,
      ungrouped: sortItemsByField(ungrouped, sortValue, directionValue),
    };
  }, [groupedItems, sortValue, directionValue, sortGroups]);

  const handleCollapseChange = (keys: string | string[]) => {
    const newKeys = Array.isArray(keys) ? keys : [keys];
    setActiveGroupKeys(newKeys);

    const allPossibleGroups = [
      ...Object.keys(groupedItems.grouped),
      ...(groupedItems.ungrouped.length > 0 ? [NO_GROUP_KEY] : []),
    ];

    if (newKeys.length === allPossibleGroups.length) {
      setIsCollapse(false);
      return;
    }

    if (
      (newKeys.length === 0 && allPossibleGroups.length > 0) ||
      (newKeys.length > 0 && newKeys.length < allPossibleGroups.length)
    ) {
      setIsCollapse(true);
    }
  };

  return {
    groupedItems,
    sortedGroupedItems,
    shouldShowGroups,
    activeGroupKeys,
    handleCollapseChange,
  };
};
