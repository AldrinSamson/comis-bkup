import { Component, OnInit, Inject , ViewChild  } from '@angular/core';
import { DataService } from '../../core/services/genericCRUD/data.service';
import { MatTableDataSource, MatTab } from '@angular/material';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';

import { Account } from '../../core/models/Account';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  account : any;
  accountRaw : Account[] = [];
  displayedColumns : string [] = ['username' , 'class', 'name' ]

  constructor(
    public DS: DataService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.readAccount();
  }

  async readAccount(){
    const promise = this.DS.readPromise(Account);
    const [res] = await Promise.all([promise]);
    this.account = new MatTableDataSource(this.accountRaw = res);
    this.account.paginator = this.paginator
  }

  openAddAccount():void {
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(addAccountDialog , dialogConfig).afterClosed().subscribe(result => {
      this.readAccount()
    });
  }

  openEditAccount(row):void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id : row._id,
      username : row.username,
      password : row.password,
      accountID : row.accountID,
      class : row.class,
      firstName : row.firstName,
      lastName : row.lastName,
      securityAnswer1 : row.securityAnswer1,
      securityAnswer2 : row.securityAnswer2   
    }
    this.dialog.open(editAccountDialog , dialogConfig).afterClosed().subscribe(result => {
      this.readAccount()
    });
  }

}

@Component({
  selector : 'add-account-dialog',
  templateUrl : './dialog/add-account-dialog.html',
  styleUrls: ['./account-page.component.scss'],
})

export class addAccountDialog {

  addAccountForm : any;

  constructor( 
    public DS: DataService,
    public dialogRef: MatDialogRef<addAccountDialog>,
    public fb: FormBuilder,
  ){
    this.addAccountForm = this.fb.group({
      accountID : [''],
      username : [''],
      password : [''],
      class : [''],
      firstName : [''],
      lastName : [''],
      securityAnswer1 : [''],
      securityAnswer2 : ['']
    })
  }

submitAddAccountForm() {
    if (this.addAccountForm.valid){
        this.DS.createPromise(Account, this.addAccountForm.value);
        this.dialogRef.close();
    }  
}

onNoClick(): void {
this.dialogRef.close();
}

}

@Component({
  selector : 'edit-account-dialog',
  templateUrl : './dialog/edit-account-dialog.html',
  styleUrls: ['./account-page.component.scss'],
})

export class editAccountDialog {

  editAccountForm : any;

  constructor(
    public DS: DataService,
    public dialogRef: MatDialogRef<editAccountDialog>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.editAccountForm = this.fb.group({
        id : [this.data.id],
        accountID : [this.data.accountID],
        username : [this.data.username],
        password : [this.data.password],
        class : [this.data.class],
        firstName : [this.data.firstName],
        lastName : [this.data.lastName],
        securityAnswer1 : [this.data.securityAnswer1],
        securityAnswer2 : [this.data.securityAnswer2] 
      })
    }

  submitEditAccountForm() {
        if (this.editAccountForm.valid){
            this.DS.updatePromise(Account , this.editAccountForm.value);
            this.dialogRef.close();
        }
        
    }

    deleteAccount(){
        this.DS.deletePromise(Account , this.editAccountForm.value);
        this.dialogRef.close();
    }

    onNoClick(): void {
    this.dialogRef.close();
    }  
}