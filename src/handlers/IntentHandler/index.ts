import {VerifiableCredential} from '@veramo/core';
import Debug from 'debug';
import {EmitterSubscription, Linking} from 'react-native';
import ShareMenu, {ShareData, ShareListener} from 'react-native-share-menu';

import {APP_ID} from '../../@config/constants';
import {translate} from '../../localization/Localization';
import RootNavigation from '../../navigation/rootNavigation';
import {readFile} from '../../services/fileService';
import {readQr} from '../../services/qrService';
import store from '../../store';
import {storeVerifiableCredential} from '../../store/actions/credential.actions';
import {NavigationBarRoutesEnum, ScreenRoutesEnum, ToastTypeEnum} from '../../types';
import {showToast} from '../../utils/ToastUtils';
import {toNonPersistedCredentialSummary} from '../../utils/mappers/credential/CredentialMapper';

const debug: Debug.Debugger = Debug(`${APP_ID}:IntentHandler`);

class IntentHandler {
  private static instance: IntentHandler;
  private deeplinkListener: EmitterSubscription;
  private shareListener: ShareListener;
  private _initialUrl?: string;
  private _propagateEvents = false;
  private _enabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public isEnabled(): boolean {
    return this._enabled;
  }
  public enable = async (): Promise<void> => {
    if (!this.isEnabled()) {
      await this.handleLinksForRunningApp();
      await this.handleLinksForStartingApp();
      this._enabled = true;
    }
  };

  public static getInstance(): IntentHandler {
    if (!IntentHandler.instance) {
      IntentHandler.instance = new IntentHandler();
    }
    return IntentHandler.instance;
  }

  public disable = async (): Promise<void> => {
    this._propagateEvents = false;
    this._initialUrl = undefined;
    await this.removeListeners();
    this._enabled = false;
  };

  get propagateEvents(): boolean {
    return this._propagateEvents;
  }

  set propagateEvents(value: boolean) {
    this._propagateEvents = value;
  }

  private handleLinksForRunningApp = async (): Promise<void> => {
    /**
     * 1. If the app is already open, the app is foregrounded and a Linking event is fired
     * You can handle these events with Linking.addEventListener('url', callback).
     */
    Linking.removeAllListeners('url');
    this.deeplinkListener = Linking.addEventListener('url', this.deepLinkHandler);
    this.shareListener = ShareMenu.addNewShareListener(this.sharedFileDataAction);
  };

  private removeListeners = async (): Promise<void> => {
    this.deeplinkListener?.remove();
    this.shareListener?.remove();
  };

  private async handleLinksForStartingApp(): Promise<void> {
    /**
     * 2. If the app is not already open, it is opened and the url is passed in as the initialURL
     * You can handle these events with Linking.getInitialURL() -- it returns a Promise that resolves to the url, if there is one.
     */
    await this.storeInitialURLOnStart();
    await this.handleSharedFileData();
  }

  private async storeInitialURLOnStart(): Promise<void> {
    const url = await Linking.getInitialURL();

    // Added expo-development-client check because of how the expo works in development
    if (!url || url.includes('expo-development-client')) {
      debug('No deeplink on start');
      return;
    }
    // this.deepLinkAction({url});
    debug(`deeplink on start: ${url}`);
    this._initialUrl = url;
  }

  private async handleSharedFileData(): Promise<void> {
    await ShareMenu.getSharedText((data?: ShareData) => {
      debug(`Receiving shared data: ${JSON.stringify(data, null, 2)}`);
      if (!data) {
        return;
      }

      this.sharedFileDataAction(data);
    });
  }

  private deepLinkHandler = async (event: {url: string}): Promise<void> => {
    if (event.url) {
      debug(`Deeplink for running app: ${event.url}`);
      this._initialUrl = event.url;
    }
    if (this.hasDeepLink() && this.propagateEvents) {
      void this.openDeepLink();
    }
  };

  public hasDeepLink = (): boolean => {
    return !!this._initialUrl;
  };

  public getDeepLink(): string | undefined {
    return this._initialUrl;
  }

  public openDeepLink = async (): Promise<void> => {
    debug(`Open deeplink for ${this._initialUrl}`);
    const url = this._initialUrl;
    this._initialUrl = undefined;
    if (url) {
      // TODO this DeepLinkingProvider is now hard-coupled to assume the links are QR flows
      // TODO fix this type issue
      await readQr({qrData: url, navigation: RootNavigation});
    }
  };

  private sharedFileDataAction(item?: ShareData): void {
    if (!item || !item.data) {
      return;
    }

    // TODO currently on supporting one file
    const file = typeof item.data === 'string' ? item.data : item.data[0];

    readFile({filePath: file})
      .then(async (file: string) => {
        // Currently we only support receiving one credential, we are missing ui to display multiple
        const vc: VerifiableCredential = JSON.parse(file).credential?.data?.verifiableCredential[0];
        if (!vc) {
          showToast(ToastTypeEnum.TOAST_ERROR, {message: translate('intent_share_file_unable_to_receive_message')});
          return;
        }

        // TODO fix the store not having the correct action types (should include ThunkAction)
        const storeCredential = async (vc: VerifiableCredential) => await store.dispatch<any>(storeVerifiableCredential(vc));

        // We navigate to the QR stack as this is the stack for incoming credentials
        RootNavigation.navigate(NavigationBarRoutesEnum.QR, {
          screen: ScreenRoutesEnum.CREDENTIAL_DETAILS,
          params: {
            rawCredential: vc,
            credential: await toNonPersistedCredentialSummary(vc),
            primaryAction: {
              caption: translate('action_accept_label'),
              onPress: async () =>
                storeCredential(vc)
                  .then(() =>
                    RootNavigation.navigate(NavigationBarRoutesEnum.CREDENTIALS, {
                      screen: ScreenRoutesEnum.CREDENTIALS_OVERVIEW,
                    }),
                  )
                  .then(() =>
                    showToast(ToastTypeEnum.TOAST_SUCCESS, {
                      message: translate('credential_offer_accepted_toast'),
                      showBadge: false,
                    }),
                  )
                  .catch((error: Error) => showToast(ToastTypeEnum.TOAST_ERROR, {message: error.message})),
            },
            secondaryAction: {
              caption: translate('action_decline_label'),
              onPress: async () =>
                RootNavigation.navigate(NavigationBarRoutesEnum.CREDENTIALS, {
                  screen: ScreenRoutesEnum.CREDENTIALS_OVERVIEW,
                }),
            },
          },
        });
      })
      .catch((error: Error) => showToast(ToastTypeEnum.TOAST_ERROR, {message: error.message}));
  }
}

export default IntentHandler;
