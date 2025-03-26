import React from 'react';

// Material Icons glyph map
const MaterialIcons = {
  add: 'add',
  delete: 'delete',
  edit: 'edit',
  search: 'search',
  visibility: 'visibility',
  visibility_off: 'visibility_off',
  back: 'arrow_back',
  close: 'close',
  menu: 'menu',
  save: 'save',
  cancel: 'cancel',
  check: 'check',
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'check_circle',
  // Add more icons as needed
};

function createIconSet(glyphMap, fontFamily, fontFile) {
  const Icon = ({ name, size = 24, color = '#000', style, ...props }) => {
    const glyph = glyphMap[name] || name;
    return (
      <span
        style={{
          fontFamily: 'Material Icons',
          fontSize: size,
          color: color,
          ...style,
        }}
        {...props}
      >
        {glyph}
      </span>
    );
  };

  Icon.defaultProps = {
    size: 24,
    color: '#000',
  };

  return Icon;
}

// Create and export the MaterialIcons component
const MaterialIconsComponent = createIconSet(MaterialIcons, 'Material Icons', 'MaterialIcons.ttf');

// Export both the createIconSet function and the MaterialIcons component
export { createIconSet };
export default MaterialIconsComponent; 