import { Component, OnInit, Inject , ViewChildren , QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

//Service
import { DataService } from '../../core/services/genericCRUD/data.service'
import { StorageService } from '../../core/services/storage/storage.service';

//Models
import { Borrower } from '../../core/models/Borrower';
import { Incident } from '../../core/models/Incident';
import { Inventory } from '../../core/models/Inventory';
import { Transaction } from '../../core/models/Transaction';
import { Audit } from '../../core/models/Audit';
import { StorageKey } from '../../core/services/storage/storage.model';

const { AUTH_TOKEN } = StorageKey;

@Component({
    selector: 'app-borrow-return-page',
    templateUrl: './borrow-return-page.component.html',
    styleUrls: ['./borrow-return-page.component.scss'],
})
export class BorrowReturnPageComponent implements OnInit {

    userInfo : any;
    inventory : Inventory[] = [];
    instrument : any;
    accessory : any;
    multimedia : any;
    displayedColumns: string[] = [ 'itemID' ,'type', 'subType' ,'name' , 'description' ,'location', 'condition' , 'status' ];

    constructor(
        public DS: DataService,
        public dialog: MatDialog,
        private storage: StorageService
    ) {}

    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

    ngOnInit() {
        this.readInventory();
        this.userInfo = Object.values(this.storage.read(AUTH_TOKEN))[0];
    }

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

        this.instrument.paginator = this.paginator.toArray()[0];
        this.accessory.paginator = this.paginator.toArray()[1];
        this.multimedia.paginator = this.paginator.toArray()[2];
    }

    applyFilter(filterValue: string) {
        this.instrument.filter = filterValue.trim().toLowerCase();
        this.accessory.filter = filterValue.trim().toLowerCase();
    }

    openItem(row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            id : row._id,
            type : row.type,
            subType : row.subType,
            itemID : row.itemID,
            borrowerID : '',
            purpose: '',
            user : this.userInfo.username
        };
        if(row.status == 'AVAILABLE'){
            this.dialog.open(borrowDialog, dialogConfig).afterClosed().subscribe(result => {
                this.readInventory()
            });
        }else if (row.status == 'BORROWED'){
            this.dialog.open(returnDialog, dialogConfig).afterClosed().subscribe(result => {
                this.readInventory()
            });
        }else{
            alert('Item is Unavailable');
        }
    }    
}

@Component({
    selector : 'borrow-dialog',
    templateUrl : './dialog/borrow-dialog.html',
    styleUrls: ['./borrow-return-page.component.scss'],
})

export class borrowDialog implements OnInit {

    borrower :any;
    borrowForm : any;
    options : any;
    filteredOptions: Observable<string[]>;

    constructor(
        public DS: DataService,
        public dialogRef: MatDialogRef<borrowDialog>,
        public fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            this.borrowForm = this.fb.group({
                borrowerID: [''],
                itemID : [data.itemID],
                purpose : [''],
                dateBorrowed : [new Date().toLocaleString()],
                dateReturned : [''],
                lentBy: [this.data.user],
                receivedBy: [''],
                hasIncident: ['']
            })
        }
    ngOnInit() {
        this.getBorrowers();
        // this.filteredOptions = this.borrowForm.valueChanges
        //     .pipe(
        //      startWith(''),
        //      map(value => this._filter(value))
        // );

    }

    async getBorrowers() {
        const readPromise = this.DS.readPromise(Borrower);
        const [readRes] = await Promise.all([readPromise]);
        this.borrower = readRes;

        this.options = this.borrower.borrowerID
    }


    // private _filter(value: string): string[] {
    // const filterValue = value.toLowerCase();

    // return this.options.filter(option => option.toLowerCase().includes(filterValue));
    // }
    
    async submitBorrowForm(){
        let borrowerFormInfo : any;
        borrowerFormInfo = this.borrowForm.value;

        const updateItem = {
            id: this.data.id,
            status: 'BORROWED'
        }

        let audit = {
            date : new Date ,
            actionType : 'Lent item ' + this.data.itemID + ' to '+ borrowerFormInfo.borrowerID,
            actor : this.data.user
        }

        //borrwerID valdiation
        let query = "id=" + borrowerFormInfo.borrowerID;
        let type = "getByBorrower";
        const promise = this.DS.readPromise(Borrower , type , query);
        const [res] = await Promise.all([promise]);

        if (!res) {
            swal.fire({
                title: 'Error!',
                text: 'Student ID ' + borrowerFormInfo.borrowerID +' not found' ,
                type: 'warning',
                confirmButtonText: 'K.'
              })
        }else {
            if (this.borrowForm.valid){
                this.DS.createPromise(Audit , audit);
                this.DS.updatePromise(Inventory,updateItem);
                this.DS.createPromise(Transaction, this.borrowForm.value);
                this.dialogRef.close();
            }
        } 
    }
        
    onNoClick(): void {
        this.dialogRef.close();
    }

}

@Component({
    selector : 'return-dialog',
    templateUrl : './dialog/return-dialog.html',
    styleUrls: ['./borrow-return-page.component.scss'],
})

