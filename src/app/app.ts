import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, computed, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, httpResource } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { DevToolbarComponent, DevToolbarFeatureFlagService, DevToolbarToolComponent } from 'ngx-dev-toolbar';

// import { DETMACH2 } from './app.model';

import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, CdkDrag, DevToolbarComponent, DevToolbarToolComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, AfterViewInit {

  protected readonly title = signal('Lab Monitor');
  // private cd = inject(ChangeDetectorRef);
  
  selmachines: DETMACH2[] = [];
  machine_dev: string = '';
  selectedDETMACH2fc!: DETMACH2;
  showDetailsPane = false;
  selectedDev: string = '';

  windowConfig = {id: "id-1", title: "title-2", description: "this is the description"}
  // Devs:string[] = ['EDG', 'GEN', 'POL','TRC'];

  DEFLMON1: any;
  DETMACH2s_DEV: DETMACH2[] = [];
  allmachines: DETMACH2[] = []
  
  machines: DETMACH2[] = [
    // {
    //   MACHINE_ID: 'M001',
    //   MACHINE_DESC: 'Lathe Machine',
    //   DEPT_CODE: 'D01',
    //   MACHINE_DEV: 'GEN',
    //   MACHINE_TYPE: 'Lathe',
    //   selected: false,
    //   position: { x: 100, y: 100 },
    //   initialPosition: { x: 100, y: 100 },
    //   machineImageUrl: 'https://absapi.absolution1.com/mystaticfiles/generator.jpg',
    //   DETJOBM4sList: []
    // },
    // {
    //   MACHINE_ID: 'M002',
    //   MACHINE_DESC: 'Lathe Machine',
    //   DEPT_CODE: 'D01',
    //   MACHINE_DEV: 'POL',
    //   MACHINE_TYPE: 'Lathe',
    //   selected: false,
    //   position: { x: 200, y: 200 },
    //   initialPosition: { x: 200, y: 200 },
    //   machineImageUrl: 'https://absapi.absolution1.com/mystaticfiles/polisher.jpg',
    //   DETJOBM4sList: []

    // }
  ];

  

  DETMACH0_DEV: DETMACH0[] = [];
  devices: DETMACH0[] = []

  devicesResource = httpResource<DETMACH0[]>(() => 'assets/data/DETMACH0.json', { defaultValue: [] });
  devicesSignal = this.devicesResource.value;

    // filteredDevices: Signal<DETMACH0[]> = computed(() => {
  filteredDevices = computed(() => {
    // Use the standard JavaScript array filter method
    return this.devicesSignal().filter(device =>
             device.MACHINE_DEV === 'GEN' 
          || device.MACHINE_DEV === 'EDG' 
          || device.MACHINE_DEV === 'POL' 
          || device.MACHINE_DEV === 'TRC'
    );
  });

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
  
  private featureFlagsService = inject(DevToolbarFeatureFlagService);

constructor(private http: HttpClient) { //, cdr: ChangeDetectorRef) {
 
   // Set available feature flags
    this.featureFlagsService.setAvailableOptions([
      { id: 'darkMode', name: 'Dark Mode', isEnabled: true, isForced: true },
      { id: 'betaFeatures', name: 'Beta Features', isEnabled: true, isForced: true },
      { id: 'experimentalUI', name: 'Experimental UI', isEnabled: true, isForced: true },
    ]);

        // Get all flags with overrides applied
    this.featureFlagsService.getValues().pipe(
      map(flags => flags.find(f => f.id === 'darkMode')),
      map(flag => flag?.isEnabled ?? false)
    ).subscribe(isDarkMode => {
      if (isDarkMode) {
        // Apply dark mode logic
      }
    });

let today = new Date();
console.log('formatted date', today, this.formatDate(today));

}

  async ngAfterViewInit() {
    // await this.readJsonFile();
    console.log('before')
    this.readJsonFile();
    console.log('after')
  }

  

  iSTAT: number = -1
  signalRService_DETJOBM4s$!: BehaviorSubject<DETJOBM4[]>
  inProcess: boolean = false;
  iLoop: number = 0;

  formatDate(dateIn: Date) {
  let yyyy:number = dateIn.getFullYear();
  let MM:number = dateIn.getMonth() + 1; // getMonth() is zero-based
  let dd:number = dateIn.getDate();
  let HH:number = dateIn.getHours();
  let mm:number = dateIn.getMinutes();
  let ss:number = dateIn.getSeconds();
  return String(this.formatNumPad(yyyy,4,'0') 
              + this.formatNumPad(MM,2,'0') 
              + this.formatNumPad(dd,2,'0') 
              + this.formatNumPad(HH,2,'0') 
              + this.formatNumPad(mm,2,'0') 
              + this.formatNumPad(ss,2,'0')
            )
}

formatNumPad(n:number, padLen:number, padChar: string): string {
  let pfx: string = '0000000000'
  let val: string = pfx + n.toFixed(0).toString()
  
  let start: number = val.length - padLen
  let xxx: string = val.substring(start,start+padLen)
  // console.log({n, padLen, padChar, pfx,val,start,xxx})
  return xxx
}

  ngOnInit() {
    // console.log('before')
    // this.readJsonFile();
    // console.log('after')

    // this.signalRService_DETJOBM4s$! = new BehaviorSubject([])
    
    this.signalRService_DETJOBM4s$ = new BehaviorSubject<DETJOBM4[]>([])

    setInterval(() => {
      
      // if this.inProcess = true then exit this routine

      // if (this.inProcess === false) {
      // if (!this.inProcess) {
      if (this.inProcess) {
        // do nothing
      } else {

        this.inProcess = true;
        this.iLoop++

        // this block gets the next 10 array elements from this.stats
        // let start:number = this.iSTAT+1
        // this.iSTAT +=10
        // let finish:number = this.iSTAT
        // let Ds:DETJOBM4[] = []
        // for (let i = start; i < finish; i++) {
        //   Ds.push(this.stats[i])
        // }

        // this block gets the array elements from this.stats
        // from the last index used +1, to the array element whose INIT_DATE <= now
        let start:number = this.iSTAT+1;
        let Ds:DETJOBM4[] = [];
        let finish: string = this.formatDate(new Date())
        
        // yyyyMMddHHmmss
        // 20260109135952
        // 01234567890123
        // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_substring2

        let dx: string = "nothing found"
        let n:number = 0

        for (let i = start; i < start + 10000; i++) {
          let d:Date = new Date(this.stats[i].INIT_DATE)
          dx = this.formatDate(d).substring(8)

          // console.log({d}, this.stats[i].INIT_DATE)
          if (dx > finish.substring(8)) {break;}

          this.iSTAT++
          n++

          if (dx > '080000') {
            console.log(dx)
            Ds.push(this.stats[i])
            console.log({Ds})
            this.signalRService_DETJOBM4s$.next(Ds)
          } else {
            // log something so that we know we are running
            // console.log(dx, this.iSTAT, this.iLoop)
          }
        }
        console.log({finish, HHMMSS:dx, iSTAT: this.iSTAT, iLoop: this.iLoop, records:n})
        this.inProcess = false;
      }

      }, 2000)
    
    // this.signalRService.DETJOBM4s$.subscribe(
    this.signalRService_DETJOBM4s$.subscribe(
      (DETJOBM4s: DETJOBM4[]) => {
        console.log(DETJOBM4s);

        const keyed_machines = this.mapByKey(this.machines, 'MACHINE_ID');
        let isec = -1;
        let tsec = 0;
        for (const DETJOBM4x of DETJOBM4s) {
          // const MACHINE_ID = "EDG019" // DETJOBM4x.MACHINE_ID;
          const MACHINE_ID = DETJOBM4x.MACHINE_ID;
          if (keyed_machines[MACHINE_ID]) {
            const dt = new Date(DETJOBM4x['INIT_DATE']);

            keyed_machines[MACHINE_ID]['DETJOBM4sList'] = keyed_machines[MACHINE_ID]['DETJOBM4sList'] || [];
            keyed_machines[MACHINE_ID]['DETJOBM4sList'].push({...DETJOBM4x});
// keyed_machines[MACHINE_ID]['DETJOBM4sList'] = [...keyed_machines[MACHINE_ID]['DETJOBM4sList'], DETJOBM4x]
// keyed_machines[MACHINE_ID] = {...keyed_machines[MACHINE_ID]}
            if (MACHINE_ID === "EDG019") {
              console.error({MACHINE_ID})
            }

            if (isec === -1) {isec = dt.getSeconds(); }
            tsec = dt.getSeconds() - isec;
            // setTimeout(() => this.selectMachine(keyed_machines[MACHINE_ID], null), tsec * 1000);
            
            if (keyed_machines[MACHINE_ID].selected()) {
              // keyed_machines[MACHINE_ID].selected = false
              keyed_machines[MACHINE_ID].selected.set(false)
              // // this.cd.markForCheck(); 
              // this.cd.detectChanges();
            }
            
            this.selectMachine(keyed_machines[MACHINE_ID], null)
            console.log(DETJOBM4x.MACHINE_ID, tsec);
          }
        }
      }
    );

  }
  
  readJsonFile() {
    console.log('1 started STATS')
    this.http.get<DETJOBM4[]>('assets/data/STATS.json')
      .pipe(
        // Map the array of objects to an array of strings (e.g., the 'name' property)
        // map(data => data.map(item => item.name)) 
      )
      .subscribe(result => {
        console.log('1 completed STATS')
        this.stats = result;
        console.log(this.stats); 
      });
     
                  // this.cd.detectChanges();

    console.log('2 started DETMACH2_HAW')
    this.http.get<DETMACH2[]>('assets/data/DETMACH2_HAW.json')
      .pipe(
        // map(machine:DETMACH2){
        //   machine.selected = false;
        //   machine.position = {x: 0, y: 0};
        //    machine.initialPosition = {x: 0, y: 0};
        // }     
      )
      .subscribe(result => {
        console.log('2 completed DETMACH2_HAW')        
        this.allmachines = result;
        console.log(this.allmachines); 

        // this.allmachines.forEach(x => {
        //   if (x.MACHINE_ID === "EDG023" || x.MACHINE_ID === "GEN010") {
        //          this.machines.push (x);
        //   }
        // });
      });

                  // this.cd.detectChanges();

    console.log('3 started DETMACH0')
    this.http.get<DETMACH0[]>('assets/data/DETMACH0.json')
      .pipe(
        // filter((device: DETMACH0) => (device.MACHINE_DEV === 'GEN'))
         map((arr: DETMACH0[]) => 
          (arr.filter(device => device.MACHINE_DEV === 'GEN'
          || device.MACHINE_DEV === 'EDG'
         )))     
         )
      .subscribe(result => {
        console.log('3 completed DETMACH0')
        console.log('devices', result); 
        // this.devices = result
        this.devices = result.filter((device: DETMACH0) => 
          device.MACHINE_DEV === 'GEN' 
          || device.MACHINE_DEV === 'EDG' 
          || device.MACHINE_DEV === 'POL' 
          || device.MACHINE_DEV === 'TRC' );
        console.log(this.devices); 
      });
            // this.cd.detectChanges();
  }

  onChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    console.log (selectElement.value)
    let m = this.selmachines.filter(x => x.MACHINE_ID === selectElement.value )
    // this needs to be refactored using a map object
    console.log (m)
    if (m) {
      // this.selectedDETMACH2fc = m[0]
      this.set_selectedDETMACH2fc(m[0])
    }
    // this.selectedDETMACH2fc = selectElement.value;
  }

  set_selectedDETMACH2fc(m:DETMACH2) {
     this.selectedDETMACH2fc = m
  }
  loadMachinesByDev(dev: string) {
    console.log('Loading machines for dev:', dev);
    this.machine_dev = dev;
    this.selmachines = this.allmachines.filter(machine => machine.MACHINE_DEV === dev);
    console.log('Filtered machines:', this.selmachines);  

    // need to get the value currently loaded in the select and call set_selectedDETMACH2fc
    let m:DETMACH2 = this.selmachines[0]
    this.set_selectedDETMACH2fc(m)
  }

  mapClicked(event: MouseEvent) {
    console.log('Map clicked', event);
    this.machines.forEach(x => {x.selected.set(false); });
    this.showDetailsPane = false;
  }
  
  pingMachine(mIndex:number, event:any) {
    // this.machines[mIndex].selected = true;
    // setTimeout(() => {this.machines[mIndex].selected = false;},3000)
    this.selectMachine(this.machines[mIndex], event)
  }

  removeSelected() {
    this.machines.forEach(x => { x.selected.set(false); });
  }

  selectMachine(selectedMachine: DETMACH2, event:any) {

    if (event) {
      event.stopPropagation();
    }

    console.log('this is the newly selected machine ->', selectedMachine);
    // this.machines.forEach(x => { x.selected = false; });

    if (selectedMachine.selected()) {
      // selectedMachine.selected = false;
           this.machines.forEach(x => { x.selected.set(false); });
    } else {
      // selectedMachine.selected = true;
      // // setTimeout(() => selectedMachine.selected = true, 0); // nec because we are using anglar to create the ping
      // this.selectedDETMACH2 = selectedMachine;
      // this.showDetailsPane = true;
      // this.cd.detectChanges
    }

      selectedMachine.selected.set(true);
      // setTimeout(() => selectedMachine.selected = true, 0); // nec because we are using anglar to create the ping
      this.selectedDETMACH2 = selectedMachine;
      this.showDetailsPane = true;

      setTimeout(() => {selectedMachine.selected.set(false)}, 3000)
      // this.cd.detectChanges
  }

  dragEnd(event: any, machine: any) {
    console.log('Drag ended for machine', machine, 'with event', event);
  }

  // array2Dictionary(a:any[], p:any) {
  //   const k = {};
  //   for (const x of a) {
  //     const key = x[p];
  //     if (!k[key]) {
  //         k[key] = [];
  //       }
  //     k[key].push(x);
  //   }

  //   return k;
  // }

  mapByKey<T extends Item>(array: T[], key: keyof T): Item<T> {
    return array.reduce((map, item) => ({...map, [item[key]]: item}), {});
  }

  groupByKey<T extends Item>(array: T[], key: keyof T): ItemGroup<T> {
    return array.reduce<ItemGroup<T>>((map, item) => {
      const itemKey = item[key];
      if (map[itemKey]) {
        map[itemKey].push(item);
      } else {
        map[itemKey] = [item];
      }
      return map;
    }, {});
  }
 







  
  addMachine() {
    // if (this.selectedDETMACH2fc.value) {
    //   const machineToAdd = this.selectedDETMACH2fc.value;
    if (this.selectedDETMACH2fc) {
      const machineToAdd = this.selectedDETMACH2fc;
      // const existingMachineArray = this.machines.find(x => x.MACHINE_ID === machineToAdd.MACHINE_ID);
      // console.log('keyed array', this.array2Dictionary(this.machines, 'MACHINE_ID'));

      // const machineDictionary = this.array2Dictionary(this.machines, 'MACHINE_ID');
      // const existingMachineArray = machineDictionary[machineToAdd.MACHINE_ID];
      // const existingMachine = existingMachineArray ? existingMachineArray[0] : undefined; // this is the best way
      // // const existingMachine = existingMachineArray ? Object.assign(existingMachineArray[0]) : undefined; // works
      // // const existingMachine = existingMachineArray ? Object.assign({}, existingMachineArray[0]) : undefined; // does not work
      // // const existingMachine = existingMachineArray ? {...existingMachineArray[0]} : undefined; // does not work
      // if (existingMachine) {
      //   // existingMachine.MACHINE_DESC = 'hijacked';
      // }

let n:number = 1

console.log('n before: ',{n})

console.log('machines (before):', this.machines)

console.log('destructured: ', {...this.selectedDETMACH2fc, anotherProperty: 'xxx'})
console.log('this.selectedDETMACH2fc',this.selectedDETMACH2fc)
let m:DETMACH2 = {...this.selectedDETMACH2fc, 
  // selected: false, 
  // selected: WritableSignal<boolean> = signal(false),
  selected: signal(false),
  position: { x: 300, y: 300 },
  initialPosition: { x: 300, y: 300 },
  machineImageUrl: 'https://absapi.absolution1.com/mystaticfiles/MACHINE_DEV/' + this.selectedDETMACH2fc.MACHINE_DEV + '.jpg'
}

console.log(m)
console.log({m})

this.machines.push(m)

n+=1
console.log('n after: ',{n})

this.machines[0].MACHINE_ID = "m001"
console.log('machines (after):', this.machines)

// the next block of code is important to understand and to get to work
      // const existingMachine = this.mapByKey(this.machines, 'MACHINE_ID')[machineToAdd.MACHINE_ID];
      // if ( existingMachine ) {
      //   console.log(existingMachine);
      //   this.showSnackBar('Machine has already been added', 'Show Me', () => {this.selectMachine(existingMachine); });
      // } else {
      //   this.addMachine2Machines(machineToAdd, this.selectedDETMACH0fc.value.MACHINE_DEV_IMAGE);
      // }
    }
  }

  addAllMachines() {
    // // for (const machineToAdd of this.dst['DETMACH2s']) {
    // //   if (['GEN', 'TRC', 'POL', 'EDG'].includes(machineToAdd.MACHINE_DEV)) {
    // //     this.addMachine2Machines(machineToAdd);
    // //   }
    // // }

    // for (const DETMACH0 of this.dst['DETMACH0s']) {
    //   if (['GEN', 'TRC', 'POL', 'EDG'].includes(DETMACH0.MACHINE_DEV)) {
    //     for (const machineToAdd of this.dst['DETMACH2s'].filter(x => x.MACHINE_DEV === DETMACH0.MACHINE_DEV)) {
    //       this.addMachine2Machines(machineToAdd, DETMACH0.MACHINE_DEV_IMAGE);
    //     }
    //   }
    // }

  }

  addMachine2Machines(machineToAdd: DETMACH2, MACHINE_DEV_IMAGE: string) {
    // const initialPosition = { x: 0, y: 0 };

    // const machine = {
    //   MACHINE_ID: machineToAdd.MACHINE_ID,
    //   MACHINE_DESC: machineToAdd.MACHINE_DESC,
    //   DEPT_CODE: '',
    //   MACHINE_DEV: machineToAdd.MACHINE_DEV,
    //   MACHINE_TYPE: machineToAdd.MACHINE_TYPE,
    //   selected: false,
    //   position: { ...initialPosition },
    //   initialPosition: { ...initialPosition },
    //   machineImageUrl: environment.urlBaseImages + MACHINE_DEV_IMAGE,
    //   // machineTags: ['tag 1', 'tag 2'],
    //   // machineStatus: 'A',
    //   // currentJobNo: ''
    // };
    // this.machines.push(machine);
    // // console.log(this.machines);
  }




// this is DRC's attempt to import an Excel file and convert it to JSON
// Function to convert the Excel file to JSON

 excelFilePath: string = 'public/assets/data/STATS.xlsx';
 
//excelFilePath: string = 'C:\\Users\\drc\\Desktop\\For Review\\Project Data\\Stats.xls';
 jsonFilePath: string = 'C:\\Projects\\labmonitor\\public\\assets\\data\Stats1.json';

 btnClicked(event: MouseEvent) {
    console.log('Btn clicked', event);
    

    //this.convertExcelToJson(this.excelFilePath, this.jsonFilePath)
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



export interface Item<T = any> {
  [key: string]: T;
}

export interface ItemGroup<T> {
  [key: string]: T[];
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
  // selected!: boolean;
  selected: WritableSignal<boolean> = signal(false)
  position: any;
  initialPosition: any;
  machineImageUrl!: string;
  // machineTags: Array<string>;
  // machineStatus: string;
  // currentJobNo: string;
  DETJOBM4sList: DETJOBM4[] = [];
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
