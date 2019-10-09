import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Inventory } from '../../core/models/Inventory';
import { InventorySubType } from '../../core/models/InventorySubType';
import { InventoryType } from '../../core/models/InventoryType';
import { DataService } from '../../core/services/genericCRUD/data.service'
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Transaction } from '../../core/models/Transaction';

@Component({
    selector: 'app-inventory-page',
    templateUrl: './inventory-page.component.html',
    styleUrls: ['./inventory-page.component.scss'],
})

export class InventoryPageComponent implements OnInit {
    
    // inventory = new MatTableDataSource<IInventory>();
    inventory : Inventory[] = [];
    instrument : any;
    accessory : any;
    multimedia : any;
    displayedColumns: string[] = [ 'itemID' ,'type', 'subType' ,'name' , 'description' ,'location', 'condition' ];
    

    ngOnInit() {
        this.readInventory();
    }

    constructor(
        public DS: DataService,
        public dialog: MatDialog,
    ) { }

    async readInventory() {
        const inventoryPromise = this.DS.readPromise(Inventory);
    
        const [inventoryRes] = await Promise.all([inventoryPromise]);
    
        this.inventory = inventoryRes;

        this.instrument = this.inventory.filter(function(item){
            return item.class == 'Instrument' 
        });
        this.accessory = this.inventory.filter(function(item){
            return item.class == 'Accessory' 
        });
        this.multimedia = this.inventory.filter(function(item){
            return item.class == 'Multimedia'
        });

        this.instrument = new MatTableDataSource(this.instrument);
        this.accessory = new MatTableDataSource(this.accessory);
        this.multimedia = new MatTableDataSource(this.multimedia);
    }

    applyFilter(filterValue: string) {
        this.instrument.filter = filterValue.trim().toLowerCase();
        this.accessory.filter = filterValue.trim().toLowerCase();
      }
    
    // TODO : refractor dialog functions
    openAddInventoryDialog(classs):void {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            class : classs
        };

        this.dialog.open(addInventoryDialog, dialogConfig).afterClosed().subscribe(result => {
            this.readInventory()
        });
    }

    editInventory(row , classs) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            class : classs,
            type : row.type,
            id : row._id, 
            itemID : '',
            subType : '',
            name: row.name,
            description : row.description,
            condition : row.condition,
            location : row.location
        };

        this.dialog.open(editInventoryDialog, dialogConfig).afterClosed().subscribe(result => {
            this.readInventory()
        });
    }

}

@Component({
    selector : 'addInventory-dialog',
    templateUrl : './dialog/addInventory-dialog.html',
})

export class addInventoryDialog implements OnInit{

    addInventoryForm : any;
    inventoryAbbv : any;
    inventoryNum : any;
    types : any;
    subTypes: any;

    constructor(
        public DS: DataService,
        public dialogRef: MatDialogRef<addInventoryDialog>,
        public fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            this.addInventoryForm = this.fb.group({
                class: [data.class],
                type : [''],
                subType : [''],
                name : [''],
                description: [''],
                location: [''],
                condition : [''],
                status: [''],
                dateAdded : [''],
                dateEdited : [''],
                addedBy : [''],
                editedBy : ['']
            })
        }
    
    ngOnInit() {
        this.readType();
    }

    async readType(){

        const query = "class=" + this.data.class;
        const type = "get";
        const promise = this.DS.readPromise(InventoryType , type , query);
        const [res] = await Promise.all([promise]);
        this.types = res;
    }
    
    async readSubType(type){

        const query = "class=" + this.data.class + "&type=" + type.value; 
        const types = "get";
        const promise = this.DS.readPromise(InventorySubType , types , query);
        const [res] = await Promise.all([promise]);
        this.subTypes = res;

    }
    
