import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';


import { InventoryPageRoutingModule } from './inventory-page-routing.module';
import { InventoryPageComponent, addInventoryDialog, editInventoryDialog } from './inventory-page.component';

@NgModule({
    entryComponents : [addInventoryDialog , editInventoryDialog],
    declarations: [InventoryPageComponent , addInventoryDialog , editInventoryDialog],
    imports: [CommonModule, InventoryPageRoutingModule , MaterialModule],
})
export class InventoryPageModule {}
