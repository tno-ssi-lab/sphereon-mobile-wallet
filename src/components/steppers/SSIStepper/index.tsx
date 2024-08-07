import {FC} from 'react';
import {View} from 'react-native';
import {StepContent} from '../../../types/component';
import StepIndicator from '../SSIStepperStepIndicator';

export interface IProps {
  activeStep: number;
  content: StepContent[];
}

const SSIStepper: FC<IProps> = ({activeStep, content}) =>
  content.map((renderContent, index) => {
    const isLastStep = index === content.length - 1;
    const stepState = index === activeStep ? 'current' : index < activeStep ? 'finished' : 'upcoming';
    return (
      <View
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
        }}>
        <StepIndicator isLastStep={isLastStep} state={stepState} stepIndex={index + 1} />
        <View style={{marginBottom: 32, flexShrink: 1}}>{renderContent(stepState)}</View>
      </View>
    );
  });

export default SSIStepper;
