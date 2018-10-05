import * as styledComponents from 'styled-components';
import{ default as defaultTheme, Theme } from './theme';
const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>;

export { css, injectGlobal, keyframes, ThemeProvider, Theme, defaultTheme};
export default styled;
