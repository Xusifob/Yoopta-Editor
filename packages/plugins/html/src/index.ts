import { HTML } from './plugin';
import { HTMLElement } from './types';

declare module 'slate' {
  interface CustomTypes {
    Element: HTMLElement;
  }
}

export { HTMLCommands } from './commands';

export default HTML;
export { HTMLElement };
