import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPatient } from '../types/patient';

export interface IPatientModel extends Omit<IPatient, '_id'>, Document {}

const PatientSchema: Schema = new Schema({
    name: { type: String, required: true },
    patientId: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    tokenNumber: { type: Number, required: true },
    priority: { type: Number, enum: [0, 1, 2], default: 0 },
    department: { 
        type: String, 
        enum: ['RADIOLOGY', 'CARDIOLOGY', 'NEUROLOGY', 'OPD', 'ENT'], 
        required: true 
    }
});

const Patient: Model<IPatientModel> = mongoose.models.Patient || mongoose.model<IPatientModel>('Patient', PatientSchema);
export default Patient;