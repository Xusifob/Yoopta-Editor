import {
  Blocks,
  Elements,
  findSlateBySelectionPath,
  SlateElement,
  UI,
  useYooptaEditor,
  useYooptaTools,
} from '@yoopta/editor';
import { Copy, SquareArrowOutUpRight } from 'lucide-react';
import { useState } from 'react';
import { useFloating, offset, flip, shift, inline, autoUpdate, useTransitionStyles } from '@floating-ui/react';
import { BadgeElementProps } from '../types';
import { Editor, Element, Transforms } from 'slate';

const { Overlay, Portal } = UI;

const BadgeHoverPreview = ({ style, setFloating, element, setHoldBadgeTool, blockId, onClose }) => {
  const editor = useYooptaEditor();
  const tools = useYooptaTools();
  const [isEditBadgeToolsOpen, setIsEditBadgeToolsOpen] = useState(false);

  const {
    refs: badgeToolRefs,
    floatingStyles: badgeToolStyles,
    context,
  } = useFloating({
    placement: 'bottom',
    open: isEditBadgeToolsOpen,
    onOpenChange: (open) => {
      setIsEditBadgeToolsOpen(open);
    },
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isBadgeToolMounted, styles: badgeToolTransitionStyles } = useTransitionStyles(context, {
    duration: {
      open: 100,
      close: 100,
    },
  });

  const badgeToolEditStyles = { ...badgeToolStyles, ...badgeToolTransitionStyles, maxWidth: 400 };

  const BadgeTool = tools?.BadgeTool;
  const hasBadgeTool = !!BadgeTool;

  const onSave = (badgeProps: BadgeElementProps) => {
    Elements.updateElement(editor, blockId, {
      type: element.type,
      props: { ...element.props, ...badgeProps },
    });

    setIsEditBadgeToolsOpen(false);
    onClose();
  };

  const onDelete = () => {
    const slate = findSlateBySelectionPath(editor);
    const path = Elements.getElementPath(editor, blockId, element);

    if (!slate) return;
    const badgeNodeEntry = Elements.getElementEntry(editor, blockId, { path, type: element.type });

    if (badgeNodeEntry) {
      Transforms.unwrapNodes(slate, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && (n as SlateElement).type === element.type,
        at: path || badgeNodeEntry?.[1],
      });
    }
  };

  const onOpenBadge = () => {
    window.open(element.props.url, element.props.target || '_self');
  };

  return (
    <Portal id="yoopta-badge-preview">
      {isBadgeToolMounted && hasBadgeTool && (
        <Portal id="yoopta-badge-tool">
          <Overlay lockScroll className="yoo-badge-z-[100]" onClick={onClose}>
            <div ref={badgeToolRefs.setFloating} style={badgeToolEditStyles} onClick={(e) => e.stopPropagation()}>
              <BadgeTool editor={editor} badge={element.props} onSave={onSave} onDelete={onDelete} withTitle={false} />
            </div>
          </Overlay>
        </Portal>
      )}
      <div className="yoopta-badge-preview" style={style} ref={setFloating}>
        <span className="yoopta-badge-preview-text">{element.props.url}</span>
        <span className="yoopta-badge-preview-separator" />
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(element.props.url);
          }}
          className="yoopta-button"
        >
          <Copy size={14} strokeWidth={1} />
        </button>
        <span className="yoopta-badge-preview-separator" />
        <button type="button" onClick={onOpenBadge} className="yoopta-button">
          <SquareArrowOutUpRight size={14} strokeWidth={1} />
        </button>
        <span className="yoopta-badge-preview-separator" />
        <button
          ref={badgeToolRefs.setReference}
          type="button"
          className="yoopta-button yoopta-badge-edit-button"
          onClick={() => {
            const block = Blocks.getBlock(editor, { id: blockId });
            if (block) editor.setPath({ current: block.meta.order });

            setHoldBadgeTool((prev) => !prev);
            setIsEditBadgeToolsOpen((prev) => !prev);
          }}
        >
          Edit
        </button>
      </div>
    </Portal>
  );
};

export { BadgeHoverPreview };
