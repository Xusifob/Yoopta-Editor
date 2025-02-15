import { generateId, SlateEditor, YooEditor } from '@yoopta/editor';
import { Editor, Element, Location, Span, Transforms } from 'slate';
import { BadgeElement, BadgeElementProps } from '../types';

type BadgeElementOptions = {
  props: Omit<BadgeElementProps, 'nodeType'>;
};

type BadgeInsertOptions = BadgeElementOptions & {
  selection?: Location | undefined;
  slate: SlateEditor;
};

type DeleteElementOptions = {
  slate: SlateEditor;
};

export type BadgeCommands = {
  buildBadgeElements: (editor: YooEditor, options: BadgeElementOptions) => BadgeElement;
  insertBadge: (editor: YooEditor, options: BadgeInsertOptions) => void;
  deleteBadge: (editor: YooEditor, options: DeleteElementOptions) => void;
};

export const BadgeCommands: BadgeCommands = {
  buildBadgeElements: (editor, options) => {
    const { props } = options || {};
    const badgeProps: BadgeElementProps = { ...props, nodeType: 'inline' };
    return {
      id: generateId(),
      type: 'badge',
      children: [{ text: props?.title || '' }],
      props: badgeProps,
    } as BadgeElement;
  },
  insertBadge: (editor, options) => {
    let { props, slate } = options || {};

    if (!slate || !slate.selection) return;

    const textInSelection = Editor.string(slate, slate.selection);

    const badgeProps = {
      ...props,
      title: props.title || textInSelection || '',
      nodeType: 'inline',
    } as BadgeElementProps;

    const badgeElement = BadgeCommands.buildBadgeElements(editor, { props });

    const [badgeNodeEntry] = Editor.nodes<BadgeElement>(slate, {
      at: slate.selection,
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'badge',
    });

    if (badgeNodeEntry) {
      const [badge, path] = badgeNodeEntry;

      Transforms.setNodes(
        slate,
        { props: { ...badge?.props, ...badgeProps, nodeType: 'inline' } },
        {
          match: (n) => Element.isElement(n) && n.type === 'badge',
          at: path,
        },
      );

      Editor.insertText(slate, badgeProps.title || badgeProps.color || '', { at: slate.selection });
      Transforms.collapse(slate, { edge: 'end' });
      return;
    }

    Transforms.wrapNodes(slate, badgeElement, { split: true, at: slate.selection });
    Transforms.setNodes(
      slate,
      { text: props?.title || '' },
      {
        at: slate.selection,
        mode: 'lowest',
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'badge',
      },
    );

    Editor.insertText(slate, props?.title || '', { at: slate.selection });
    Transforms.collapse(slate, { edge: 'end' });
  },
  deleteBadge: (editor, options) => {
    try {
      const { slate } = options;
      if (!slate || !slate.selection) return;

      const [badgeNodeEntry] = Editor.nodes(slate, {
        at: slate.selection,
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'badge',
      });

      if (badgeNodeEntry) {
        Transforms.unwrapNodes(slate, {
          match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'badge',
          at: slate.selection,
        });
      }
    } catch (error) {}
  },
};
