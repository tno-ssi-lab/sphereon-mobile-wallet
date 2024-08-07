import styled, {css} from 'styled-components/native';
import {SSILinearGradientStyled} from '../../gradients';

const dotBaseStyle = css`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const SSIStepDot = styled(SSILinearGradientStyled)`
  ${dotBaseStyle}
`;

export const SSIStepDotUpcoming = styled.View`
  ${dotBaseStyle}
  background-color: #8D9099;
`;

export const SSIStepDotConnector = styled.View`
  width: 2px;
  flex: 1px;
`;

export const SSIUpcomingStepDotConnectorPatch = styled.View`
  width: 2px;
  height: 2px;
  background-color: #8d9099;
`;

export const SSIStepDotDefaultWrapper = styled.View`
  position: relative;
`;

export const SSICurrentStepRing = styled(SSIStepDotDefaultWrapper)`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: transparent;
  border-color: #482fc8;
  border-width: 2px;
`;

export const SSIStepperStepIndicatorContainer = styled.View`
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;