    async submitAddInventoryForm() {
        
        if (this.addInventoryForm.valid){
                // get Abbv
            const type = 'get';
            const getAbbv = 'class='+this.addInventoryForm.value.class+'&type='+this.addInventoryForm.value.type+'&subType='+this.addInventoryForm.value.subType;
            const promise = this.DS.readPromise(InventorySubType , type , getAbbv );
            const [res] = await Promise.all([promise]);
            this.inventoryAbbv = res;

            // get lastNum 
            const getNum = 'subType='+this.addInventoryForm.value.subType;
            const promise2 = this.DS.readPromise(Inventory , type , getNum );
            const [res2] = await Promise.all([promise2]);
            this.inventoryNum = res2;
        
            let newNum = 0;
            if(this.inventoryNum == null){
                newNum = 1;
            }else{
                newNum = this.inventoryNum.itemNum + 1;
            } 
       
            const itemCode = this.inventoryAbbv[0].subTypeAbbv + '-' + newNum;

            this.addInventoryForm = this.fb.group({
                itemID :[itemCode],
                itemNum : [newNum],
                class: [this.addInventoryForm.value.class],
                type : [this.addInventoryForm.value.type],
                subType : [this.addInventoryForm.value.subType],
                name : [this.addInventoryForm.value.name],
                description: [this.addInventoryForm.value.description],
                location: [this.addInventoryForm.value.location],
                condition : [this.addInventoryForm.value.condition],
                status: ['OK'],
                dateAdded : [new Date()],
                dateEdited : [''],
                addedBy : ['bandoy'],
                editedBy : ['']
            })

            this.DS.createPromise(Inventory , this.addInventoryForm.value);
            this.dialogRef.close();
        }
    
    }
        
    onNoClick(): void {
        this.dialogRef.close();
    }

}

@Component({
    selector : 'editInventory-dialog',
    templateUrl : './dialog/editInventory-dialog.html',
    styleUrls: ['./inventory-page.component.scss'],
})

export class editInventoryDialog implements OnInit {

    editInventoryForm : any;
    singleInventorySource : any;
    singleInventory  = new MatTableDataSource<Inventory>(this.singleInventorySource);

    iTransactionRaw: Transaction[] = [];
    iTransaction: any;
    displayedColumnsTransaction : string[] = ['borrowerID' , 'purpose' , 'dateBorrowed' , 'dateReturned', 'hasIncident'];

    ngOnInit() {
        this.readSingleInventory();
    }
    
    constructor(
        public DS: DataService,
        public dialogRef: MatDialogRef<editInventoryDialog>,
        public fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            this.editInventoryForm = this.fb.group({
                id: [data.id],
                name : [data.name],
                description: [data.description],
                location: [data.location],
                condition : [data.condition],
                dateEdited : [new Date()],
                editedBy : ['bandoy'],
            })
    }

    async readSingleInventory() {
        
        let getIDquery = 'id='+this.data.id ;
        let type = 'get';
        const inventoryPromise = this.DS.readPromise(Inventory ,type, getIDquery);
        const [inventoryRes] = await Promise.all([inventoryPromise]);
        this.singleInventorySource = inventoryRes;
        this.data.itemID = this.singleInventorySource.itemID
        this.data.subType = this.singleInventorySource.subType

        this.readItemTransactions(this.singleInventorySource.itemID);
    }

    async readItemTransactions(itemID){

        let query = "id=" + itemID;
        let type = "getByItem";
        const promise = this.DS.readPromise(Transaction , type , query);
        const [res] = await Promise.all([promise]);
        this.iTransactionRaw = res;
        this.iTransaction = new MatTableDataSource(this.iTransactionRaw);
    }

    submitEditInventoryForm(){
        if (this.editInventoryForm.valid){
            this.DS.updatePromise(Inventory, this.editInventoryForm.value);
            this.dialogRef.close();
        }
        
    }

    deleteItem() {
        this.DS.deletePromise(Inventory , this.editInventoryForm.value );
        this.dialogRef.close();
    }

    onNoClick(): void {
            this.dialogRef.close();
    }
}
