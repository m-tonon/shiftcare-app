import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🏥 ShiftCare — Riverside Medical Clinic');
  console.log('─────────────────────────────────────────');
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
