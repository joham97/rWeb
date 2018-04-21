import { RedditApiService } from './../services/redditapi.service';
import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTabGroup } from '@angular/material';

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
    private redditApi: RedditApiService) {
    this.popupType = data.popupType;
  }

  ngAfterViewInit() {
    setTimeout(data => {
      if (this.popupType === 'register') {
        this.matTabGroup.selectedIndex = 1;
      }
    }, 500);
  }

  public cancel() {
    this.dialogRef.close(false);
  }

  //#region Login
  public login() {
    if (this.username.length > 2 && this.password.length > 2) {
      this.redditApi.login(this.username, this.password).subscribe((data) => {
        if (data.success) {
          this.redditApi.setSession(data.data);
          this.dialogRef.close(true);
        } else {
          this.msgFailed = 'Login fehlgeschlagen.';
        }
      }, (err) => {
        this.msgFailed = 'Login fehlgeschlagen.';
      });
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
    if (this.username.length > 3 && this.password.length > 3 && this.password === this.passwordSubmit) {
      this.redditApi.register(this.username, this.password).subscribe((data) => {
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
