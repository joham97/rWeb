import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RestService } from './services/rest.service';
import { RedditApiService } from './services/redditapi.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatInputModule, MatMenuModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { PostComponent } from './post/post.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { CommentComponent } from './comment/comment.component';
import { SessionService } from './services/session.service';

import { AppRouting } from './routing/app.routing';
import { RouteGuardService } from './routing/route-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadComponent,
    PostComponent,
    LoginComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    AppRouting
  ],
  providers: [
    RestService,
    RedditApiService,
    SessionService,
    RouteGuardService
  ],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
