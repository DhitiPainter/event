import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonAuthLayoutComponent } from './non-auth-layout.component';
import { LandingPageComponent, LoginComponent } from './components';

const routes: Routes = [
  {
    path: '', component: NonAuthLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
    ]
  }
];

export const NonAuthRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
