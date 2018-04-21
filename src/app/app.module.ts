import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RestService } from './services/rest.service';
import { RedditApiService } from './services/redditapi.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule, MatCardModule, MatIconModule, MatNativeDateModule, MatListModule, MatFormFieldModule } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatDatepickerModule, MatInputModule, MatMenuModule } from '@angular/material';
import { MatTabsModule, MAT_DATE_LOCALE, MatSnackBarModule, MatExpansionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { PostComponent } from './post/post.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { CommentComponent } from './comment/comment.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/r/dev',
    pathMatch: 'full'
  },
  {
    path: 'r/dev',
    component: HomeComponent
  },
  {
    path: 'r/dev/hot',
    component: HomeComponent
  },
  {
    path: 'r/dev/test',
    component: TestComponent
  },
  {
    path: 'r/dev/post/:id',
    component: PostComponent
  },
  {
    path: 'r/dev/upload',
    component: UploadComponent
  },
  {
    path: '**',
    redirectTo: '/r/dev'
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
    RouterModule.forRoot(
      appRoutes, { useHash: true }
    ),
  ],
  providers: [
    RestService,
    RedditApiService
  ],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
