import { Component, OnInit, Inject ,ViewChild } from '@angular/core';
import { DataService } from '../../core/services/genericCRUD/data.service';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';

import { Borrower } from '../../core/models/Borrower';
import { Transaction } from '../../core/models/Transaction';
import { Incident } from '../../core/models/Incident';

@Component({
    selector: 'app-borrower-info-page',
    templateUrl: './borrower-info-page.component.html',
    styleUrls: ['./borrower-info-page.component.scss'],
})
export class BorrowerInfoPageComponent implements OnInit {

    
    borrower : any;
    borrowerRaw : Borrower[] = [];
  
    displayedColumnsBorrower : string[] = ['bID' , 'IDType' , 'name'];

    constructor(
        public DS: DataService,
        public dialog: MatDialog,  
    ) {}

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


    ngOnInit() {
        this.readBorrower();
    }

    async readBorrower() {
        const promise = this.DS.readPromise(Borrower);
        const [res] = await Promise.all([promise]);
        this.borrower = new MatTableDataSource(this.borrowerRaw = res);
        this.borrower.paginator = this.paginator
    }

    applyFilter(filterValue: string) {
        this.borrower.filter = filterValue.trim().toLowerCase();
    }

    openAddBorrower():void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.maxHeight = 500;
        dialogConfig.maxWidth = 700;
        this.dialog.open(addBorrowerDialog , dialogConfig).afterClosed().subscribe(result => {
        this.readBorrower()
        });
    }

    openEditBorrower(row):void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            id: row._id,
            bID : row.bID,
            IDType : row.IDType,
            firstName : row.firstName,
            lastName : row.lastName,
            isBan : row.isBan
        }
        dialogConfig.maxHeight = 2000;
        dialogConfig.maxWidth = 2000;
        this.dialog.open(editBorrowerDialog , dialogConfig).afterClosed().subscribe(result => {
        this.readBorrower()
        });
    }

}

@Component({
    selector : 'add-borrower-dialog',
    templateUrl : './dialog/add-borrower-dialog.html',
    styleUrls: ['./borrower-info-page.component.scss'],
  })

export class addBorrowerDialog {

    addBorrowerForm : any;
    checked = false;

    constructor(
        public DS: DataService,
        public dialogRef: MatDialogRef<addBorrowerDialog>,
        public fb: FormBuilder,
        ) {
          this.addBorrowerForm = this.fb.group({
            bID : [''],
            IDType : [''],
            firstName : [''],
            lastName : [''],
            isBan : ['0'],
          })
        }

    submitAddBorrowerForm() {
        
       
        if (this.addBorrowerForm.valid){
            this.DS.createPromise(Borrower, this.addBorrowerForm.value);
            this.dialogRef.close();
        } 
         
    }

    onNoClick(): void {
    this.dialogRef.close();
    }
}

@Component({
    selector : 'edit-borrower-dialog',
    templateUrl : './dialog/edit-borrower-dialog.html',
    styleUrls: ['./borrower-info-page.component.scss'],
  })

export class editBorrowerDialog implements OnInit{

    editBorrowerForm : any;

    bTransactionRaw: Transaction[] = [];
    bTransaction: any;
    displayedColumnsTransaction : string[] = ['itemID' , 'purpose' , 'dateBorrowed' , 'dateReturned', 'hasIncident'];

    incident : any;
    incidentRaw : Incident[] = [];
    displayedColumnsIncident : string[] = ['date' ,'itemID'];

    constructor(
        public DS: DataService,
        public dialogRef: MatDialogRef<editBorrowerDialog>,
        public fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
          this.editBorrowerForm = this.fb.group({
            id : [data.id],
            IDType : [data.IDType],
            firstName : [data.firstName],
            lastName : [data.lastName],
            isBan : [data.isBan],
          })
        }

    ngOnInit() {
       this.readBorrowerTransactions();
       this.readIncident();
    }

    async readBorrowerTransactions(){

        let query = "id=" + this.data.bID;
        let type = "getByBorrower";
        const promise = this.DS.readPromise(Transaction , type , query);
        const [res] = await Promise.all([promise]);
        this.bTransactionRaw = res;
        this.bTransaction = new MatTableDataSource(this.bTransactionRaw);
    } 

    async readIncident() {

        let query = "id=" + this.data.bID;
        let type = "getByBorrower";
        const promise = this.DS.readPromise(Incident, type , query);
        const [res] = await Promise.all([promise]);
        this.incidentRaw = res;
        this.incident = new MatTableDataSource(this.incidentRaw);
    }

    submitEditBorrowerForm() {
        if (this.editBorrowerForm.valid){
            this.DS.updatePromise(Borrower , this.editBorrowerForm.value);
            this.dialogRef.close();
        }
        
    }

    deleteBorrower(){
        this.DS.deletePromise(Borrower , this.editBorrowerForm.value);
        this.dialogRef.close();
    }

    onNoClick(): void {
    this.dialogRef.close();
    }

}

