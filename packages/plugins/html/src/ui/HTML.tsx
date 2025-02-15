import {
  useBlockData,
  PluginCustomEditorRenderProps,
} from '@yoopta/editor';

import { useRef, useState } from 'react';
import {getHtmlElement} from "../utils/element";

const CodeEditor = ({ blockId }: PluginCustomEditorRenderProps) => {

  const block = useBlockData(blockId);

  const element = getHtmlElement(block) as HTMLElement;

  console.log(element);

  return (
      <div dangerouslySetInnerHTML={{__html: element}} contentEditable={false} />
  );
};

export { CodeEditor };
