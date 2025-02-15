import { generateId, YooptaPlugin } from '@yoopta/editor';
import { HTMLCommands } from '../commands';

const HTML = new YooptaPlugin({
  type: 'Html',
  elements: {
    code: {
      render: (props) => {
        // Render the raw HTML content
        return <div dangerouslySetInnerHTML={{ __html: props.children }} />;
      },
    },
  },
  options: {
    display: {
      title: 'HTML Element',
      description: 'This is your HTML element!',
    },
    shortcuts: ['html'],
  },
  commands: HTMLCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DIV'],
        parse: (el) => {
          if (el.nodeName === 'DIV' && el.getAttribute('data-type') === 'html') {
            // Extract the inner HTML content
            const content = el.innerHTML;

            return {
              children: content,
              type: 'html',
              id: generateId(),
            };
          }
        },
      },
      serialize: (element, text, blockMeta) => {

        console.log(element);

        return `<div data-type="html" >${element.children}</div>`.toString();
      },
    },
    markdown: {
      serialize: (element, text) => {
        // TODO
        return '';
      },
    },
    email: {
      serialize: (element, text, blockMeta) => {
        // TODO
        return '';
      },
    },
  },
});


export { HTML };
