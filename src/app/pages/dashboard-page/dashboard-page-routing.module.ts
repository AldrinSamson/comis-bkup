import { DashboardPageComponent } from './dashboard-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: DashboardPageComponent,
        data: { shouldReuse: true, key: 'dashboard' },
    },
    {
        path: 'account',
        loadChildren: () =>
            import('../account-page/account-page.module').then(
                m => m.AccountPageModule,
            ),
        data: { title: 'Account Management', isChild: true },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