export class returnDialog implements OnInit {


    returnForm : any;
    singleTransactionSource : any;

    ngOnInit(){
        this.readLatestTransaction();
    };

    constructor(
        public DS: DataService,
        public dialog : MatDialog,
        public dialogRef: MatDialogRef<returnDialog>,
        public fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            this.returnForm = this.fb.group({
                id : [''],
                dateReturned : [new Date().toLocaleString()],
                receivedBy: [this.data.user],
                hasIncident: ['0']
            })
        }
    
    async readLatestTransaction(){
        const type = 'getLatest'
        const getIDquery = 'id='+this.data.itemID ;
        const readPromise = this.DS.readPromise(Transaction,type,getIDquery);
        const [readRes] = await Promise.all([readPromise]);
        this.singleTransactionSource = readRes;

        this.data.borrowerID = this.singleTransactionSource.borrowerID;
        this.data.purpose = this.singleTransactionSource.purpose;
        this.returnForm = this.fb.group({
            id : [this.singleTransactionSource._id],
            dateReturned : [new Date().toLocaleString()],
            receivedBy: ['bandoy'],
            hasIncident: ['0']
        })
    }    

    submitReturnForm(){
        const updateItem = {
            id : this.data.id,
            status : 'AVAILABLE'
        }

        let audit = {
            date : new Date ,
            actionType : 'Recieved item ' + this.data.itemID ,
            actor : this.data.user
        }

        if (this.returnForm.valid){
            this.DS.createPromise( Audit , audit);
            this.DS.updatePromise( Inventory, updateItem);
            this.DS.updatePromise( Transaction, this.returnForm.value );
            this.dialogRef.close();
        }
    }

    hasIncident(){
        const dialogConfigIncident = new MatDialogConfig();
        dialogConfigIncident.data = {
            itemObjectID : this.data.id,
            id : this.singleTransactionSource._id,
            itemID : this.singleTransactionSource.itemID,
            itemObject : this.data.id,
            bID : this.singleTransactionSource.borrowerID,
            firstName : '',
            lastName: '',
            purpose : '',
            dateBorrowed : '',

        };
        this.dialog.open(incidentDialog, dialogConfigIncident).afterClosed().subscribe(result => {
            
        });
       
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

@Component({
    selector : 'incident-dialog',
    templateUrl : './dialog/incident-dialog.html',
    styleUrls: ['./borrow-return-page.component.scss'],
})

export class incidentDialog implements OnInit {

    incidentForm : any;
    updateItemForm : any;
    borrowerInfo : any;
    transactionRaw : Transaction[] = [];
    transaction : any;
    displayedColumns : string[] = ['itemID' , 'purpose' , 'dateBorrowed' ];

    constructor(
        public DS: DataService,
        public dialogRef: MatDialogRef<incidentDialog>,
        public fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            this.incidentForm = this.fb.group({
                data : [new Date],
                tID : [data.id],
                bID : [data.bID],
                bName : [''],
                itemID :  [data.itemID],
                adminDescription: [''],
                borrowerDescription: ['']        
            })
        }

    ngOnInit(){
        this.readBorrower();
        this.readTransaction();
        //console.log(this.transaction);
        this.updateItemForm = this.fb.group({
            id : [this.data.itemObjectID],
            condition : [''],
            status : ['AVAILABLE']
        })
    }

    async readBorrower(){
        let query = "id=" + this.data.bID;
        let type = "getByBorrower"
        const promise = this.DS.readPromise(Borrower , type , query);
        const [res] = await Promise.all([promise]);
        this.borrowerInfo = res;
        this.data.firstName = this.borrowerInfo.firstName;
        this.data.lastName = this.borrowerInfo.lastName;
        let bName = this.data.firstName + " " + this.data.lastName;
        this.incidentForm = this.fb.group({
            date : [new Date],
            tID : [this.data.id],
            bID : [this.data.bID],
            bName : [bName],
            itemID :  [this.data.itemID],
            adminDescription: [''],
            borrowerDescription: ['']        
        })
        
    }

    async readTransaction() {
        let query = "id=" + this.data.id;
        let type = "get";
        const promise = this.DS.readPromise(Transaction , type , query);
        const [res] = await Promise.all([promise]);
        this.transactionRaw.push(res);
        this.transaction = new MatTableDataSource(this.transactionRaw);
    }

    submitIncidentForm() {

        let TransactionUpdate = {
            id : this.data.id,
            dateReturned : new Date,
            receivedBy : 'bandoy',
            hasIncident :'1'
        }

        if (this.updateItemForm.value.condition == 'Lost') {
            this.updateItemForm.value.status = 'NOT AVAILABLE';
        }

        if (this.incidentForm.valid){
            this.DS.updatePromise(Inventory , this.updateItemForm.value );
            this.DS.updatePromise(Transaction , TransactionUpdate);
            this.DS.createPromise(Incident , this.incidentForm.value );
            this.dialogRef.close();
            
        } 
        
    }
        
    onNoClick(): void {
        this.dialogRef.close();
    }

}
