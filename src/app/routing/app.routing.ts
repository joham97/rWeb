import { HomeComponent } from '../home/home.component';
import { UploadComponent } from '../upload/upload.component';
import { PostComponent } from '../post/post.component';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuardService } from './route-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [RouteGuardService],
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
    path: 'r/krz/post/:id',
    component: PostComponent
  },
  {
    path: 'r/krz/upload',
    component: UploadComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: '**',
    redirectTo: '/r/krz'
  }
];

export const AppRouting = RouterModule.forRoot(appRoutes, { useHash: true });