import { SlateElement } from '@yoopta/editor';

export type ColorType = 'success' | 'danger' | 'warning';

export type BadgePluginElementKeys = 'badge';
export type BadgeElementProps = {
  color: ColorType;
  nodeType: string;
  title?: string | null;
};
export type BadgeElement = SlateElement<'badge', BadgeElementProps>;

export type BadgeElementMap = {
  badge: BadgeElement;
};
