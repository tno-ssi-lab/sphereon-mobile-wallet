import {FC, ReactNode} from 'react';
import {Text} from 'react-native';
import {
  SSIStepperStepIndicatorContainer as Container,
  SSICurrentStepRing,
  SSIStepDot,
  SSIStepDotConnector,
  SSIStepDotDefaultWrapper,
  SSIStepDotUpcoming,
  SSIUpcomingStepDotConnectorPatch,
} from '../../../styles/components';
import {IStepIndicatorProps, StepState} from '../../../types/component';
import SSICheckmarkIcon from '../../assets/icons/SSICheckmarkIcon';

const margins: Record<StepState, {top: number; horizontal: number}> = {
  current: {top: 2, horizontal: 2},
  upcoming: {top: 0, horizontal: 4},
  finished: {top: 0, horizontal: 4},
};

const Dot: FC<{state: StepState; children?: ReactNode}> = ({state, children}) =>
  state !== 'upcoming' ? (
    <SSIStepDot
      style={{
        marginTop: margins[state].top,
        marginHorizontal: margins[state].horizontal,
      }}>
      {children}
    </SSIStepDot>
  ) : (
    <SSIStepDotUpcoming
      style={{
        marginTop: margins.upcoming.top,
        marginHorizontal: margins.upcoming.horizontal,
      }}>
      {children}
    </SSIStepDotUpcoming>
  );

const StepDot: FC<Omit<IStepIndicatorProps, 'isLastStep'>> = ({state, stepIndex}) => {
  const Wrapper = state === 'current' ? SSICurrentStepRing : SSIStepDotDefaultWrapper;
  return (
    <Wrapper>
      <Dot state={state}>
        {state === 'finished' ? (
          <SSICheckmarkIcon color="#FBFBFB" />
        ) : (
          <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>{stepIndex}</Text>
        )}
      </Dot>
    </Wrapper>
  );
};

const SSIStepperStepIndicator: FC<IStepIndicatorProps> = ({state, isLastStep, stepIndex}) => {
  return (
    <Container>
      {state === 'upcoming' && <SSIUpcomingStepDotConnectorPatch />}
      <StepDot state={state} stepIndex={stepIndex} />
      {!isLastStep && <SSIStepDotConnector style={{backgroundColor: state === 'finished' ? '#482FC8' : '#8D9099'}} />}
    </Container>
  );
};

export default SSIStepperStepIndicator;
