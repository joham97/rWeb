import { RedditApiService } from './../services/redditapi.service';
import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTabGroup } from '@angular/material';
import sha256 from "sha256";
import { SessionService } from '../services/session.service';

// Component that contains the login mask
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  // Tabs (Login / Register)
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  // Form data (username, password)
  public username: string;
  public password: string;
  public passwordSubmit: string;
  // Popup state
  private popupType: string;

  // Login failed message
  public msgFailed: string;

  constructor(public dialogRef: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) data: any,
    private redditApi: RedditApiService, private sessionService: SessionService) {
    this.popupType = data.popupType;
  }

  // After view was initialized
  ngAfterViewInit() {
    // Switch to register view if state is setted to "register"
    setTimeout(data => {
      if (this.popupType === 'register') {
        this.matTabGroup.selectedIndex = 1;
      }
    }, 500);
    
    // Close dialog after login event was emitted
    this.redditApi.loggedIn.subscribe((err) => {
      this.dialogRef.close(true); // (successful)
    });
    
    // Show login error after error event was emitted
    this.redditApi.loginError.subscribe((err) => {
      this.msgFailed = err.message;
    });
  }

  // Close the dialog (not successful)
  public cancel() {
    this.dialogRef.close(false);
  }

  //#region Login
  public login() {
    // Check username and password length
    if (this.username.length > 0 && this.password.length > 3) {
      // Hashing password
      var hash = sha256(this.password);
      this.msgFailed = '';
      // Login call in API
      this.redditApi.login(this.username, hash);
    } else {
      this.msgFailed = 'Eingaben zu kurz.';
    }
  }

  // Emit login on pressing enter
  public keypressLogin(keycode) {
    if (keycode === 13) {
      // Falls Enter gedrückt
      this.login();
    }
  }
  //#endregion

  //#region Registration
  public register() {
    // Username and password length check
    if (this.username.length > 0 && this.password.length > 3 && this.password === this.passwordSubmit) {
      // Hashing password
      var hash = sha256(this.password);
      // Registration api call
      this.redditApi.register(this.username, hash).subscribe((data) => {
        // Switch to login if successful
        this.matTabGroup.selectedIndex = 0;
      }, (err) => {
        this.msgFailed = err.message;        
      });
    }
  }

  // Emit registration on pressing enter
  public keypressRegister(keycode) {
    if (keycode === 13) {
      // Falls Enter gedrückt
      this.register();
    }
  }
  //#endregion
}
