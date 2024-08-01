import {FC} from 'react';
import {ViewProps} from 'react-native';
import {SSIProgressBarIndicatorContainer as Container, SSIBackgroundBar, SSIForegroundBar} from '../../../styles/components';

export interface IProps {
  step: number;
  stepsNumber: number;
  containerStyle?: ViewProps['style'];
}

const SSIProgressBarIndicator: FC<IProps> = ({step, stepsNumber, containerStyle}) => {
  return (
    <Container style={containerStyle}>
      <SSIBackgroundBar>
        <SSIForegroundBar style={{width: `${(step / stepsNumber) * 100}%`}} />
      </SSIBackgroundBar>
    </Container>
  );
};

export default SSIProgressBarIndicator;
