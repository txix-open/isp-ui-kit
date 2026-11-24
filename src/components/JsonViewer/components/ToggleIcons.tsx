import { useViewer } from '../context';
import type { IconStyle } from '../json-viewer.type';
import {
  ArrowDown,
  ArrowRight,
  CircleMinus,
  CirclePlus,
  SquareMinus,
  SquarePlus,
} from './icons';

interface ToggleIconProps {
  iconStyle: IconStyle;
}

/** Иконка раскрытого узла (1:1 порт legacy ToggleIcons). */
export const ExpandedIcon = ({ iconStyle }: ToggleIconProps) => {
  const { style } = useViewer();

  switch (iconStyle) {
    case 'triangle':
      return (
        <ArrowDown {...style('expanded-icon')} className="expanded-icon" />
      );
    case 'square':
      return (
        <SquareMinus {...style('expanded-icon')} className="expanded-icon" />
      );
    default:
      return (
        <CircleMinus {...style('expanded-icon')} className="expanded-icon" />
      );
  }
};

/** Иконка свёрнутого узла. */
export const CollapsedIcon = ({ iconStyle }: ToggleIconProps) => {
  const { style } = useViewer();

  switch (iconStyle) {
    case 'triangle':
      return (
        <ArrowRight {...style('collapsed-icon')} className="collapsed-icon" />
      );
    case 'square':
      return (
        <SquarePlus {...style('collapsed-icon')} className="collapsed-icon" />
      );
    default:
      return (
        <CirclePlus {...style('collapsed-icon')} className="collapsed-icon" />
      );
  }
};
