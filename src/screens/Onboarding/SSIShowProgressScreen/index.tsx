import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {fontColors} from '@sphereon/ui-components.core';
import {PrimaryButton} from '@sphereon/ui-components.ssi-react-native';
import {useContext} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import SSIStepper from '../../../components/steppers/SSIStepper';
import {OnboardingContext} from '../../../navigation/machines/onboardingStateNavigation';
import {
  SSIBackgroundPrimaryDarkColorCss,
  SSITextH0LightStyled,
  SSITextH2LightStyled,
  SSITextH2SemiBoldLightStyled,
  SSITextH3RegularLightStyled,
} from '../../../styles/components';
import {ScreenRoutesEnum, StackParamList, StepContent, StepState} from '../../../types';
import {OnboardingMachineEvents, OnboardingMachineStep} from '../../../types/machines/onboarding';

type Props = NativeStackScreenProps<StackParamList, ScreenRoutesEnum.SHOW_PROGRESS>;

type BaseStepInformationProps = {
  title: string;
  description: string;
  image?: string;
};

type StepInformationProps = BaseStepInformationProps & {
  stepState: StepState;
};

const fontColor: Record<StepState, string> = {
  current: '#FBFBFB',
  finished: '#FBFBFB',
  upcoming: fontColors.greyedOut,
};

const StepInformation = ({title, description, stepState}: StepInformationProps) => {
  return (
    <View style={{gap: 8}}>
      <SSITextH2SemiBoldLightStyled
        style={{
          ...(stepState === 'finished' && {
            opacity: 0.8,
            marginTop: 2,
          }),
          color: fontColor[stepState],
        }}>
        {title}
      </SSITextH2SemiBoldLightStyled>
      {stepState !== 'finished' && <SSITextH3RegularLightStyled style={{color: fontColor[stepState]}}>{description}</SSITextH3RegularLightStyled>}
    </View>
  );
};

const renderStepContent =
  ({title, description, image}: BaseStepInformationProps) =>
  (stepState: StepState) =>
    <StepInformation title={title} description={description} image={image} stepState={stepState} />;

const stepperContent: StepContent[] = [
  renderStepContent({
    title: 'Create Wallet',
    description: 'Set up an account with your name, email address and country of residence.',
  }),
  renderStepContent({
    title: 'Secure Wallet',
    description: 'Secure your wallet with a unique Sphereon PIN and optionally enable biometric login.',
  }),
  renderStepContent({
    title: 'Import personal data',
    description: 'Scan your Ausweis eID-card twice. Keep the card and pin ready.',
  }),
];

const Container = styled(View)`
  ${SSIBackgroundPrimaryDarkColorCss};
  flex: 1;
  padding: 10px 24px 36px;
`;

type ScreenText = {
  title: string;
  description?: string;
};

const screenText: Record<OnboardingMachineStep, ScreenText> = {
  1: {
    title: 'Getting started',
    description: 'Each section should take only a couple of minutes to complete.',
  },
  2: {title: 'You’re halfway there...'},
  3: {title: 'Almost done, last section'},
};

const SSIShowProgressScreen = (props: Props) => {
  const {onboardingInstance} = useContext(OnboardingContext);
  const {currentStep} = props.route.params.context;
  const {title, description} = screenText[currentStep];
  return (
    <Container>
      <SSITextH0LightStyled>{title}</SSITextH0LightStyled>
      {description && <SSITextH2LightStyled style={{opacity: 0.8, marginTop: 8}}>{description}</SSITextH2LightStyled>}
      <View style={{marginTop: 22, marginBottom: 'auto'}}>
        <SSIStepper activeStep={currentStep - 1} content={stepperContent} />
      </View>
      <PrimaryButton
        style={{height: 42, width: '100%'}}
        caption="Next"
        captionColor={fontColors.light}
        onPress={() => onboardingInstance.send(OnboardingMachineEvents.NEXT)}
      />
    </Container>
  );
};

export default SSIShowProgressScreen;
