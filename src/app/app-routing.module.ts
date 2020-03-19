import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'event',
    pathMatch: 'full'
  },
  {
    path: 'event',
    loadChildren: () => import('./modules/event').then(m => m.EventModule)
  },
  {
    component: NotFoundComponent,
    path: '404'
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes, {
  onSameUrlNavigation: 'reload'
});
