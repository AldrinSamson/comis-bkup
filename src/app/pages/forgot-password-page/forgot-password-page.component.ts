import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

//Service
import { DataService } from '../../core/services/genericCRUD/data.service'

//Models
import { Audit } from '../../core/models/Audit';
import { Account } from '../../core/models/Account';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss']
})
export class ForgotPasswordPageComponent implements OnInit {

  usernameForm : any;

  constructor(
    public DS: DataService,
    public dialog: MatDialog,
    public fb: FormBuilder
  ) { 
    this.usernameForm = this.fb.group({
    username : [''] 
  })}

  ngOnInit() {
    
  }

  async submitUsernameForm(){

    let user = this.usernameForm.value;
    let type = 'checkUsername'
    let query = {
      id : user.username
    }
    const promise = this.DS.readPromise(Account , type , query);
    const [res] = await Promise.all([promise]);
    

    if (!res) {
      swal.fire({
        title: 'Oh oh',
        text: 'Username does not exist' ,
        type: 'warning',
        confirmButtonText: 'K.'
      })
    }else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        username : user.username
      }
      this.dialog.open(questionDialog , dialogConfig);
    }


  }

}

@Component({
    selector : 'question-dialog',
    templateUrl : './dialog/question-dialog.html'
})

export class questionDialog {

    answerForm : any;

    constructor(
      public DS: DataService,
      public dialogRef: MatDialogRef<questionDialog>,
      public fb: FormBuilder,
      public dialog: MatDialog ,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {
          this.answerForm = this.fb.group({
              username : [this.data.username],
              securityAnswer1 : [''],
              securityAnswer2 : ['']
          })
      }

      async submitAnswerForm() {
        if (this.answerForm.valid){

            let answer = this.answerForm.value;
            let type = 'validateAnswer'
            let query = {
              id : this.data.username,
              a1: answer.securityAnswer1,
              a2: answer.securityAnswer2
            }
            const promise = this.DS.readPromise(Account , type , query);
            const [res] = await Promise.all([promise]);

            if (!res){
              swal.fire({
                title: 'Oh oh',
                text: 'Wrong Answers' ,
                type: 'warning',
                confirmButtonText: 'K.'
              })
            }else {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                id: res._id,
                username : this.data.username
              }
              this.dialog.open(resetDialog , dialogConfig);
              this.dialogRef.close();
            }
        }
      }

      onNoClick(): void {
        this.dialogRef.close();
    }
}

@Component({
  selector : 'reset-dialog',
  templateUrl : './dialog/reset-dialog.html'
})

export class resetDialog {

    resetForm : any;

    constructor(
      public DS: DataService,
      public dialogRef: MatDialogRef<resetDialog>,
      public fb: FormBuilder,
      public router: Router,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {
          this.resetForm = this.fb.group({
              id: [this.data.id],
              password : ['']
          })
      }

      sumbitResetForm() {
        let audit = {
          date : new Date, 
          actionType : 'Reset Password'+ this.data.username,
          actor : this.data.username
      }

      if (this.resetForm.valid){
          this.DS.createPromise(Audit , audit);
          this.DS.updatePromise(Account, this.resetForm.value);
          this.dialogRef.close();
          this.router.navigate(['login']);
          swal.fire({
            title: 'Success!',
            text: 'Password Reset!' ,
            type: 'success',
            confirmButtonText: 'K.'
          })
         
      }
      }

      onNoClick(): void {
        this.dialogRef.close();
    }
}