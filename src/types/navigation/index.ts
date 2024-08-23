import {NavigationHelpers} from '@react-navigation/native';
import {Format, PresentationDefinitionV1, PresentationDefinitionV2} from '@sphereon/pex-models';
import {NonPersistedIdentity, Party} from '@sphereon/ssi-sdk.data-store';
import {OriginalVerifiableCredential} from '@sphereon/ssi-types';
import {CredentialSummary} from '@sphereon/ui-components.credential-branding';
import {VerifiableCredential} from '@veramo/core';
import {IButton, PopupBadgesEnum, PopupImagesEnum} from '../component';
import {ICredentialSelection, ICredentialTypeSelection} from '../credential';
import {OnboardingMachineInterpreter} from '../machines/onboarding';
import {SiopV2MachineInterpreter} from '../machines/siopV2';

export type ParamsList = Record<string, object | undefined>;
export type Navigate<T extends ParamsList> = NavigationHelpers<T, any>['navigate'];

export type StackParamList = {
  CredentialsOverview: Record<string, never>;
  CredentialDetails: ICredentialDetailsProps & Partial<IHasOnBackProps>;
  CredentialRawJson: ICredentialRawJsonProps;
  QrReader: Record<string, never>;
  Veramo: Record<string, never>;
  Home: Record<string, never>;
  VerificationCode: IVerificationCodeProps & Partial<IHasOnBackProps>;
  AlertModal: IAlertModalProps;
  PopupModal: IPopupModalProps;
  AusweisModal: IAusweisModalProps;
  Error: IPopupModalProps & Partial<IHasOnBackProps>;
  CredentialSelectType: ICredentialSelectTypeProps & Partial<IHasOnBackProps>;
  ContactsOverview: Record<string, never>;
  ContactDetails: IContactDetailsProps;
  ContactAdd: IContactAddProps & Partial<IHasOnBackProps>;
  Onboarding: IOnboardingProps;
  Main: Record<string, never>;
  BrowserOpen: IBrowserOpen;
  NotificationsOverview: Record<string, never>;
  Lock: ILockProps;
  Authentication: Record<string, never>;
  CredentialsRequired: ICredentialsRequiredProps & Partial<IHasOnBackProps>;
  CredentialsSelect: ICredentialsSelectProps;
  Loading: ILoadingProps;
  Emergency: Record<string, never>;
  SIOPV2: ISiopV2PProps;
  OID4VCI: Record<string, never>;
  CredentialCatalog: Record<string, never>;
};

export type Document = 'terms' | 'privacy';

export type OnboardingStackParamsList = {
  AcceptTermsAndPrivacy: Record<string, never>;
  ReadTermsAndPrivacy: {document: Document};
  EnableBiometrics: Record<string, never>;
  EnterCountry: Record<string, never>;
  EnterEmailAddress: Record<string, never>;
  EnterName: Record<string, never>;
  EnterPinCode: Record<string, never>;
  ShowProgress: Record<string, never>;
  VerifyPinCode: Record<string, never>;
  Welcome: Record<string, never>;
  ImportPersonalData: Record<string, never>;
  ImportDataConsent: Record<string, never>;
  PinCodeSet: Record<string, never>;
  PinCodeVerify: Record<string, never>;
  ImportDataAuthentication: Record<string, never>;
  ImportDataLoader: Record<string, never>;
  ImportDataFinal: Record<string, never>;
};

export type CreditOverviewStackParamsList = {
  Card: Record<string, never>;
  List: Record<string, never>;
};

export type CreditOverviewStackRoute = keyof CreditOverviewStackParamsList;

export type ReadDocumentParamsList = Record<Document, {document: Document}>;

export type OnboardingRoute = keyof OnboardingStackParamsList;

export type IBrowserOpen = IHasOnBackProps &
  IHasOnNextProps & {
    headerCaptioni18n?: string;
    titleCaptioni18n?: string;
    bodyTexti18n?: string;
    actionNextLabeli18n?: string;
  };

export interface IOnboardingProps {
  customOnboardingInstance?: OnboardingMachineInterpreter;
}

export interface IHasOnBackProps {
  onClick: () => {};
  onBack: () => Promise<void>;
}

export interface ILoadingProps {
  message: string;
}

export interface IHasOnNextProps {
  onNext: (data?: any) => Promise<void>;
}

export interface ITermsOfServiceProps {
  isDisabled: () => boolean;
  onDecline: () => Promise<void>;
  onAcceptTerms: (accept: boolean) => Promise<void>;
  onAcceptPrivacy: (accept: boolean) => Promise<void>;
}

export interface ICredentialsSelectProps {
  credentialSelection: Array<ICredentialSelection>;
  purpose?: string;
  onSelect: (vcs: Array<string>) => Promise<void>;
}

