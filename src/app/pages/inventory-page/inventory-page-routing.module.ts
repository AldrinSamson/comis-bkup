import { InventoryPageComponent, addInventoryDialog, editInventoryDialog } from './inventory-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: InventoryPageComponent,
        data: { shouldReuse: true, key: 'inventory' },
    },
    {
        path: 'inventoryConfig',
        loadChildren: () =>
            import('../inventory-config-page/inventory-config-page.module').then(
                m => m.InventoryConfigPageModule,
            ),
        data: { title: 'Inventory Configuration', isChild: true },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    
})
export class InventoryPageRoutingModule {}
