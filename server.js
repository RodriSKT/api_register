const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 9002;
const DATA_DIR = path.join(__dirname, "data");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(APPOINTMENTS_FILE)) fs.writeFileSync(APPOINTMENTS_FILE, "[]");

const doctors = [
  {
    id: 1,
    name: "Dra. Ana Carolina Mendes",
    specialty: "Oftalmologia Geral",
    crm: "CRM-PI 12345",
    bio: "Atendimento clínico, acompanhamento preventivo e avaliação de doenças oculares.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80",
    availability: {
      "2026-08-21": ["08:00", "09:00", "10:30", "14:00", "15:30"],
      "2026-08-22": ["08:30", "10:00", "13:30"],
      "2026-08-24": ["09:00", "11:00", "14:30", "16:00"]
    }
  },
  {
    id: 2,
    name: "Dr. Rafael Oliveira",
    specialty: "Retina e Vítreo",
    crm: "CRM-PI 23456",
    bio: "Especialista em retina, vítreo e acompanhamento de alterações relacionadas ao diabetes.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=80",
    availability: {
      "2026-08-21": ["08:00", "11:00", "14:00", "16:30"],
      "2026-08-23": ["08:30", "09:30", "14:00"],
      "2026-08-25": ["10:00", "11:30", "15:00"]
    }
  },
  {
    id: 3,
    name: "Dra. Beatriz Santos",
    specialty: "Catarata",
    crm: "CRM-PI 34567",
    bio: "Avaliação e acompanhamento de catarata, indicação cirúrgica e pós-operatório.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=700&q=80",
    availability: {
      "2026-08-21": ["09:00", "10:00", "13:00", "15:00"],
      "2026-08-22": ["09:00", "11:00", "14:00"],
      "2026-08-26": ["08:00", "09:30", "13:30", "15:30"]
    }
  },
  {
    id: 4,
    name: "Dr. Lucas Ferreira",
    specialty: "Glaucoma",
    crm: "CRM-PI 45678",
    bio: "Diagnóstico, controle e acompanhamento de glaucoma e pressão intraocular.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80",
    availability: {
      "2026-08-22": ["08:00", "09:00", "10:30", "15:00"],
      "2026-08-24": ["08:30", "10:00", "13:00"],
      "2026-08-27": ["09:00", "11:00", "14:30"]
    }
  }
];

function readAppointments() {
  return JSON.parse(fs.readFileSync(APPOINTMENTS_FILE, "utf8"));
}

function saveAppointments(data) {
  fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/doctors", (req, res) => {
  const specialty = req.query.specialty;
  const result = specialty && specialty !== "Todos"
    ? doctors.filter(d => d.specialty === specialty)
    : doctors;
  res.json(result);
});

app.get("/api/specialties", (req, res) => {
  res.json([...new Set(doctors.map(d => d.specialty))]);
});

app.get("/api/doctors/:id/availability", (req, res) => {
  const doctor = doctors.find(d => d.id === Number(req.params.id));
  if (!doctor) return res.status(404).json({ error: "Médico não encontrado." });
  res.json(doctor.availability);
});

app.post("/api/appointments", (req, res) => {
  const { doctorId, date, time, patientName, phone, reason } = req.body;
  const doctor = doctors.find(d => d.id === Number(doctorId));

  if (!doctor) return res.status(400).json({ error: "Médico inválido." });
  if (!date || !time || !patientName || !phone) {
    return res.status(400).json({ error: "Preencha nome, telefone, data e horário." });
  }

  const available = doctor.availability[date] || [];
  if (!available.includes(time)) {
    return res.status(409).json({ error: "Esse horário não está disponível." });
  }

  const appointments = readAppointments();

  const alreadyBooked = appointments.some(
    a => Number(a.doctorId) === doctor.id && a.date === date && a.time === time
  );

  if (alreadyBooked) {
    return res.status(409).json({ error: "Esse horário acabou de ser reservado." });
  }

  const appointment = {
    id: Date.now(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    time,
    patientName,
    phone,
    reason: reason || "",
    createdAt: new Date().toISOString()
  };

  appointments.push(appointment);
  saveAppointments(appointments);

  res.status(201).json({
    message: "Agendamento solicitado com sucesso.",
    appointment
  });
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Hospital Oftalmologia rodando em http://localhost:${PORT}`);
});