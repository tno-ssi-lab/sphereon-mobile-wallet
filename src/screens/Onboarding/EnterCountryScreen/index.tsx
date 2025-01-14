import {backgroundColors, fontColors} from '@sphereon/ui-components.core';
import {PrimaryButton} from '@sphereon/ui-components.ssi-react-native';
import {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import SSIIconButton from '../../../components/buttons/SSIIconButton';
import ScreenContainer from '../../../components/containers/ScreenContainer';
import ScreenTitleAndDescription from '../../../components/containers/ScreenTitleAndDescription';
import SSITextInputControlledField from '../../../components/fields/SSITextInputControlledField';
import {translate} from '../../../localization/Localization';
import CountrySelectionModal from '../../../modals/CountrySelectionModal';
import {OnboardingContext} from '../../../navigation/machines/onboardingStateNavigation';
import {ButtonIconsEnum} from '../../../types';
import {OnboardingMachineEvents} from '../../../types/machines/onboarding';
import {capitalize} from '../../../utils';
import {isNotNil, validate} from '../../../utils/validate';

const EnterCountryScreen = () => {
  const {onboardingInstance} = useContext(OnboardingContext);
  const {
    context: {country},
  } = onboardingInstance.getSnapshot();
  const translationsPath = 'onboarding_pages.enter_country';
  const [isModalOpen, setIsModalOpen] = useState(country === undefined);
  const {isValid} = validate(country, [isNotNil(translate(`${translationsPath}.select.errors.missing`))]);
  const footer = (
    <View style={{marginTop: 'auto'}}>
      <PrimaryButton
        style={{height: 42, width: '100%'}}
        caption={translate('action_continue_label')}
        disabled={!isValid}
        captionColor={fontColors.light}
        onPress={() => onboardingInstance.send(OnboardingMachineEvents.NEXT)}
      />
    </View>
  );
  return (
    <ScreenContainer footer={footer}>
      <ScreenTitleAndDescription title={translate(`${translationsPath}.title`)} />
      <TouchableOpacity onPress={() => setIsModalOpen(true)}>
        <SSITextInputControlledField
          autoFocus={false}
          editable={false}
          value={country && capitalize(country)}
          label={translate(`${translationsPath}.select.label`)}
          placeholder={translate(`${translationsPath}.select.placeholder`)}
          onPress={() => setIsModalOpen(true)}
          onPressIn={() => setIsModalOpen(true)}
          endAdornment={
            <SSIIconButton
              icon={ButtonIconsEnum.CHEVRON}
              iconColor={backgroundColors.primaryLight}
              iconSize={16}
              style={{marginRight: 8}}
              onPress={() => setIsModalOpen(true)}
            />
          }
        />
      </TouchableOpacity>
      <CountrySelectionModal
        selected={country}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={selectedCountry => {
          onboardingInstance.send(OnboardingMachineEvents.SET_COUNTRY, {data: selectedCountry});
          setIsModalOpen(false);
        }}
        onModalHide={reason => reason === 'select' && onboardingInstance.send(OnboardingMachineEvents.NEXT)}
      />
    </ScreenContainer>
  );
};

export default EnterCountryScreen;
