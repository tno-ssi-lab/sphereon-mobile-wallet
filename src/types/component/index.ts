import {ImageAttributes} from '@sphereon/ui-components.core';
import {ComponentType} from 'react';
import {ColorValue} from 'react-native';
import {Country} from '../machines/onboarding';

export enum ButtonIconsEnum {
  BACK = 'back',
  MORE = 'more',
  CLOSE = 'close',
  SEARCH = 'search',
  CHEVRON = 'chevron',
}

export enum HeaderMenuIconsEnum {
  ADD = 'add',
  DELETE = 'delete',
  LOGOUT = 'logout',
  DOWNLOAD = 'download',
}

export enum PopupImagesEnum {
  SECURITY = 'security',
  WARNING = 'warning',
}

export enum PopupBadgesEnum {
  CHECK_MARK = 'checkMark',
  EXCLAMATION_MARK = 'exclamationMark',
}

export interface IHeaderProps {
  showBorder: boolean;
}

export interface IButton {
  caption: string;
  onPress: (() => Promise<void>) | (() => void);
  disabled?: boolean | (() => boolean);
}

export interface IHeaderMenuButton extends IButton {
  icon?: HeaderMenuIconsEnum;
  fontColor?: ColorValue;
}

export interface ITabRoute {
  key: string;
  title: string;
}

export interface ITabViewRoute extends ITabRoute {
  content: ComponentType<unknown>;
}

export type CredentialMiniCardDisplay = {
  backgroundColor?: ColorValue;
  backgroundImage?: ImageAttributes;
  logoColor: ColorValue;
  logo?: ImageAttributes;
};

export type StepState = 'current' | 'finished' | 'upcoming';

export type StepContent = (stepState: StepState) => JSX.Element;

export interface IStepIndicatorProps {
  state: StepState;
  isLastStep: boolean;
  stepIndex: number;
  ringColor: ColorValue;
}

export type CountryOption = {
  name: Country;
  flagURI: string;
  selected: boolean;
};
