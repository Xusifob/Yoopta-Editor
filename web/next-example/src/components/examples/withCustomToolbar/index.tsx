import YooptaEditor, {createYooptaEditor, createYooptaMark} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useMemo, useRef, useState } from 'react';
import { WITH_CUSTOM_TOOLBAR_INIT_VALUE } from './initValue';
import { NotionToolbar } from '@/components/Toolbars/NotionToolbar/NotionToolbar';
import { CheckIcon } from 'lucide-react';

const lineHeightMark = createYooptaMark({
  type: 'lineHeight', // Unique identifier for the mark

  render: ({children,leaf}) => {
    return <span style={{ lineHeight: leaf.lineHeight.value }}>{children}</span>;

  },
});

const variableMark = createYooptaMark({
  type: 'variable', // Unique identifier for the mark


  render: ({children,leaf}) => {
    return (<span><span style={{border: '1px solid red'}} >{leaf.variable.value}</span>{children}</span>)

  },
});


const plugins = [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        const data = await uploadToCloudinary(file, 'image');

        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
  Video.extend({
    options: {
      onUpload: async (file) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
      onUploadPoster: async (file) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
  }),
  File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
      },
    },
  }),
];

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight,lineHeightMark,variableMark];

const DEFAULT_STATE = {
  notion: true,
  medium: false,
};

type State = typeof DEFAULT_STATE;

function WithCustomToolbar() {
  const [toolbars, setToolbars] = useState<State>(DEFAULT_STATE);
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  window.editor = editor;

  const tools = useMemo(() => {
    return {
      ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
      },
      Toolbar: {
        render: NotionToolbar,
        tool: Toolbar,
      },
      LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool,
      },
    };
  }, [toolbars]);

  return (
    <div
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center flex-col items-center"
      ref={selectionRef}
    >
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        tools={tools}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={WITH_CUSTOM_TOOLBAR_INIT_VALUE}
      />
    </div>
  );
}

export default WithCustomToolbar;
