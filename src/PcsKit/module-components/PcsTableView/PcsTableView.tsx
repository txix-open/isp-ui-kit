import type { ReactNode } from 'react';

import PcsFilter from '../../components/PcsFilter/PcsFilter';
import type { PcsFilterLabels } from '../../components/PcsFilter/PcsFilter';
import PcsSelectedFilterTags from '../../components/PcsFilter/PcsSelectedFilterTags';
import type { PcsFilterField } from '../../components/PcsFilter/pcsFilterField.type';
import PcsBottomMenu from '../../ui/PcsBottomMenu/PcsBottomMenu';
import type {
  PcsBottomMenuAction,
  PcsBottomMenuPlacement,
} from '../../ui/PcsBottomMenu/PcsBottomMenu';
import PcsExport from '../../ui/PcsExport/PcsExport';
import type { PcsExportOption } from '../../ui/PcsExport/PcsExport';
import PcsSearch from '../../ui/PcsSearch/PcsSearch';
import type { PcsSearchProps } from '../../ui/PcsSearch/PcsSearch';
import PcsTable from '../../ui/PcsTable/PcsTable';
import type { PcsTableProps } from '../../ui/PcsTable/PcsTable';

import './PcsTableView.scss';

export interface PcsTableViewFilterConfig {
  fields: PcsFilterField[];
  values?: Record<string, unknown>;
  labels?: Partial<PcsFilterLabels>;
  onApply: (values: Record<string, unknown>) => void;
  onReset: () => void;
  onChange?: (values: Record<string, unknown>) => void;
}

export type PcsTableViewSearchConfig = Omit<PcsSearchProps, 'filterButton'>;

export interface PcsTableViewExportConfig {
  hidden?: boolean;
  options?: PcsExportOption[];
  buttonTitle?: string;
  onExport: (count: PcsExportOption) => void;
}

export interface PcsTableViewBottomMenuConfig {
  actions: PcsBottomMenuAction[];
  ariaLabel?: string;
  className?: string;
  placement?: PcsBottomMenuPlacement;
}

export interface PcsTableViewProps<T extends object> {
  table: PcsTableProps<T>;
  actions?: ReactNode;
  bottomMenu?: PcsTableViewBottomMenuConfig;
  className?: string;
  exportAction?: PcsTableViewExportConfig;
  filter?: PcsTableViewFilterConfig;
  search?: PcsTableViewSearchConfig;
}

const PcsTableView = <T extends object>({
  table,
  actions,
  bottomMenu,
  className,
  exportAction,
  filter,
  search,
}: PcsTableViewProps<T>) => {
  const visibleExportAction = exportAction?.hidden ? undefined : exportAction;
  const visibleBottomMenu = bottomMenu?.actions.some((action) => !action.hidden)
    ? bottomMenu
    : undefined;
  const shouldRenderToolbar = Boolean(
    search || filter || visibleExportAction || actions,
  );

  const rootClassName = [
    'table-view',
    visibleBottomMenu && 'table-view--has-bottom-menu',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const filterButton = filter ? (
    <PcsFilter
      fields={filter.fields}
      inline
      labels={filter.labels}
      values={filter.values}
      onApply={filter.onApply}
      onReset={filter.onReset}
    />
  ) : null;

  return (
    <div className={rootClassName}>
      {shouldRenderToolbar && (
        <div className="table-view__toolbar">
          <div className="table-view__toolbar-main">
            {search ? (
              <PcsSearch {...search} filterButton={filterButton} />
            ) : (
              filterButton
            )}
            {visibleExportAction && (
              <PcsExport
                buttonTitle={visibleExportAction.buttonTitle}
                options={visibleExportAction.options}
                onExport={visibleExportAction.onExport}
              />
            )}
          </div>

          {actions && (
            <div className="table-view__toolbar-actions">{actions}</div>
          )}
        </div>
      )}

      {filter && (
        <div className="table-view__filter-tags">
          <PcsSelectedFilterTags
            className="table-view__selected-filter-tags"
            fields={filter.fields}
            values={filter.values}
            onChange={filter.onChange || filter.onApply}
          />
        </div>
      )}

      <PcsTable {...table} layout={table.layout || 'page'} />

      {visibleBottomMenu && (
        <PcsBottomMenu
          actions={visibleBottomMenu.actions}
          ariaLabel={visibleBottomMenu.ariaLabel}
          className={visibleBottomMenu.className}
          placement={visibleBottomMenu.placement || 'fixed'}
        />
      )}
    </div>
  );
};

export default PcsTableView;
