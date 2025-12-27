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

