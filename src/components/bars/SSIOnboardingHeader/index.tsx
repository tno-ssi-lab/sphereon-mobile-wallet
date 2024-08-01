import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OnboardingContext} from '../../..//navigation/machines/onboardingStateNavigation';
import SSIProgressBarIndicator from '../../../components/indicators/SSIProgressBarIndicator';
import {
  SSIHeaderBarBackIconStyled as BackIcon,
  SSIHeaderBarBackIconContainerStyled as BackIconContainer,
  SSIOnbaordingHeaderContainerStyled as Container,
  SSIOnboardingHeaderRow as HeaderRow,
  SSITextH3LightStyled,
} from '../../../styles/components';
import {ButtonIconsEnum, OnbaordingRouteParams} from '../../../types';
import {OnboardingMachineEvents} from '../../../types/machines/onboarding';

export interface HeaderBarProps extends NativeStackHeaderProps {
  title?: string;
  stepsNumber?: number;
}

const SSIOnboardingHeader: FC<HeaderBarProps> = ({title, stepsNumber, route: {params}}: HeaderBarProps): JSX.Element => {
  const {onboardingInstance} = React.useContext(OnboardingContext);
  const {step} = params as OnbaordingRouteParams;
  return (
    <Container
      style={{
        marginTop: useSafeAreaInsets().top,
      }}>
      <HeaderRow>
        <BackIconContainer style={{flex: 1}}>
          <BackIcon
            style={{marginTop: 0}}
            icon={ButtonIconsEnum.BACK}
            onPress={() => new Promise(() => onboardingInstance.send(OnboardingMachineEvents.PREVIOUS))}
          />
        </BackIconContainer>
        {Boolean(title) && <SSITextH3LightStyled>{title as string}</SSITextH3LightStyled>}
        {stepsNumber && (
          <SSITextH3LightStyled
            style={{
              textAlign: 'right',
              flex: 1,
            }}>
            {`${step}/${stepsNumber}`}
          </SSITextH3LightStyled>
        )}
      </HeaderRow>
      {stepsNumber && <SSIProgressBarIndicator step={step} stepsNumber={stepsNumber} containerStyle={{marginVertical: 10}} />}
    </Container>
  );
};

export default SSIOnboardingHeader;
