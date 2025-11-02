import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/app/app.page.component').then((m) => m.AppPageComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./layout/blog-feed/blog-feed.component').then((m) => m.BlogFeedComponent)
      },
      {
        path: 'posts/:id',
        loadComponent: () => import('./layout/post-detail/post-detail.component').then((m) => m.PostDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
