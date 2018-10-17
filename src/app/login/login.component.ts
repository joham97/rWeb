import { RedditApiService } from './../services/redditapi.service';
import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTabGroup } from '@angular/material';
import sha256 from "sha256";
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  public username: string;
  public password: string;
  public passwordSubmit: string;
  private popupType: string; // Standard --> Login; andernfalls --> Registrieren

  public msgFailed: string;

  constructor(public dialogRef: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) data: any,
    private redditApi: RedditApiService, private sessionService: SessionService) {
    this.popupType = data.popupType;
  }

  ngAfterViewInit() {
    setTimeout(data => {
      if (this.popupType === 'register') {
        this.matTabGroup.selectedIndex = 1;
      }
    }, 500);
    
    this.redditApi.loggedIn.subscribe((err) => {
      this.dialogRef.close(true);
    });
    
    this.redditApi.loginError.subscribe((err) => {
      this.msgFailed = err.message;
    });
  }

  public cancel() {
    this.dialogRef.close(false);
  }

  //#region Login
  public login() {
    if (this.username.length > 0 && this.password.length > 3) {
      var hash = sha256(this.password);
      this.msgFailed = '';
      this.redditApi.login(this.username, hash);
    } else {
      this.msgFailed = 'Eingaben zu kurz.';
    }
  }

  public keypressLogin(keycode) {
    if (keycode === 13) {
      // Falls Enter gedrückt
      this.login();
    }
  }
  //#endregion

  //#region Registrieren
  public register() {
    if (this.username.length > 0 && this.password.length > 3 && this.password === this.passwordSubmit) {
      var hash = sha256(this.password);
      this.redditApi.register(this.username, hash).subscribe((data) => {
        this.matTabGroup.selectedIndex = 0;
      });
    }
  }

  public keypressRegister(keycode) {
    if (keycode === 13) {
      // Falls Enter gedrückt
      this.register();
    }
  }
  //#endregion
}
