import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
    tw?: string;
  }
  interface TextProps {
    className?: string;
    tw?: string;
  }
  interface ScrollViewProps {
    className?: string;
    tw?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
    tw?: string;
  }
}
