import React from 'react';

export const View: React.FC<any> = ({ children, style, className, testID, ...props }) => (
  <div data-testid={testID} style={style} className={className} {...props}>
    {children}
  </div>
);

export const Text: React.FC<any> = ({ children, style, className, testID, ...props }) => (
  <span data-testid={testID} style={style} className={className} {...props}>
    {children}
  </span>
);

export const ScrollView: React.FC<any> = ({ children, style, className, testID, ...props }) => (
  <div data-testid={testID} style={style} className={className} {...props}>
    {children}
  </div>
);

export const TouchableOpacity: React.FC<any> = ({
  children,
  onPress,
  testID,
  style,
  className,
  ...props
}) => (
  <button
    type="button"
    onClick={onPress}
    data-testid={testID}
    style={style}
    className={className}
    {...props}
  >
    {children}
  </button>
);

export const StyleSheet = {
  create: <T extends Record<string, any>>(styles: T): T => styles,
  flatten: (style: any) => style
};

export const Platform = {
  OS: 'ios' as const,
  select: (obj: any) => obj.ios || obj.default
};

export default {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform
};
