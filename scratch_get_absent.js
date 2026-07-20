const API_URL = "https://script.google.com/macros/s/AKfycbyh8VXMYvkUvs8z7p1f7vnpy4TcC8xPO8NXwkim9KChvFXTe8Esw5PWvwznS4LaGCoWvw/exec";

async function apiCall(action, payload = {}) {
  payload.action = action;
  const response = await fetch(API_URL, {
    method: 'POST',
    redirect: 'follow',
    body: JSON.stringify(payload)
  });
  const json = await response.json();
  if (json && json.success === true && json.data !== undefined) {
    return json.data;
  }
  return json;
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const [employees, rawLaporan] = await Promise.all([
    apiCall('getPegawaiListAdmin', {}),
    apiCall('getLaporanHarianAdmin', { tanggal: today })
  ]);
  
  // Day logs
  const dayLogs = rawLaporan.filter(r => r.waktu);
  
  const personStats = {};
  dayLogs.forEach(r => {
    if (!personStats[r.nama]) personStats[r.nama] = { unit: r.unit, masuk: null, pulang: null, status: '-', keterangan: '-' };
    if (r.jenis === 'Masuk') {
      if (personStats[r.nama].status === '-' || personStats[r.nama].status === 'Tidak Hadir') {
        personStats[r.nama].status = r.status || 'Hadir';
      }
    } else if (r.jenis === 'Pulang') {
      if ((r.status || '').toLowerCase() === 'pulang cepat') {
        personStats[r.nama].status = 'Pulang Cepat';
      }
    } else if (r.jenis === 'Izin') {
      personStats[r.nama].status = 'Izin';
    } else if (r.jenis === 'Sakit') {
      personStats[r.nama].status = 'Sakit';
    }
  });

  const tidakHadir = [];
  employees.forEach(e => {
    if (!personStats[e.nama]) {
      tidakHadir.push({ nama: e.nama, unit: e.unit, jabatan: e.jabatan });
    }
  });
  
  console.log(JSON.stringify(tidakHadir, null, 2));
  console.log("Total Tidak Hadir:", tidakHadir.length);
}

main().catch(console.error);
