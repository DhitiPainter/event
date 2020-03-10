import { ModuleWithProviders } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared';
import { AuthGuard } from './core/guards';

const routes: Routes = [  
  {
    path: '',
    redirectTo: 'event',
    pathMatch: 'full'
    // canActivate: [AuthGuard],
    // loadChildren: () => import('./modules/event').then(m => m.EventModule)
  },
  {
    path: 'event',
    // canActivate: [AuthGuard],
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
