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
import { TestComponent } from './test/test.component';
import { CommentComponent } from './comment/comment.component';
import { SessionService } from './services/session.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/r/krz',
    pathMatch: 'full'
  },
  {
    path: 'r/krz',
    component: HomeComponent
  },
  {
    path: 'r/krz/hot',
    component: HomeComponent
  },
  {
    path: 'r/krz/test',
    component: TestComponent
  },
  {
    path: 'r/krz/post/:id',
    component: PostComponent
  },
  {
    path: 'r/krz/upload',
    component: UploadComponent
  },
  {
    path: '**',
    redirectTo: '/r/krz'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadComponent,
    PostComponent,
    LoginComponent,
    TestComponent,
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
    RouterModule.forRoot(
      appRoutes, { useHash: true }
    ),
  ],
  providers: [
    RestService,
    RedditApiService,
    SessionService
  ],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
