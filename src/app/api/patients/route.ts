// src/app/api/patients/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/models/Patient';

export const dynamic = 'force-dynamic';

// --- GET Request ---
export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const dept = searchParams.get('dept');
    const filter = (dept && dept !== 'ALL') ? { department: dept } : {};
    
    const queue = await Patient.find(filter)
        .sort({ appointmentDate: 1, appointmentTime: 1, priority: 1 }) // Priority 0 is usually top
        .lean();

    const sanitizedQueue = queue.map(doc => ({
        ...doc,
        _id: doc._id.toString(), 
    }));

    return NextResponse.json(sanitizedQueue);
}

// --- POST Request ---
export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const body = await request.json();

        // 1. Generate IDs
        const autoToken = Math.floor(Math.random() * 999) + 1;
        const autoPatientId = `PID-${Date.now()}`;

        // 2. Fix Priority (Must be 0, 1, or 2)
        // Let's assume: 0 = Critical/Emergency, 1 = Urgent, 2 = Normal
        const priorityNumber = (body.priority === "Emergency") ? 0 : 2; 

        // 3. Fix Department (Must be RADIOLOGY, CARDIOLOGY, NEUROLOGY, OPD, or ENT)
        // We ensure it defaults to "OPD" if the input is invalid
        const validDepts = ['RADIOLOGY', 'CARDIOLOGY', 'NEUROLOGY', 'OPD', 'ENT'];
        let chosenDept = body.department ? body.department.toUpperCase() : "OPD";
        
        if (!validDepts.includes(chosenDept)) {
            chosenDept = "OPD"; // Fallback to safe value
        }

        const newPatient = await Patient.create({
            name: body.name,
            age: body.age,
            gender: body.gender,
            contact: body.contact,
            department: chosenDept, 
            problem: body.problem || "Checkup",
            priority: priorityNumber, 
            tokenNumber: autoToken,
            patientId: autoPatientId,
            appointmentDate: new Date().toISOString(), 
            appointmentTime: new Date().toLocaleTimeString()
        } as any); 

        return NextResponse.json(
            { message: "Patient Added", patient: newPatient },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error adding patient:", error);
        return NextResponse.json(
            { error: "Failed to add patient", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        // DANGER: This deletes EVERYTHING in the patients collection
        await Patient.deleteMany({}); 
        
        return NextResponse.json(
            { message: "All patients cleared successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to clear patients" },
            { status: 500 }
        );
    }
}