import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {buttonColors, fontColors} from '@sphereon/ui-components.core';
import {PrimaryButton} from '@sphereon/ui-components.ssi-react-native';
import {Text, View} from 'react-native';
import {ScreenRoutesEnum, StackParamList} from '../../../types';

type Props = NativeStackScreenProps<StackParamList, ScreenRoutesEnum.ENABLE_BIOMETRICS>;

const SSIEnableBiometricsScreen = (props: Props) => (
  <View>
    <Text>Enable biometrics</Text>
    <PrimaryButton
      style={{height: 42, width: 300}}
      caption="Next"
      backgroundColors={[buttonColors[100]]}
      captionColor={fontColors.light}
      onPress={props.route.params.onNext}
    />
  </View>
);

export default SSIEnableBiometricsScreen;
