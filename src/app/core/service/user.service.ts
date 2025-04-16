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

export const canActivateHome: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
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
