export type Department = 'RADIOLOGY' | 'CARDIOLOGY' | 'NEUROLOGY' | 'OPD' | 'ENT';

export interface IPatient {
    _id?: string;
    name: string;
    patientId: string;    // Add this back
    contact: string;
    appointmentDate: string;
    appointmentTime: string;
    tokenNumber: number;  // Add this back
    priority: 0 | 1 | 2; 
    department: Department;
}