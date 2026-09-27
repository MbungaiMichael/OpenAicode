import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hospitals = [
  { name: "Apollo Hospitals, Delhi", city: "Delhi", state: "Delhi", address: "Sarita Vihar, Delhi", phone: "+91-11-0000-0001", specialties: ["Cardiology", "Orthopedics", "Oncology", "Neurology"], services: ["International desk", "Translator"], facilities: ["ICU", "Pharmacy", "Translator desk"] },
  { name: "Fortis Memorial, Gurugram", city: "Gurugram", state: "Haryana", address: "Sector 44, Gurugram", phone: "+91-12-0000-0002", specialties: ["Cardiology", "Nephrology", "Gastroenterology"], services: ["Visa assistance"], facilities: ["ICU", "Lab"] },
  { name: "Medanta The Medicity", city: "Gurugram", state: "Haryana", address: "Sector 38, Gurugram", phone: "+91-12-0000-0003", specialties: ["Cardiology", "Oncology", "Pediatrics"], services: ["Telemedicine"], facilities: ["ICU", "Pharmacy"] },
  { name: "Max Saket, Delhi", city: "Delhi", state: "Delhi", address: "Saket, Delhi", phone: "+91-11-0000-0004", specialties: ["Orthopedics", "IVF/Fertility"], services: ["International desk"], facilities: ["Lab", "Pharmacy"] },
  { name: "Kokilaben Hospital, Mumbai", city: "Mumbai", state: "Maharashtra", address: "Andheri West, Mumbai", phone: "+91-22-0000-0005", specialties: ["Neurology", "Oncology", "General Surgery"], services: ["Translator"], facilities: ["ICU", "Translator desk"] },
  { name: "Narayana Health, Bengaluru", city: "Bengaluru", state: "Karnataka", address: "Bommasandra, Bengaluru", phone: "+91-80-0000-0006", specialties: ["Cardiology", "Pediatrics"], services: ["Low-cost packages"], facilities: ["ICU", "Lab"] },
];

const treatments = [
  { title: "Knee Replacement", descriptionSimple: "Surgery to replace a damaged knee joint with an artificial one.", procedureSteps: ["Consultation and tests", "Surgery (2-3 hours)", "5-7 day recovery and physio"], avgStay: "5-7 days", risks: ["Infection", "Blood clots"] },
  { title: "Heart Bypass (CABG)", descriptionSimple: "Surgery to improve blood flow to the heart by bypassing blocked arteries.", procedureSteps: ["Angiography", "Surgery", "ICU + ward recovery"], avgStay: "7-10 days", risks: ["Bleeding", "Infection"] },
  { title: "IVF Cycle", descriptionSimple: "Fertility treatment combining eggs and sperm outside the body.", procedureSteps: ["Stimulation", "Egg retrieval", "Embryo transfer"], avgStay: "2-3 weeks (visits)", risks: ["Multiple pregnancy", "OHSS"] },
  { title: "Kidney Transplant Evaluation", descriptionSimple: "Tests to check if a kidney transplant is possible and safe.", procedureSteps: ["Donor matching", "Crossmatch tests", "Surgical review"], avgStay: "Varies", risks: ["Rejection", "Infection"] },
  { title: "Cataract Surgery", descriptionSimple: "Removal of cloudy lens and replacement with a clear artificial lens.", procedureSteps: ["Eye exam", "15-min procedure", "Same-day discharge"], avgStay: "1-2 days", risks: ["Infection", "Swelling"] },
  { title: "Spine Consultation Package", descriptionSimple: "MRI review and specialist opinion for back pain or disc issues.", procedureSteps: ["MRI review", "Specialist consult", "Physio plan"], avgStay: "2-4 days", risks: ["None major"] },
];

async function main() {
  for (const h of hospitals) {
    const exists = await prisma.hospital.findFirst({ where: { name: h.name } });
    if (!exists) {
      await prisma.hospital.create({
        data: { ...h, specialties: JSON.stringify(h.specialties), services: JSON.stringify(h.services), facilities: JSON.stringify(h.facilities) },
      });
    }
  }
  for (const t of treatments) {
    const exists = await prisma.treatment.findUnique({ where: { title: t.title } });
    if (!exists) {
      await prisma.treatment.create({
        data: { ...t, procedureSteps: JSON.stringify(t.procedureSteps), risks: JSON.stringify(t.risks) },
      });
    }
  }
  console.log("Seed complete: hospitals + treatments");
  const demos = [
    { name: "Demo Patient", email: "patient@demo.test", role: "patient" as const, country: "Kenya", language: "en" },
    { name: "Demo Coordinator", email: "coordinator@demo.test", role: "coordinator" as const, country: "India", language: "en" },
    { name: "Demo Admin", email: "admin@demo.test", role: "admin" as const, country: "India", language: "en" },
  ];
  const hash = await bcrypt.hash("demo1234", 10);
  for (const d of demos) {
    await prisma.user.upsert({
      where: { email: d.email },
      create: { ...d, passwordHash: hash },
      update: {},
    });
  }
  console.log("Seed complete: demo users patient/coordinator/admin (password demo1234)");
}

main().finally(() => prisma.$disconnect());
