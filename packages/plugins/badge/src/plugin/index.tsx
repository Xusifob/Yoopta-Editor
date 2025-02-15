import { deserializeTextNodes, generateId, serializeTextNodes, YooptaPlugin } from '@yoopta/editor';
import { BadgeCommands } from '../commands';
import {BadgeElementMap, BadgeElementProps, ColorType} from '../types';
import { BadgeRender } from '../ui/BadgeRender';

const Badge = new YooptaPlugin<BadgeElementMap>({
  type: 'BadgePlugin',
  elements: {
    badge: {
      render: BadgeRender,
      props: {
        nodeType: 'inline',
        color: 'success',
        title: null
      },
    },
  },
  options: {
    display: {
      title: 'Badge',
      description: 'Create badge',
    },
  },
  commands: BadgeCommands,
  parsers: {
    html: {
      serialize: (element, text) => {
        const { title, color } = element.props;
        return `<span data-element-type="badge" title="title" data-element-color="${color}" class="color-${color}" contenteditable="false">${serializeTextNodes(element.children)}</span>`;
      },
      deserialize: {
        nodeNames: ['SPAN'],
        parse: (el, editor) => {
          if (el.nodeName === 'SPAN') {
            const href = el.getAttribute('href') || '';

            const defaultBadgeProps = editor.plugins.BadgePlugin.elements.badge.props as BadgeElementProps;

            // [TODO] Add target
            const color = (el.getAttribute('data-element-color') || defaultBadgeProps.color) as ColorType;
            const title = el.textContent || '';
            const props: BadgeElementProps = {
              color,
              nodeType: 'inline',
            };

            return {
              id: generateId(),
              type: 'badge',
              props,
              children: deserializeTextNodes(editor, el.childNodes),
            };
          }
        },
      },
    },
    email: {
      serialize: (element, text) => {
        const { color } = element.props;
        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <span data-element-type="badge" data-element-color="${color}" class="color-${color}" contenteditable="false">${serializeTextNodes(element.children)}</span>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
});

export { Badge };
