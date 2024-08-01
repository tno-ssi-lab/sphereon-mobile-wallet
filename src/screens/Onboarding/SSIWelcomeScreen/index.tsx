import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {buttonColors, fontColors} from '@sphereon/ui-components.core';
import {PrimaryButton} from '@sphereon/ui-components.ssi-react-native';
import {Text, View} from 'react-native';
import {ScreenRoutesEnum, StackParamList} from '../../../types';

type Props = NativeStackScreenProps<StackParamList, ScreenRoutesEnum.WELCOME>;

const SSIWelcomeScreen = (props: Props) => (
  <View>
    <Text>Welcome to SSI</Text>
    <PrimaryButton
      style={{height: 42, width: 300, marginTop: 60}}
      caption="Next"
      backgroundColors={[buttonColors[100]]}
      captionColor={fontColors.light}
      onPress={async () => {
        await props.route.params.onNext();
      }}
    />
  </View>
);

export default SSIWelcomeScreen;
