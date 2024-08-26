import {fontColors} from '@sphereon/ui-components.core';
import {PrimaryButton} from '@sphereon/ui-components.ssi-react-native';
import {useContext, useEffect, useState} from 'react';
import {Image, Platform} from 'react-native';
import ScreenContainer from '../../../components/containers/ScreenContainer';
import ScreenTitleAndDescription from '../../../components/containers/ScreenTitleAndDescription';
import {translate} from '../../../localization/Localization';
import {OnboardingContext} from '../../../navigation/machines/onboardingStateNavigation';
import {OnboardingMachineEvents} from '../../../types/machines/onboarding';
import {AusweisEPinModal} from '../components/AusweisEPinModal';
import {AusweisScanModal} from '../components/AusweisScanModal';
import {ContentContainer} from '../components/styles';
import VciServiceFunkeCProvider from '../../../providers/authentication/funke/VciServiceFunkeCProvider';
import {EIDFlowState} from '../../../types';
import {delay} from '../../../utils';

const ImportPersonalDataScreen = () => {
  const {onboardingInstance} = useContext(OnboardingContext);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [eIDFlowState, setEIDFlowState] = useState<EIDFlowState | undefined>();
  const [provider, setProvider] = useState<VciServiceFunkeCProvider | undefined>();

  const translationsPath = 'onboarding_pages.import_scan_card';

  useEffect((): void => {
    if (pin.length === 0) {
      return;
    }

    const onAuthenticated = async (provider: VciServiceFunkeCProvider): Promise<void> => {
      onboardingInstance.send(OnboardingMachineEvents.SET_FUNKE_PROVIDER, {data: provider});
      // Adding a small delay to let the animation play
      await delay(600);
      onboardingInstance.send(OnboardingMachineEvents.NEXT);
    };

    const onEnterPin = (): string => {
      return pin;
    };

    VciServiceFunkeCProvider.initialize({
      onEnterPin,
      onAuthenticated,
      onStateChange: setEIDFlowState,
    }).then((provider: VciServiceFunkeCProvider): void => {
      setProvider(provider);
      void provider?.start();
    });
  }, [pin]);

  const onCompletePin = (pin: string): void => {
    setPin(pin);
    setShowPin(false);
  };

  const footer = (
    <PrimaryButton
      style={{height: 42, width: '100%'}}
      caption={translate(`${translationsPath}.button_caption`)}
      captionColor={fontColors.light}
      onPress={() => setShowPin(true)}
    />
  );

  return (
    <ScreenContainer footer={footer}>
      <ScreenTitleAndDescription title={translate(`${translationsPath}.title`)} description={translate(`${translationsPath}.description`)} />
      <ContentContainer>
        <Image source={require('../../../assets/images/scan_card.png')} height={200} width={100} style={{height: 300, width: 200}} />
      </ContentContainer>
      <AusweisEPinModal isVisible={showPin} onClose={() => setShowPin(false)} onComplete={onCompletePin} />
      {Platform.OS === 'android' && <AusweisScanModal state={eIDFlowState} progress={eIDFlowState?.progress} onCancel={() => provider?.cancel()} />}
    </ScreenContainer>
  );
};

export default ImportPersonalDataScreen;