export interface ICredentialsRequiredProps {
  format: Format | undefined;
  subjectSyntaxTypesSupported: string[] | undefined;
  presentationDefinition: PresentationDefinitionV1 | PresentationDefinitionV2;
  onDecline: () => Promise<void>;
  onSelect?: (credentials: Array<OriginalVerifiableCredential>) => Promise<void>;
  onSend: (credentials: Array<OriginalVerifiableCredential>) => Promise<void>;
  isSendDisabled?: () => boolean | (() => boolean);
  verifierName: string;
}

export interface ICredentialDetailsProps {
  credential: CredentialSummary;
  primaryAction?: IButton;
  secondaryAction?: IButton;
  showActivity?: boolean;
  /*
   TODO WAL-340
   We want to keep screens simple and we want one object representing the vc to avoid mismatches.
   What we need is a list of actions that will be used for the 'more' button, where the credential is passed in.
  */
  rawCredential?: OriginalVerifiableCredential;
  headerTitle?: string;
}

export interface ICredentialRawJsonProps {
  rawCredential: VerifiableCredential;
}

export interface IVerificationCodeProps {
  pinLength?: number;
  onVerification: (pin: string) => Promise<void>;
  credentialName: string;
}

export interface IAlertModalProps {
  message: string;
  buttons: Array<IButton>;
  showCancel?: boolean;
}

export interface IPopupModalProps {
  onClose?: () => Promise<void>;
  image?: PopupImagesEnum;
  title?: string;
  titleBadge?: PopupBadgesEnum;
  details?: string;
  extraDetails?: string;
  detailsPopup?: {
    buttonCaption: string;
    title?: string;
    details?: string;
    extraDetails?: string;
  };
  primaryButton?: IButton;
  secondaryButton?: IButton;
}

export interface IAusweisModalProps {
  onClose: () => Promise<void>;
  onAccept: () => Promise<void>;
}

export interface ICredentialSelectTypeProps {
  issuer: string;
  credentialTypes: Array<ICredentialTypeSelection>;
  onSelectType?: (credentialTypes: Array<string>) => Promise<void>;
  onSelect: (credentialTypes: Array<string>) => Promise<void>;
  isSelectDisabled?: boolean | (() => boolean);
}

export interface IContactDetailsProps {
  contact: Party;
}

export interface IContactAddProps {
  name: string;
  uri?: string;
  identities?: Array<NonPersistedIdentity>;
  onCreate: (contact: Party) => Promise<void>;
  onDecline: () => Promise<void>;
  onConsentChange?: (hasConsent: boolean) => Promise<void>;
  onAliasChange?: (alias: string) => Promise<void>;
  hasConsent?: boolean;
  isCreateDisabled?: boolean | (() => boolean);
}

export interface IPinCodeSetProps {
  headerSubTitle: string;
}

export interface IPinCodeVerifyProps {
  headerSubTitle: string;
}

export enum PinCodeMode {
  CHOOSE_PIN = 'choose_pin',
  CONFIRM_PIN = 'confirm_pin',
}
export interface ILockProps {
  onAuthenticate: () => Promise<void>;
}

export enum SwitchRoutesEnum {
  ONBOARDING = 'Onboarding',
  AUTHENTICATION = 'Authentication',
  MAIN = 'Main',
}

export enum MainRoutesEnum {
  HOME = 'Home',
  ALERT_MODAL = 'AlertModal',
  POPUP_MODAL = 'PopupModal',
  AUSWEIS_MODAL = 'AusweisModal',
  OID4VCI = 'OID4VCI',
  SIOPV2 = 'SIOPV2',
}

export enum NavigationBarRoutesEnum {
  QR = 'QRStack',
  NOTIFICATIONS = 'NotificationsStack',
  CREDENTIALS = 'CredentialsStack',
  CONTACTS = 'ContactsStack',
  CREDENTIAL_CATALOG = 'CredentialCatalogStack',
}
export enum ScreenRoutesEnum {
  CREDENTIALS_OVERVIEW = 'CredentialsOverview',
  CREDENTIAL_DETAILS = 'CredentialDetails',
  CREDENTIAL_RAW_JSON = 'CredentialRawJson',
  QR_READER = 'QrReader',
  VERIFICATION_CODE = 'VerificationCode',
  ERROR = 'Error',
  CREDENTIAL_SELECT_TYPE = 'CredentialSelectType',
  CONTACTS_OVERVIEW = 'ContactsOverview',
  CONTACT_DETAILS = 'ContactDetails',
  CONTACT_ADD = 'ContactAdd',
  NOTIFICATIONS_OVERVIEW = 'NotificationsOverview',
  LOCK = 'Lock',
  BROWSER_OPEN = 'BrowserOpen',
  CREDENTIALS_REQUIRED = 'CredentialsRequired',
  CREDENTIALS_SELECT = 'CredentialsSelect',
  LOADING = 'Loading',
  EMERGENCY = 'Emergency',
  CREDENTIAL_CATALOG = 'CredentialCatalog',
}

export interface ISiopV2PProps {
  customSiopV2Instance?: SiopV2MachineInterpreter;
}
