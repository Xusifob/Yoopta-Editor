import { PluginElementRenderProps, useYooptaReadOnly } from '@yoopta/editor';
import { useState } from 'react';
import { BadgeElementProps } from '../types';
import { BadgeHoverPreview } from './BadgeHoverPreview';
import { useFloating, offset, flip, shift, inline, autoUpdate, useTransitionStyles } from '@floating-ui/react';

const VALID_TARGET_VALUES = ['_blank', '_self', '_parent', '_top', 'framename'];

const BadgeRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const [hovered, setHovered] = useState(false);
  const [holdBadgeTool, setHoldBadgeTool] = useState(false);
  const { className = '', ...htmlAttrs } = props.HTMLAttributes || {};

  const {
    refs: badgePreviewRefs,
    floatingStyles: badgePreviewFloatingStyles,
    context,
  } = useFloating({
    placement: 'bottom',
    open: hovered,
    onOpenChange: setHovered,
    middleware: [inline(), flip(), shift(), offset(0)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isActionMenuMounted, styles: badgePreviewTransitionStyles } = useTransitionStyles(context, {
    duration: {
      open: 200,
      close: 100,
    },
  });

  const badgePreviewStyles = { ...badgePreviewFloatingStyles, ...badgePreviewTransitionStyles };

  const { color } = props.element.props || {};
  const isReadOnly = useYooptaReadOnly();

  const badgeProps: Partial<Pick<BadgeElementProps, 'color'>> = {
    color,
  };

  const onClose = () => {
    setHoldBadgeTool(false);
    setHovered(false);
  };

  const onMouseOver = () => {
    setHovered(true);
  };

  const onMouseOut = () => {
    if (holdBadgeTool) return;
    onClose();
  };

  return (
    <span ref={badgePreviewRefs.setReference} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {extendRender ? (
        extendRender(props)
      ) : (
        <span
          {...badgeProps}
          {...htmlAttrs}
          {...props.attributes}
          draggable={true}
          contentEditable={false}
          className={`yoopta-badge color-${color} ${className}`}
        >
          {props.children}
        </span>
      )}
      {isActionMenuMounted && !isReadOnly && (
        <BadgeHoverPreview
          style={badgePreviewStyles}
          setFloating={badgePreviewRefs.setFloating}
          element={props.element}
          setHoldBadgeTool={setHoldBadgeTool}
          onClose={onClose}
          blockId={props.blockId}
        />
      )}
    </span>
  );
};

export { BadgeRender };
