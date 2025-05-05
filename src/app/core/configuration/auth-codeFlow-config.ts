import {AuthConfig} from 'angular-oauth2-oidc';
import {environment} from '../../../environments/environment-dev';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.keyCloakUrl + '/realms/FSA',
  redirectUri: environment.feUrl + '/',
  clientId: 'stocks-app',
  scope: 'openid',
  showDebugInformation: true,
  requireHttps: false,

};
