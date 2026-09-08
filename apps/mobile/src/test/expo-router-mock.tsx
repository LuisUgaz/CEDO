const Screen = ({ children }: any) => <>{children}</>;


export const Stack = Object.assign(
  ({ children }: any) => <div data-testid="expo-stack">{children}</div>,
  { Screen }
);

export const Tabs = Object.assign(
  ({ children }: any) => <div data-testid="expo-tabs">{children}</div>,
  { Screen }
);

export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {}
});

export const useLocalSearchParams = () => ({});

export default {
  Stack,
  Tabs,
  useRouter,
  useLocalSearchParams
};
