import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';


// import { DETMACH2 } from './app.model';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('Lab Monitor');

selmachines: DETMACH2[] = [];
machine_dev: string = '';

  Devs:string[] = ['EDG', 'GEN', 'POL','TRC'];

  DEFLMON1: any;
  DETMACH2s_DEV: DETMACH2[] = [];
  allmachines: DETMACH2[] = []

  machines: DETMACH2[] = [
    // {
    //   MACHINE_ID: 'M001',
    //   MACHINE_DESC: 'Lathe Machine',
    //   DEPT_CODE: 'D01',
    //   MACHINE_DEV: 'DEV001',
    //   MACHINE_TYPE: 'Lathe',
    //   selected: false,

    //   position: { x: 100, y: 100 },
    //   initialPosition: { x: 100, y: 100 },
    //   machineImageUrl: 'https://absapi.absolution1.com/mystaticfiles/generator.jpg'

    // }
  ];

  DETMACH0_DEV: DETMACH0[] = [];
  devices: DETMACH0[] = []

  stats: DETJOBM4[] = [
    {
      JOB_NO: 'J001',
      STATUS_CODE: 'InProgress',
      INIT_OPER: 'OP001',
      INIT_DATE: new Date(),
      MACHINE_ID: 'M001'
    },


  ];
  selectedDETMACH2: any;

constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.readJsonFile();
  }

  async readJsonFile() {
    await this.http.get<DETJOBM4[]>('assets/data/STATS.json')
      .pipe(
        // Map the array of objects to an array of strings (e.g., the 'name' property)
        // map(data => data.map(item => item.name)) 
      )
      .subscribe(result => {
        this.stats = result;
        console.log(this.stats); 
      });
     
    await this.http.get<DETMACH2[]>('assets/data/DETMACH2_HAW.json')
      .pipe(
        // map(machine:DETMACH2){
        //   machine.selected = false;
        //   machine.position = {x: 0, y: 0};
        //    machine.initialPosition = {x: 0, y: 0};
        // }     
      )
      .subscribe(result => {
        this.allmachines = result;
        console.log(this.allmachines); 
      });

    await this.http.get<DETMACH0[]>('assets/data/DETMACH0.json')
      .pipe(
        // filter((device: DETMACH0) => (device.MACHINE_DEV === 'EDG') )      
         )
      .subscribe(result => {
        console.log('devices', result); 
        this.devices = result
        // this.devices = result.filter((device: DETMACH0) => 
        //   device.MACHINE_DEV === 'GEN' );
        console.log(this.devices); 
      });

  }

  loadMachinesByDev(dev: string) {
    console.log('Loading machines for dev:', dev);
    this.machine_dev = dev;
    this.selmachines = this.allmachines.filter(machine => machine.MACHINE_DEV === dev);
    console.log('Filtered machines:', this.selmachines);  
  }

  mapClicked(event: MouseEvent) {
    console.log('Map clicked', event);
  }

  selectMachine(machine: any, event: MouseEvent) {
    event.stopPropagation();
    console.log('Machine selected', machine);
  }

  dragEnd(event: any, machine: any) {
    console.log('Drag ended for machine', machine, 'with event', event);
  }



// this is DRC's attempt to import an Excel file and convert it to JSON
// Function to convert the Excel file to JSON

 excelFilePath: string = 'public/assets/data/STATS.xlsx';
 
//excelFilePath: string = 'C:\\Users\\drc\\Desktop\\For Review\\Project Data\\Stats.xls';
 jsonFilePath: string = 'C:\\Projects\\labmonitor\\public\\assets\\data\Stats1.json';

 btnClicked(event: MouseEvent) {
    console.log('Btn clicked', event);
    

    this.convertExcelToJson(this.excelFilePath, this.jsonFilePath)
  }


convertExcelToJson(excelFilePath: string, jsonFilePath: string) {
  // Read the Excel file
  const workbook = XLSX.readFile(excelFilePath);

  // Get the first sheet (you can specify a different sheet if necessary)
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Write the JSON data to a file
  //fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');

console.log({jsonData});
console.log(jsonData);

  //console.log(`Data has been converted to JSON and saved to ${jsonFilePath}`);
}



}


// export class State {
//     DETMACH0s: DETMACH0[] = [];
//     DETMACH2s: DETMACH2[] = [];
//     DETMACH2 = new DETMACH2();
// }

export class DETMACH2 {
  MACHINE_ID!: string;
  MACHINE_DESC!: string;
  DEPT_CODE!: string;
  MACHINE_DEV!: string;
  MACHINE_TYPE!: string;
  selected!: boolean;
  position: any;
  initialPosition: any;
  machineImageUrl!: string;
  // machineTags: Array<string>;
  // machineStatus: string;
  // currentJobNo: string;
}

export class DETMACH0 {
  MACHINE_DEV!: string;
  MACHINE_DEV_DESC!: string;
  MACHINE_DEV_IMAGE!: string;
}



export interface Statistics {
  data: [],
  label: string
}

export class DETJOBM4 {
  JOB_NO!: string;
  STATUS_CODE!: string;
  INIT_OPER!: string;
  INIT_DATE!: Date;
  MACHINE_ID!: string;
}




// loadExcel() {
//   this.http.get('assets/report.xlsx', { responseType: 'arraybuffer' })
//     .subscribe(data => {
//       const workbook = XLSX.read(data, { type: 'array' });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet);
//       console.log(json);
//     });







