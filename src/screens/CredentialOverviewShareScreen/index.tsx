import {backgroundColors} from '@sphereon/ui-components.core';
import {SSITextH3LightStyled, SSITextH4LightStyled} from '@sphereon/ui-components.ssi-react-native';
import React, {useRef} from 'react';
import {Image, ScrollView, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import styled from 'styled-components/native';
import ChevronIcon from '../../components/assets/icons/ChevronIcon';
import ScreenContainer from '../../components/containers/ScreenContainer';

import {SSITextH1LightStyled as Title, SSITextH2SemiBoldLightStyled, SSITextH5Styled} from '../../styles/components';

import {ProviderContainer, ProviderDescription, ProviderImage, ProviderUrl} from '../Onboarding/ImportDataConsentScreen/components/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenRoutesEnum, StackParamList} from '../../types';

type Props = NativeStackScreenProps<StackParamList, ScreenRoutesEnum.CREDENTIAL_SHARE_OVERVIEW>;

const RequestedInformationContainer = styled.View`
  border: 1px solid #5d6990;
  border-radius: 8px;
  background-color: #2c334b;
  width: 100%;
  overflow: hidden;
`;

const SelectCredentialsScreen = (props: Props) => {
  // memoize filtered and other values
  const {credential, verifierName, presentationDefinition, onSend, onDecline} = props.route.params;
  const ref = useRef<ScrollView>(null);
  const accordionExpanded = useSharedValue(false);
  const chevronRotation = useSharedValue(0);

  const chevronStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${interpolate(chevronRotation.value, [0, 1], [0, 180])}deg`}],
    };
  });

  const onToggleAccordion = () => {
    chevronRotation.value = withTiming(chevronRotation.value === 0 ? 1 : 0, {duration: 200});
    accordionExpanded.value = !accordionExpanded.value;
  };
  const translationPath = 'share_pages.select_credentials';
  return (
    <ScreenContainer footerStyle={{flexDirection: 'row', gap: 8}} style={{paddingHorizontal: 0}}>
      <View style={{paddingHorizontal: 16}}>
        <ProviderContainer style={{marginBottom: 0}}>
          <ProviderDescription>
            <SSITextH3LightStyled>Purpose</SSITextH3LightStyled>
            <SSITextH4LightStyled>{presentationDefinition.purpose}</SSITextH4LightStyled>
          </ProviderDescription>
        </ProviderContainer>
        <ProviderContainer>
          <ProviderImage source={require('../../assets/images/PlaceholderLogo.png')} width={40} height={40} resizeMode="stretch" />
          <ProviderDescription>
            <SSITextH3LightStyled>{verifierName}</SSITextH3LightStyled>
          </ProviderDescription>
        </ProviderContainer>
        <SSITextH2SemiBoldLightStyled>Following information will be shared</SSITextH2SemiBoldLightStyled>
      </View>
      <View style={{backgroundColor: backgroundColors.secondaryDark, padding: 24}}>
        <ScrollView
          ref={ref}
          horizontal
          contentContainerStyle={{
            columnGap: 12,
            padding: 8,
            marginBottom: 16,
          }}>
          <TouchableOpacity key={verifierName}>
            <View
              style={{
                width: 75,
                height: 50,
                position: 'relative',
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                //fixme: add verifier branding to the object that we're passing
                backgroundColor: /*verifierName.contrastBackgroundColor ?? */ 'white',
              }}
              key={verifierName}>
              //fixme: add verifier branding to the object that we're passing
              {/*<Image style={{width: 32, height: 32}} source={verifierName.image} />*/}
              <Title>{verifierName}</Title>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={onToggleAccordion} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
          <SSITextH3LightStyled>{verifierName}</SSITextH3LightStyled>
          <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
            <SSITextH5Styled style={{color: '#0B81FF'}}>{/* Not sure where this "1" refers to */}1 selected</SSITextH5Styled>
            <Animated.View style={[chevronStyles, {marginTop: 1}]}>
              <ChevronIcon size={16} color={backgroundColors.primaryLight} />
            </Animated.View>
          </View>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Title>{JSON.stringify(credential)}</Title>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default SelectCredentialsScreen;
