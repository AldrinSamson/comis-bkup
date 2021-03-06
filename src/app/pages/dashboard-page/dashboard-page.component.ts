import { Component, OnInit, Inject} from '@angular/core';
import { DataService } from '../../core/services/genericCRUD/data.service'
import { Chart } from 'chart.js';
import { forkJoin, Subject, concat } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import 'chartjs-plugin-labels'; 
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';

import { Inventory } from '../../core/models/Inventory';
import { Transaction } from '../../core/models/Transaction';
import { borrowDialog } from '../staff-view-page/staff-view-page.component';

Chart.defaults.global.defaultFontStyle = 'Bold'
Chart.defaults.global.defaultFontSize = 16
Chart.defaults.global.defaultFontColor = 'Black'

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {

  
  private unsub: Subject<void> = new Subject<any>();
  inventory : Inventory[] = [];
  FI : any;
  FB : any;
  FIcount : any;
  FIlabel : any;
  FBcount : any;
  FIchart = [];
  FBchart = [];

  constructor(
        public DS: DataService,
        public dialog: MatDialog
    ) { }


  ngOnInit() {
      this.readInventory();
      this.readFI();
      this.readFB();  
  }  

  formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  dateToday = this.formatDate(new Date());

  readFI(){
    const type = "frequentItems";
    const FIObs = this.DS.readObs(Transaction , type);
    forkJoin([FIObs])
      .pipe(takeUntil(this.unsub))
      .subscribe(
      (res: any) => {
        this.FI = res[0];
        this.FIcount = this.FI.map(a => a.count);
        this.FIlabel = this.FI.map(a => a._id);

        this.FIchart.push(new Chart('FIchart', {
          type : 'pie',
          data : {
            labels :this.FIlabel,
            datasets : [{
              data: this.FIcount,
              label : "Items",
              backgroundColor: ['#ffb8c9', '#f5c4e5', '#e4d1f9', '#d5dfff', '#ceeaff', '#d1f3ff'],
              hoverBackgroundColor: ['#ffb8c9', '#f5c4e5', '#e4d1f9', '#d5dfff', '#ceeaff', '#d1f3ff'],
              borderWidth: 2,
            }] 
          },
          options : {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
      
            }
          }
      }))
    },
      err => console.error(err)
    );
  }

  readFB(){
    const type = "frequentBorrowers";
    const FBObs = this.DS.readObs(Transaction , type);
    forkJoin([FBObs])
      .pipe(takeUntil(this.unsub))
      .subscribe(
      (res: any) => {

        let bDetails ;
        let name = [];

        this.FB = res[0];
        this.FBcount = this.FB.map(a => a.count);
        bDetails = this.FB.map(a => a.bDetails);
      
        Object.keys(bDetails).forEach(function (item) {
          const value = bDetails[item][0].firstName + " " + bDetails[item][0].lastName;
          name.push(value);
        })

        this.FBchart.push(new Chart('FBchart', {
          type : 'pie',
          data : {
            labels : name,
            
            datasets : [{
              data: this.FBcount,
              label : "Items",
              backgroundColor:['#ffb8c9', '#f5c4e5', '#e4d1f9', '#d5dfff', '#ceeaff', '#d1f3ff'],
              hoverBackgroundColor: ['#ffb8c9', '#f5c4e5', '#e4d1f9', '#d5dfff', '#ceeaff', '#d1f3ff'],
              borderWidth: 2,
            }] 
          },
          options : {
            responsive: true, 
            
            maintainAspectRatio: false,
            plugins: {
        
            }
          }
      }))
    },
      err => console.error(err)
    );
  }

  
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }


   async readInventory() {
        const inventoryPromise = this.DS.readPromise(Inventory);   
        const [inventoryRes] = await Promise.all([inventoryPromise]);
        this.inventory = inventoryRes;
   }

   public countBorrowed(values: any[]) {
        return values.filter((x) => x.status == "BORROWED" ).length;
   }

   public countIssues(values: any[]) {
    return values.filter((x) => x.condition != "OK" ).length;
  }

  openIssuesDialog():void {
        
    const dialogConfig = new MatDialogConfig();

    this.dialog.open(issueDialog, dialogConfig).afterClosed().subscribe(result => {
    });
  }

  openBorrowedDialog():void {
        
    const dialogConfig = new MatDialogConfig();

    this.dialog.open(borrowedDialog, dialogConfig).afterClosed().subscribe(result => {
    });
  }



}

@Component({
  selector : 'borrowed-dialog',
  templateUrl : './dialog/borrowed-dialog.html',
  styleUrls: ['./dashboard-page.component.scss'],
})

export class borrowedDialog implements OnInit {


  transactions : any;
  filtered : any;
  displayedColumns : string[] = ['itemID', 'dateBorrowed' , 'name']; 

  constructor(
    public DS: DataService,
    public dialog : MatDialog,
    public dialogRef: MatDialogRef<borrowedDialog>,
    ) {

    }
  
  
  ngOnInit(){
    this.readBorrower();
  };

  async readBorrower(){

    let  type = "getBorrowed" 

    const inventoryPromise = this.DS.readPromise(Transaction , type);   
    const [inventoryRes] = await Promise.all([inventoryPromise]);
    this.transactions = inventoryRes;

    this.filtered = this.transactions.filter(function(item){
      return item.dateReturned == null; 
    });

    console.log(this.filtered);




  }

  onNoClick(): void {
    this.dialogRef.close();
    }



}

@Component({
  selector : 'issue-dialog',
  templateUrl : './dialog/issue-dialog.html',
  styleUrls: ['./dashboard-page.component.scss'],
})

export class issueDialog implements OnInit {

  inventory : Inventory[] = []
  issues : any;
  displayedColumns: string[] = [ 'itemID'  ,'name' , 'condition' ];

  constructor(
    public DS: DataService,
    public dialog : MatDialog,
    public dialogRef: MatDialogRef<issueDialog>,
    ) {

    }
  
  
  ngOnInit(){
    this.readInventory();
  };

  async readInventory() {
    const inventoryPromise = this.DS.readPromise(Inventory);   
    const [inventoryRes] = await Promise.all([inventoryPromise]);
    this.inventory = inventoryRes;

    this.issues = this.inventory.filter(function(item){
      return item.condition != 'OK' 
    });

    this.issues = new MatTableDataSource(this.issues)

}

onNoClick(): void {
  this.dialogRef.close();
  }


}
