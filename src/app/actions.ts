'use server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';
import { IPatient } from '@/types/patient';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto'; // Correct Node.js import

export async function addPatient(formData: Omit<IPatient, 'patientId' | 'tokenNumber'>) {
    await dbConnect();
    // ... validation logic ...
    try {
        const autoId = `P-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const count = await Patient.countDocuments({ department: formData.department });
        await Patient.create({ ...formData, patientId: autoId, tokenNumber: count + 1 });
        revalidatePath('/');
        return { success: true };
    } catch (e) { return { error: "Registration failed." }; }
}

// FIX: Ensure these are exported for page.tsx
export async function updatePatient(id: string, updates: Partial<IPatient>) {
    await dbConnect();
    try {
        await Patient.findOneAndUpdate({ patientId: id }, updates);
        revalidatePath('/');
        return { success: true };
    } catch (e) { return { error: "Update failed." }; }
}

export async function deletePatient(id: string) {
    await dbConnect();
    try {
        await Patient.findOneAndDelete({ patientId: id });
        revalidatePath('/');
        return { success: true };
    } catch (e) { return { error: "Delete failed." }; }
}

export async function searchPatients(query: string) {
    await dbConnect();
    const results = await Patient.find({
        $or: [{ name: { $regex: query, $options: 'i' } }, { patientId: { $regex: query, $options: 'i' } }]
    }).limit(5).lean();
    return results.map(doc => ({ ...doc, _id: doc._id.toString() }));
}