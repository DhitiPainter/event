import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signInfoToken = 'sign-data-auth';
  jwtToken = 'auth-token';
  refreshTokens = 'refresh-token';
  authUserInfo = 'user-data';
  userInfo = 'user-data-auth';
  rememberUser = 'remember-user';

  constructor() { }

  getAuthToken() {
    return localStorage.getItem(this.jwtToken) || null;
  }

  setAuhToken(token: string) {
    localStorage.setItem(this.jwtToken, token);
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem(this.refreshTokens, refreshToken);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokens) || null;
  }

  destroyToken() {
    window.localStorage.removeItem(this.jwtToken);
  }

  getRememberUser() {
    return localStorage.getItem(this.rememberUser) || null;
  }

  refreshToken(): Observable<string> {
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */
    return new Observable<string>();
    // return this.httpService
    //   .post(ApiConstants.refreshToken, { RefreshToken: this.getRefreshToken() }).pipe(
    //     catchError(error => throwError(error)),
    //     map((response: any) => {
    //       return response;
    //     }));
  }

  setUserInfoAuth(userInfo: any) {
    localStorage.setItem(
      this.userInfo,
      userInfo ? btoa(JSON.stringify(userInfo)) : ''
    );
  }

  getUserInfoAuth(): any {
    return this.userInfo
      ? ((localStorage.getItem(this.userInfo) !== null && localStorage.getItem(this.userInfo) !== undefined &&
        localStorage.getItem(this.userInfo) !== '') ? (JSON.parse(atob(localStorage.getItem(this.userInfo)))) : null)
      : null;
  }

  logout() {
    localStorage.removeItem(this.jwtToken);
    localStorage.removeItem(this.userInfo);
    localStorage.removeItem(this.refreshTokens);
    localStorage.removeItem(this.signInfoToken);
  }
}
