import {fontColors} from '@sphereon/ui-components.core';
import React, {FC} from 'react';
import {ColorValue, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export interface IProps {
  size?: number;
  color?: ColorValue;
}

const SearchIcon: FC<IProps> = (props: IProps): JSX.Element => {
  const {size = 20, color = fontColors.dark} = props;

  return (
    <View style={{width: size, aspectRatio: 1}}>
      <Svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
        <Path
          d="M19.2204 17.934H18.5429L18.3027 17.7024C19.1432 16.7247 19.6492 15.4554 19.6492 14.0746C19.6492 10.9957 17.1535 8.5 14.0746 8.5C10.9957 8.5 8.5 10.9957 8.5 14.0746C8.5 17.1535 10.9957 19.6492 14.0746 19.6492C15.4554 19.6492 16.7247 19.1432 17.7024 18.3027L17.934 18.5429V19.2204L22.2221 23.5L23.5 22.2221L19.2204 17.934ZM14.0746 17.934C11.9391 17.934 10.2153 16.2101 10.2153 14.0746C10.2153 11.9391 11.9391 10.2153 14.0746 10.2153C16.2101 10.2153 17.934 11.9391 17.934 14.0746C17.934 16.2101 16.2101 17.934 14.0746 17.934Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default SearchIcon;
