import { Badge } from './plugin';
import './styles.css';
import { BadgeElement, BadgeElementProps } from './types';

declare module 'slate' {
  interface CustomTypes {
    Element: BadgeElement;
  }
}

export { BadgeCommands } from './commands';

export { BadgeElement, BadgeElementProps };

export default Badge;
