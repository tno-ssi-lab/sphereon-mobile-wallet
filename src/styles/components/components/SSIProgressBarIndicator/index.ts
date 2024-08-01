import styled, {css} from 'styled-components/native';
import {SSILinearGradientStyled} from '../../gradients';

export const SSIProgressBarIndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SSIBaseProgressBar = css`
  height: 4px;
  border-radius: 2px;
`;

export const SSIBackgroundBar = styled.View`
  ${SSIBaseProgressBar};
  flex: 1;
  position: relative;
  background-color: #404d7a;
`;

export const SSIForegroundBar = styled(SSILinearGradientStyled)`
  ${SSIBaseProgressBar};
  position: absolute;
  top: 0;
  left: 0;
`;
