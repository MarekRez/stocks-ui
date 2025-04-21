import {inject, Injectable, signal} from '@angular/core';
import {UserModel} from '../model/user-model';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../configuration/auth-codeFlow-config';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = signal<UserModel | undefined>(undefined);

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.tryLogin();

    this.oauthService.events.subscribe(e => {
      // console.log('OAuth event:', e.type, e);

      // if (e.type === 'discovery_document_loaded') {
      //   this.oauthService.loadDiscoveryDocumentAndTryLogin();
      // }
      if (e.type === 'token_received') {
        this.user.set(this.oauthService.getIdentityClaims() as UserModel);
      }
      if (e.type === 'logout' || e.type === 'session_terminated' || e.type === 'token_expires') {
        this.user.set(undefined);
      }
    });
  }

  getUserSignal() {
    return this.user.asReadonly();
  }

  async tryLogin() {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    let userModel = this.oauthService.getIdentityClaims() as UserModel;
    this.user.set(userModel);
    return userModel;
  }

  login() {
    this.oauthService.loadDiscoveryDocumentAndLogin()
      .then(() => {
        this.user.set(this.oauthService.getIdentityClaims() as UserModel);
      })
  }

  logout() {
    this.oauthService.logOut();
    this.user.set(undefined);
  }

  async isUserLoggedIn() {
    const userModel = await this.tryLogin();
    return !!userModel;
  }

}

export const canActivate: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const value = await userService.isUserLoggedIn();
  if (value) {
    return true;
  } else {
    userService.login();
    return false;
  }
}
