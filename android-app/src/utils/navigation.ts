import { CommonActions, NavigationProp, ParamListBase } from '@react-navigation/native';

export const resetToMain = (navigation: NavigationProp<ParamListBase>) => {
  const root = navigation.getParent() ?? navigation;
  root.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    }),
  );
};
