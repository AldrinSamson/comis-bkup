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
    {
        path: 'inventory',
        loadChildren: () =>
            import('../inventory-page/inventory-page.module').then(
                m => m.InventoryPageModule,
            ),
        data: { title: 'Inventory Management', isChild: false },
    },
    {
        path: 'reports',
        loadChildren: () =>
            import('../reports-page/reports-page.module').then(
                m => m.ReportsPageModule,
            ),
        data: { title: 'Reports Management', isChild: false },
    },
    {
        path: 'borrow-return',
        loadChildren: () =>
            import('../borrow-return-page/borrow-return-page.module').then(
                m => m.BorrowReturnPageModule,
            ),
        data: { title: 'Borrow and Return', isChild: false },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
