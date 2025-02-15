import { Blocks, buildBlockData, generateId, YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { HTMLElement } from '../types';

type HTMLElementOptions = {
  text?: string;
  props?: {
    children: string
  };
};

type InsertHTMLOptions = HTMLElementOptions & {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type HTMLCommands = {
  buildHTMLElements: (editor: YooEditor, options?: Partial<HTMLElementOptions>) => HTMLElement;
  insertHTML: (editor: YooEditor, options?: Partial<InsertHTMLOptions>) => void;
  deleteHTML: (editor: YooEditor, blockId: string) => void;
};

export const HTMLCommands: HTMLCommands = {
  buildHTMLElements: (editor: YooEditor, options = {}) => {
    return { id: generateId(), type: 'HTML', children: options.children };
  },
  insertHTML: (editor: YooEditor, options = {}) => {
    const { at, focus, text, props } = options;
    const HTML = HTMLCommands.buildHTMLElements(editor, { text, props });
    const block = buildBlockData({ value: [HTML], type: 'HTML' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },
  deleteHTML: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
