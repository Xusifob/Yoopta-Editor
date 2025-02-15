import { YooptaBlockData } from '@yoopta/editor';

export const getHtmlElement = (block: YooptaBlockData) => {
  return block.value[0];
};
