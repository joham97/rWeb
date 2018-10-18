// Angular Modules
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Angular Material Design Modules
import { MatCardModule, MatIconModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { MatTabsModule, MatDialogModule, MatInputModule, MatMenuModule } from '@angular/material';

// Routing and components
import { AppRouting } from './routing/app.routing';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { PostComponent } from './post/post.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { CommentComponent } from './comment/comment.component';

// Services
import { RestService } from './services/rest.service';
import { RedditApiService } from './services/redditapi.service';
import { SessionService } from './services/session.service';
import { RouteGuardService } from './routing/route-guard.service';

// Declaring components, importing modules and referencing providers for the application
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
