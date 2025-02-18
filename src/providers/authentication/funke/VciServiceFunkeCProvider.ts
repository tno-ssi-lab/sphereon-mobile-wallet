import {addMessageListener, AusweisAuthFlow, AusweisSdkMessage, sendCommand} from '@animo-id/expo-ausweis-sdk';
import {PARMode} from '@sphereon/oid4vci-common';
import {Dispatch, SetStateAction} from 'react';
import {agentContext} from '../../../agent';
import {EIDFlowState, EIDGetAccessTokenArgs, EIDHandleErrorArgs, EIDInitializeArgs, EIDProviderArgs, KeyManagementSystemEnum} from '../../../types';
import {PidIssuerService, PidResponse} from '../../PidIssuerService';

class VciServiceFunkeCProvider {
  private readonly onStateChange?: Dispatch<SetStateAction<EIDFlowState>> | ((status: EIDFlowState) => void);
  private static readonly _funke_clientId = 'bc11dd24-cbe9-4f13-890b-967e5f900222';
  private readonly pidService: PidIssuerService;
  private authFlow: AusweisAuthFlow;
  public currentState: EIDFlowState;
  public refreshUrl: string;

  private constructor(args: EIDProviderArgs) {
    const {pidService, onStateChange, onAuthenticated, onEnterPin} = args;

    this.pidService = pidService;
    this.onStateChange = onStateChange;
    this.authFlow = new AusweisAuthFlow({
      onEnterPin,
      onError: (error): void => {
        this.handleError(error);
      },
      onSuccess: (options): void => {
        this.refreshUrl = options.refreshUrl;
        this.handleStateChange({state: 'SUCCESS'});
        onAuthenticated?.(this);
      },
      onInsertCard: (): void => {
        this.handleStateChange({state: 'INSERT_CARD'});
      },
    });

    this.handleStateChange({state: 'INITIALIZED'});
  }

  public static async initialize(args: EIDInitializeArgs): Promise<VciServiceFunkeCProvider> {
    const {pidProvider} = args;
    const credentialOffer =
      'openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A%22https%3A%2F%2Fdemo.pid-issuer.bundesdruckerei.de%2Fc%22%2C%22credential_configuration_ids%22%3A%5B%22pid-sd-jwt%22%5D%2C%22grants%22%3A%7B%22authorization_code%22%3A%7B%7D%7D%7D';
    const pidService = PidIssuerService.newInstance(
      {pidProvider, clientId: VciServiceFunkeCProvider._funke_clientId, credentialOffer: credentialOffer, kms: KeyManagementSystemEnum.MUSAP_TEE},
      agentContext,
    );
    return new VciServiceFunkeCProvider({...args, pidService});
  }

  public async start(): Promise<AusweisAuthFlow> {
    await this.pidService.init();
    const tcTokenUrl = await this.pidService.createAuthorizationRequestUrl({
      redirectUri: 'https://sphereon.com/wallet',
      scope: 'pid',
      parMode: PARMode.REQUIRE,
    });

    addMessageListener((message: AusweisSdkMessage): void => {
      if (message.msg === 'STATUS' && (this.currentState.state === 'READING_CARD' || this.currentState.state === 'INSERT_CARD')) {
        this.handleStateChange({state: 'READING_CARD', progress: message.progress});
      }
    }).remove;

    const flow = this.authFlow.start({tcTokenUrl});
    this.handleStateChange({state: 'STARTED'});
    return flow;
  }

  public async cancel(): Promise<void> {
    sendCommand({cmd: 'CANCEL'});
  }

  private handleError(error: EIDHandleErrorArgs): void {
    const state: EIDFlowState = {
      state: 'ERROR',
      reason: error.reason,
      message: error.message,
    };
    this.handleStateChange(state);
  }

  private handleStateChange(state: EIDFlowState): void {
    this.currentState = state;
    this.onStateChange?.(state);
  }

  public async getAuthorizationCode(): Promise<string> {
    this.handleStateChange({state: 'GETTING_AUTHORIZATION_CODE'});
    return this.pidService.getAuthorizationCode({refreshUrl: this.refreshUrl});
  }

  public async getPids(args: EIDGetAccessTokenArgs): Promise<Array<PidResponse>> {
    const {authorizationCode} = args;
    this.handleStateChange({state: 'GETTING_ACCESS_TOKEN'});

    const pids = this.pidService.getPids({
      authorizationCode,
      pids: [
        {
          format: 'vc+sd-jwt',
          type: 'urn:eu.europa.ec.eudi:pid:1',
        },
        /*{
          format: 'mso_mdoc',
          type: 'eu.europa.ec.eudi.pid.1',
        },*/
      ],
    });
    this.pidService.close();
    return pids;
  }
}

export default VciServiceFunkeCProvider;
