/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Analytics Reports
 * Keterlambatan, Ketidakhadiran, Izin, Sakit, Performa,
 * Perbandingan Unit/Bulan/Tahun, Eksekutif, Dashboard Yayasan
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

// ═══ SHARED ═══
const _anlHelpers = {
  checkUnitMatch(dataUnit, filter) {
    if (!filter || filter === 'all') return true;
    const dUnit = (dataUnit || '').toLowerCase().trim();
    const fUnit = filter.toLowerCase().trim();
    if (fUnit === 'sd integral hidayatullah') {
      return dUnit === 'sd integral hidayatullah' || dUnit === 'sd integral hidayatullah 2';
    }
    if (fUnit === 'tk islam qurrata ayun & tpa') {
      return dUnit.includes('qurrata') || dUnit.includes('yaa bunayya');
    }
    return dUnit === fUnit;
  },
  back: '<button onclick="window.router.navigateTo(\'reports\')" class="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-4 group no-print"><i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Kembali ke Pusat Laporan</button>',
  unitOpts: '<option value="all">Semua Unit</option><option>SD Integral Hidayatullah</option><option>MTS-MA Putra</option><option>MTS-MA Putri</option><option>TK Islam Qurrata Ayun & TPA</option><option>STIT HISAM</option>',
  tipeOpts: '<option value="all">Semua Tipe</option><option value="Guru">Guru</option><option value="Karyawan">Karyawan</option>',
  checkTipeMatch(jabatan, filter) {
    if (filter === 'all') return true;
    const isGuru = (jabatan || '').toLowerCase().includes('guru');
    if (filter === 'Guru') return isGuru;
    if (filter === 'Karyawan') return !isGuru;
    return true;
  },
  dateDefaults() {
    const now = new Date();
    const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const first = today.substring(0, 8) + '01';
    return { today, first };
  },
  filterBar(prefix) {
    const d = this.dateDefaults();
    return `<div class="glass-card p-5 no-print"><div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Dari</label><input type="date" id="${prefix}-start" class="hrms-input text-sm" value="${d.first}"></div>
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Sampai</label><input type="date" id="${prefix}-end" class="hrms-input text-sm" value="${d.today}"></div>
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label><select id="${prefix}-unit" class="hrms-input hrms-select text-sm">${this.unitOpts}</select></div>
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tipe Pegawai</label><select id="${prefix}-type" class="hrms-input hrms-select text-sm">${this.tipeOpts}</select></div>
      <div class="flex items-end"><button onclick="window.pages.generate_${prefix}()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate</button></div>
    </div><button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button></div>`;
  },
  async fetchData(prefix) {
    const adminEmail = window.auth.currentUser.email;
    const startVal = document.getElementById(`${prefix}-start`).value;
    const endVal = document.getElementById(`${prefix}-end`).value;
    const filterUnit = document.getElementById(`${prefix}-unit`).value;
    const filterTipe = document.getElementById(`${prefix}-type`) ? document.getElementById(`${prefix}-type`).value : 'all';
    const [employees, rawLaporan] = await Promise.all([
      window.api.getPegawaiListAdmin(adminEmail),
      window.api.getLaporanRentangAdmin(startVal, endVal)
    ]);
    const filteredEmps = employees.filter(e => this.checkUnitMatch(e.unit, filterUnit) && this.checkTipeMatch(e.jabatan, filterTipe));
    const logs = rawLaporan.filter(r => {
      if (!r.waktu) return false;
      if (!this.checkUnitMatch(r.unit, filterUnit)) return false;
      const emp = employees.find(e => e.nama === r.nama);
      const jabatan = emp ? emp.jabatan : '';
      if (!this.checkTipeMatch(jabatan, filterTipe)) return false;
      return true;
    });
    return { employees: filteredEmps, logs, startVal, endVal, filterUnit, filterTipe, allLaporan: rawLaporan, allEmployees: employees };
  }
};

// ═══════════════════════════════════════════════════════════
// 1. LAPORAN KETERLAMBATAN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportLate = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#EF4444] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Keterlambatan</h1>
    <p class="text-sm text-white/40 mt-1">Analisis pola dan distribusi keterlambatan</p></div></div>
    ${_anlHelpers.filterBar('late')}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="late-summary"></div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="chart-container"><div class="chart-title">Keterlambatan Per Hari</div><div style="height:220px;"><canvas id="late-chart-day"></canvas></div></div>
      <div class="chart-container"><div class="chart-title">Distribusi Jam Terlambat</div><div style="height:220px;"><canvas id="late-chart-hour"></canvas></div></div>
    </div>
    <div><div class="section-header"><div class="section-icon bg-[#EF4444]/15 border border-[#EF4444]/20 text-[#EF4444]"><i data-lucide="alarm-clock" class="w-5 h-5"></i></div>
      <div><div class="section-title">Pegawai Sering Terlambat</div><div class="section-subtitle">Diurutkan dari yang paling sering</div></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto" style="max-height:400px;">
      <table class="hrms-table"><thead><tr><th>#</th><th>Nama</th><th>Unit</th><th>Jumlah Terlambat</th><th>Rata-rata Jam Masuk</th></tr></thead>
      <tbody id="late-table-body"><tr><td colspan="5" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div></div>`;
};

window.pages.initReportLate = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._lateCharts = {};

  window.pages.generate_late = async function() {
    window.ui.showLoading('Menganalisis keterlambatan...');
    try {
      const { logs } = await _anlHelpers.fetchData('late');
      const hariNama = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const lateByDay = [0,0,0,0,0,0,0];
      const lateByHour = {};
      const personLate = {};

      logs.filter(r => (r.jenis === 'Masuk' && r.status === 'Terlambat') || (r.jenis === 'Pulang' && (r.status || '').toLowerCase() === 'pulang cepat')).forEach(r => {
        const parts = String(r.waktu).split(/[- T:]/);
        if (parts.length >= 3) {
          const d = parts[0].length === 4 ? new Date(parts[0], parts[1]-1, parts[2]) : new Date(parts[2], parts[1]-1, parts[0]);
          if (!isNaN(d.getTime())) lateByDay[d.getDay()]++;
        }
        const timeParts = String(r.waktu).split(' ');
        if (timeParts[1]) {
          const hour = timeParts[1].split(':')[0];
          lateByHour[hour] = (lateByHour[hour] || 0) + 1;
        }
        if (!personLate[r.nama]) personLate[r.nama] = { unit: r.unit, count: 0, times: [] };
        personLate[r.nama].count++;
        if (timeParts[1]) personLate[r.nama].times.push(timeParts[1]);
      });

      const totalLate = lateByDay.reduce((a, b) => a + b, 0);
      const worstDay = lateByDay.indexOf(Math.max(...lateByDay));

      // Summary
      document.getElementById('late-summary').innerHTML = [
        { label:'Total Terlambat', value: totalLate, color:'#EF4444' },
        { label:'Hari Terburuk', value: hariNama[worstDay], color:'#F59E0B' },
        { label:'Pegawai Terlambat', value: Object.keys(personLate).length, color:'#3B82F6' },
        { label:'Rata-rata/Hari', value: (totalLate / 7).toFixed(1), color:'#8B5CF6' },
      ].map(c => `<div class="stat-card"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="clock" class="w-4 h-4" style="color:${c.color}"></i></div></div><div class="stat-label">${c.label}</div><div class="stat-value text-xl">${c.value}</div></div>`).join('');

      // Charts
      Object.values(window.pages._lateCharts).forEach(c => c.destroy());
      const dayCtx = document.getElementById('late-chart-day');
      if (dayCtx) {
        window.pages._lateCharts.day = new Chart(dayCtx, {
          type: 'bar', data: { labels: hariNama, datasets: [{ data: lateByDay, backgroundColor: lateByDay.map((v, i) => i === worstDay ? 'rgba(239,68,68,0.6)' : 'rgba(245,158,11,0.4)'), borderColor: lateByDay.map((v, i) => i === worstDay ? '#EF4444' : '#F59E0B'), borderWidth: 1.5, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' } } }, plugins: { legend: { display: false } } }
        });
      }
      const hourCtx = document.getElementById('late-chart-hour');
      if (hourCtx) {
        const hours = Object.keys(lateByHour).sort();
        window.pages._lateCharts.hour = new Chart(hourCtx, {
          type: 'bar', data: { labels: hours.map(h => h + ':00'), datasets: [{ data: hours.map(h => lateByHour[h]), backgroundColor: 'rgba(239,68,68,0.4)', borderColor: '#EF4444', borderWidth: 1.5, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' } } }, plugins: { legend: { display: false } } }
        });
      }

      // Table
      const sorted = Object.keys(personLate).map(n => ({ nama: n, ...personLate[n] })).sort((a, b) => b.count - a.count);
      document.getElementById('late-table-body').innerHTML = sorted.length === 0
        ? '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Tidak ada keterlambatan</td></tr>'
        : sorted.map((e, i) => {
            const avgTime = e.times.length > 0 ? e.times[Math.floor(e.times.length / 2)] : '-';
            return `<tr><td class="text-xs text-white/30">${i+1}</td><td><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-[#EF4444]/20 flex items-center justify-center text-[#F87171] text-[10px] font-bold">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td><td class="text-xs text-white/50">${e.unit}</td><td><span class="badge badge-danger">${e.count}x</span></td><td class="text-xs text-white/40">${avgTime}</td></tr>`;
          }).join('');

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Analisis keterlambatan selesai!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 2. LAPORAN KETIDAKHADIRAN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportAbsent = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#DC2626] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Ketidakhadiran</h1>
    <p class="text-sm text-white/40 mt-1">Pegawai yang sering tidak masuk kerja</p></div></div>
    ${_anlHelpers.filterBar('absent')}
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3" id="absent-summary"></div>
    <div><div class="section-header"><div class="section-icon bg-[#DC2626]/15 border border-[#DC2626]/20 text-[#DC2626]"><i data-lucide="user-x" class="w-5 h-5"></i></div>
      <div><div class="section-title">Daftar Ketidakhadiran</div><div class="section-subtitle">Pegawai dengan tingkat absensi tinggi</div></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto" style="max-height:400px;">
      <table class="hrms-table"><thead><tr><th>#</th><th>Nama</th><th>Unit</th><th>Hadir</th><th>Tidak Hadir</th><th>% Kehadiran</th></tr></thead>
      <tbody id="absent-table-body"><tr><td colspan="6" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div></div>`;
};
window.pages.initReportAbsent = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages.generate_absent = async function() {
    window.ui.showLoading('Menganalisis ketidakhadiran...');
    try {
      const { employees, logs } = await _anlHelpers.fetchData('absent');
      const uniqueDates = new Set(); const personHadir = {};
      logs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; uniqueDates.add(dp); if (r.jenis === 'Masuk') { personHadir[r.nama] = (personHadir[r.nama] || 0) + 1; } });
      const hariKerja = uniqueDates.size || 22;
      const absentList = employees.map(e => {
        const hadir = personHadir[e.nama] || 0; const absen = Math.max(0, hariKerja - hadir); const pct = Math.round((hadir / hariKerja) * 100);
        return { nama: e.nama, unit: e.unit, hadir, absen, pct };
      }).sort((a, b) => b.absen - a.absen);
      const totalAbsen = absentList.reduce((s, e) => s + e.absen, 0);
      const perluPerhatian = absentList.filter(e => e.absen > 3).length;
      document.getElementById('absent-summary').innerHTML = [
        { label:'Hari Kerja', value: hariKerja, color:'#8B5CF6' },
        { label:'Total Ketidakhadiran', value: totalAbsen, color:'#EF4444' },
        { label:'Perlu Perhatian', value: perluPerhatian, color:'#F59E0B' },
      ].map(c => `<div class="stat-card"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="user-x" class="w-4 h-4" style="color:${c.color}"></i></div></div><div class="stat-label">${c.label}</div><div class="stat-value text-xl">${c.value}</div></div>`).join('');
      document.getElementById('absent-table-body').innerHTML = absentList.map((e, i) => `<tr><td class="text-xs text-white/30">${i+1}</td><td><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-[#EF4444]/20 flex items-center justify-center text-[#F87171] text-[10px] font-bold">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td><td class="text-xs text-white/50">${e.unit}</td><td><span class="badge badge-success">${e.hadir}</span></td><td><span class="${e.absen > 0 ? 'badge badge-danger' : 'text-xs text-white/30'}">${e.absen}</span></td><td><span class="text-xs font-bold ${e.pct >= 90 ? 'text-[#4ADE80]' : e.pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${e.pct}%</span></td></tr>`).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Analisis selesai!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 3. LAPORAN IZIN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportPermission = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#F59E0B] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Izin</h1>
    <p class="text-sm text-white/40 mt-1">Rekap pengajuan izin per periode</p></div></div>
    ${_anlHelpers.filterBar('perm')}
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3" id="perm-summary"></div>
    <div><div class="section-header"><div class="section-icon bg-[#F59E0B]/15 border border-[#F59E0B]/20 text-[#F59E0B]"><i data-lucide="clipboard-list" class="w-5 h-5"></i></div>
      <div><div class="section-title">Daftar Izin</div><div class="section-subtitle">Rekap izin per pegawai</div></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto" style="max-height:400px;">
      <table class="hrms-table"><thead><tr><th>#</th><th>Nama</th><th>Unit</th><th>Jumlah Izin</th><th>Keterangan Terakhir</th></tr></thead>
      <tbody id="perm-table-body"><tr><td colspan="5" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div></div>`;
};
window.pages.initReportPermission = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages.generate_perm = async function() {
    window.ui.showLoading('Memuat data izin...');
    try {
      const { logs } = await _anlHelpers.fetchData('perm');
      const izinLogs = logs.filter(r => r.jenis === 'Izin' || r.status === 'Izin');
      const personIzin = {};
      izinLogs.forEach(r => { if (!personIzin[r.nama]) personIzin[r.nama] = { unit: r.unit, count: 0, lastKet: '-' }; personIzin[r.nama].count++; personIzin[r.nama].lastKet = r.keterangan || '-'; });
      const sorted = Object.keys(personIzin).map(n => ({ nama: n, ...personIzin[n] })).sort((a, b) => b.count - a.count);
      document.getElementById('perm-summary').innerHTML = [
        { label:'Total Izin', value: izinLogs.length, color:'#F59E0B' },
        { label:'Pegawai Izin', value: sorted.length, color:'#3B82F6' },
        { label:'Rata-rata/Orang', value: sorted.length > 0 ? (izinLogs.length / sorted.length).toFixed(1) : 0, color:'#8B5CF6' },
      ].map(c => `<div class="stat-card"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="clipboard-list" class="w-4 h-4" style="color:${c.color}"></i></div></div><div class="stat-label">${c.label}</div><div class="stat-value text-xl">${c.value}</div></div>`).join('');
      document.getElementById('perm-table-body').innerHTML = sorted.length === 0
        ? '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Tidak ada data izin</td></tr>'
        : sorted.map((e, i) => `<tr><td class="text-xs text-white/30">${i+1}</td><td><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#FBBF24] text-[10px] font-bold">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td><td class="text-xs text-white/50">${e.unit}</td><td><span class="badge badge-warning">${e.count}x</span></td><td class="text-xs text-white/40 max-w-[200px] truncate">${e.lastKet}</td></tr>`).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Data izin berhasil dimuat!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 4. LAPORAN SAKIT
// ═══════════════════════════════════════════════════════════
window.pages.renderReportSick = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#06B6D4] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Sakit</h1>
    <p class="text-sm text-white/40 mt-1">Rekap absen sakit per periode</p></div></div>
    ${_anlHelpers.filterBar('sick')}
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3" id="sick-summary"></div>
    <div><div class="section-header"><div class="section-icon bg-[#06B6D4]/15 border border-[#06B6D4]/20 text-[#06B6D4]"><i data-lucide="heart-pulse" class="w-5 h-5"></i></div>
      <div><div class="section-title">Daftar Sakit</div><div class="section-subtitle">Rekap sakit per pegawai</div></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto" style="max-height:400px;">
      <table class="hrms-table"><thead><tr><th>#</th><th>Nama</th><th>Unit</th><th>Jumlah Sakit</th><th>Keterangan Terakhir</th></tr></thead>
      <tbody id="sick-table-body"><tr><td colspan="5" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div></div>`;
};
window.pages.initReportSick = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages.generate_sick = async function() {
    window.ui.showLoading('Memuat data sakit...');
    try {
      const { logs } = await _anlHelpers.fetchData('sick');
      const sakitLogs = logs.filter(r => r.jenis === 'Sakit' || r.status === 'Sakit');
      const personSakit = {};
      sakitLogs.forEach(r => { if (!personSakit[r.nama]) personSakit[r.nama] = { unit: r.unit, count: 0, lastKet: '-' }; personSakit[r.nama].count++; personSakit[r.nama].lastKet = r.keterangan || '-'; });
      const sorted = Object.keys(personSakit).map(n => ({ nama: n, ...personSakit[n] })).sort((a, b) => b.count - a.count);
      document.getElementById('sick-summary').innerHTML = [
        { label:'Total Sakit', value: sakitLogs.length, color:'#06B6D4' },
        { label:'Pegawai Sakit', value: sorted.length, color:'#3B82F6' },
        { label:'Rata-rata/Orang', value: sorted.length > 0 ? (sakitLogs.length / sorted.length).toFixed(1) : 0, color:'#8B5CF6' },
      ].map(c => `<div class="stat-card"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="heart-pulse" class="w-4 h-4" style="color:${c.color}"></i></div></div><div class="stat-label">${c.label}</div><div class="stat-value text-xl">${c.value}</div></div>`).join('');
      document.getElementById('sick-table-body').innerHTML = sorted.length === 0
        ? '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Tidak ada data sakit</td></tr>'
        : sorted.map((e, i) => `<tr><td class="text-xs text-white/30">${i+1}</td><td><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-[#22D3EE] text-[10px] font-bold">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td><td class="text-xs text-white/50">${e.unit}</td><td><span class="badge" style="background:rgba(6,182,212,0.15);color:#22D3EE;">${e.count}x</span></td><td class="text-xs text-white/40 max-w-[200px] truncate">${e.lastKet}</td></tr>`).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Data sakit berhasil dimuat!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 5. PERFORMA KEHADIRAN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportPerformance = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#22C55E] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Performa Kehadiran</h1>
    <p class="text-sm text-white/40 mt-1">Skor disiplin kehadiran per pegawai</p></div></div>
    ${_anlHelpers.filterBar('perf')}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="perf-summary"></div>
    <div class="chart-container"><div class="chart-title">Distribusi Skor</div><div style="height:220px;"><canvas id="perf-chart"></canvas></div></div>
    <div><div class="section-header"><div class="section-icon bg-[#22C55E]/15 border border-[#22C55E]/20 text-[#22C55E]"><i data-lucide="trending-up" class="w-5 h-5"></i></div>
      <div><div class="section-title">Skor Per Pegawai</div><div class="section-subtitle">Berdasarkan kehadiran & ketepatan waktu</div></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto" style="max-height:400px;">
      <table class="hrms-table"><thead><tr><th>#</th><th>Nama</th><th>Unit</th><th>Hadir</th><th>Tepat</th><th>Skor</th><th>Grade</th></tr></thead>
      <tbody id="perf-table-body"><tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div></div>`;
};
window.pages.initReportPerformance = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._perfChart = null;
  window.pages.generate_perf = async function() {
    window.ui.showLoading('Menghitung performa...');
    try {
      const { employees, logs } = await _anlHelpers.fetchData('perf');
      const uniqueDates = new Set(); const stats = {};
      logs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; uniqueDates.add(dp); if (r.jenis === 'Masuk') { if (!stats[r.nama]) stats[r.nama] = { unit: r.unit, hadir: 0, tepat: 0 }; stats[r.nama].hadir++; if (r.status === 'Tepat Waktu') stats[r.nama].tepat++; } });
      const hariKerja = uniqueDates.size || 22;
      const perfList = employees.map(e => {
        const s = stats[e.nama] || { hadir: 0, tepat: 0 }; const skor = hariKerja > 0 ? Math.round((s.hadir / hariKerja) * 50 + (s.hadir > 0 ? (s.tepat / s.hadir) * 50 : 0)) : 0;
        let grade = 'A'; if (skor < 60) grade = 'D'; else if (skor < 70) grade = 'C'; else if (skor < 80) grade = 'B'; else if (skor < 90) grade = 'A-';
        return { nama: e.nama, unit: e.unit, hadir: s.hadir, tepat: s.tepat, skor, grade };
      }).sort((a, b) => b.skor - a.skor);
      const avgSkor = perfList.length > 0 ? Math.round(perfList.reduce((s, e) => s + e.skor, 0) / perfList.length) : 0;
      const gradeA = perfList.filter(e => e.grade.startsWith('A')).length;
      const gradeB = perfList.filter(e => e.grade === 'B').length;
      const gradeCD = perfList.filter(e => e.grade === 'C' || e.grade === 'D').length;
      document.getElementById('perf-summary').innerHTML = [
        { label:'Rata-rata Skor', value: avgSkor, color:'#22C55E' },
        { label:'Grade A', value: gradeA, color:'#14B88A' },
        { label:'Grade B', value: gradeB, color:'#F59E0B' },
        { label:'Grade C/D', value: gradeCD, color:'#EF4444' },
      ].map(c => `<div class="stat-card"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="award" class="w-4 h-4" style="color:${c.color}"></i></div></div><div class="stat-label">${c.label}</div><div class="stat-value text-xl">${c.value}</div></div>`).join('');

      if (window.pages._perfChart) window.pages._perfChart.destroy();
      const ctx = document.getElementById('perf-chart');
      if (ctx) {
        window.pages._perfChart = new Chart(ctx, {
          type: 'doughnut', data: { labels: ['A/A-', 'B', 'C/D'], datasets: [{ data: [gradeA, gradeB, gradeCD], backgroundColor: ['rgba(20,184,138,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)'], borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } } } }
        });
      }
      document.getElementById('perf-table-body').innerHTML = perfList.map((e, i) => `<tr><td class="text-xs text-white/30">${i+1}</td><td><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-white text-[10px] font-bold">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td><td class="text-xs text-white/50">${e.unit}</td><td><span class="badge badge-success">${e.hadir}</span></td><td class="text-xs font-bold text-[#4ADE80]">${e.tepat}</td><td class="text-sm font-black text-white">${e.skor}</td><td><span class="text-sm font-black ${e.grade.startsWith('A') ? 'text-[#22C55E]' : e.grade === 'B' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}">${e.grade}</span></td></tr>`).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Performa dihitung!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 6. PERBANDINGAN UNIT
// ═══════════════════════════════════════════════════════════
window.pages.renderReportCompareUnit = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#8B5CF6] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Perbandingan Unit</h1>
    <p class="text-sm text-white/40 mt-1">Bandingkan performa kehadiran antar unit sekolah</p></div></div>
    ${_anlHelpers.filterBar('cunit')}
    <div class="chart-container"><div class="chart-title">Perbandingan % Kehadiran Per Unit</div><div style="height:280px;"><canvas id="cunit-chart"></canvas></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto">
      <table class="hrms-table"><thead><tr><th>Unit</th><th>Pegawai</th><th>Hadir</th><th>Terlambat</th><th>Absen</th><th>% Kehadiran</th><th>Skor</th></tr></thead>
      <tbody id="cunit-table-body"><tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div>`;
};
window.pages.initReportCompareUnit = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._cunitChart = null;
  window.pages.generate_cunit = async function() {
    window.ui.showLoading('Membandingkan unit...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const startVal = document.getElementById('cunit-start').value;
      const endVal = document.getElementById('cunit-end').value;
      const [employees, rawLaporan] = await Promise.all([window.api.getPegawaiListAdmin(adminEmail), window.api.getLaporanRentangAdmin(startVal, endVal)]);
      const logs = rawLaporan.filter(r => { if (!r.waktu) return false; const dp = String(r.waktu).split(' ')[0]; return dp >= startVal && dp <= endVal; });
      const uniqueDates = new Set(); logs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; uniqueDates.add(dp); });
      const hariKerja = uniqueDates.size || 22;
      const unitMap = {};
      employees.forEach(e => { if (!unitMap[e.unit]) unitMap[e.unit] = { count: 0, hadir: 0, lambat: 0 }; unitMap[e.unit].count++; });
      logs.forEach(r => { if (!unitMap[r.unit]) unitMap[r.unit] = { count: 0, hadir: 0, lambat: 0 }; if (r.jenis === 'Masuk') { unitMap[r.unit].hadir++; if (r.status === 'Terlambat') unitMap[r.unit].lambat++; } });
      const units = Object.keys(unitMap).map(u => { const s = unitMap[u]; const possible = s.count * hariKerja; const pct = possible > 0 ? Math.round((s.hadir / possible) * 100) : 0; const absen = Math.max(0, possible - s.hadir); let skor = 'A'; if (pct < 75) skor = 'C'; else if (pct < 85) skor = 'B'; else if (pct < 90) skor = 'B+'; else if (pct < 95) skor = 'A-'; return { unit: u, ...s, pct, absen, skor }; }).sort((a, b) => b.pct - a.pct);

      if (window.pages._cunitChart) window.pages._cunitChart.destroy();
      const ctx = document.getElementById('cunit-chart');
      if (ctx) {
        window.pages._cunitChart = new Chart(ctx, {
          type: 'bar', data: { labels: units.map(u => u.unit.length > 20 ? u.unit.substring(0, 18) + '...' : u.unit), datasets: [{ label: '% Kehadiran', data: units.map(u => u.pct), backgroundColor: units.map(u => u.pct >= 90 ? 'rgba(20,184,138,0.5)' : u.pct >= 75 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'), borderColor: units.map(u => u.pct >= 90 ? '#14B88A' : u.pct >= 75 ? '#F59E0B' : '#EF4444'), borderWidth: 1.5, borderRadius: 6 }] },
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { callback: v => v + '%' } }, y: { grid: { display: false }, ticks: { font: { size: 10 } } } }, plugins: { legend: { display: false } } }
        });
      }
      document.getElementById('cunit-table-body').innerHTML = units.map(u => `<tr><td class="font-semibold text-white text-xs">${u.unit}</td><td class="text-xs">${u.count}</td><td><span class="badge badge-success">${u.hadir}</span></td><td><span class="${u.lambat > 0 ? 'badge badge-warning' : 'text-xs text-white/30'}">${u.lambat}</span></td><td><span class="${u.absen > 0 ? 'badge badge-danger' : 'text-xs text-white/30'}">${u.absen}</span></td><td><div class="flex items-center gap-2"><div class="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[80px]"><div class="h-full rounded-full ${u.pct >= 90 ? 'bg-[#14B88A]' : u.pct >= 75 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}" style="width:${u.pct}%"></div></div><span class="text-xs font-bold ${u.pct >= 90 ? 'text-[#4ADE80]' : u.pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${u.pct}%</span></div></td><td><span class="text-sm font-black ${u.skor.startsWith('A') ? 'text-[#22C55E]' : u.skor.startsWith('B') ? 'text-[#F59E0B]' : 'text-[#EF4444]'}">${u.skor}</span></td></tr>`).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Perbandingan unit selesai!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 7. PERBANDINGAN BULAN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportCompareMonth = function() {
  const now = new Date(); const y = now.getFullYear(); const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#3B82F6] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Perbandingan Bulan</h1>
    <p class="text-sm text-white/40 mt-1">Tren kehadiran antar bulan</p></div></div>
    <div class="glass-card p-5 no-print"><div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tahun</label><select id="cmonth-year" class="hrms-input hrms-select text-sm">${[y, y-1].map(yr => `<option value="${yr}">${yr}</option>`).join('')}</select></div>
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label><select id="cmonth-unit" class="hrms-input hrms-select text-sm">${_anlHelpers.unitOpts}</select></div>
      <div class="flex items-end"><button onclick="window.pages.generateCompareMonth()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate</button></div>
    </div><button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button></div>
    <div class="chart-container"><div class="chart-title">Tren Kehadiran Antar Bulan</div><div style="height:260px;"><canvas id="cmonth-chart"></canvas></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto">
      <table class="hrms-table"><thead><tr><th>Bulan</th><th>Hadir</th><th>Terlambat</th><th>% Kehadiran</th><th>vs Bulan Lalu</th></tr></thead>
      <tbody id="cmonth-table-body"><tr><td colspan="5" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div>`;
};
window.pages.initReportCompareMonth = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._cmonthChart = null;
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  window.pages.generateCompareMonth = async function() {
    window.ui.showLoading('Membandingkan bulan...');
    try {
      const adminEmail = window.auth.currentUser.email; const year = parseInt(document.getElementById('cmonth-year').value); const filterUnit = document.getElementById('cmonth-unit').value;
      const fetchStart = `${year}-01-01`; const fetchEnd = `${year}-12-31`;
      const [employees, rawLaporan] = await Promise.all([window.api.getPegawaiListAdmin(adminEmail), window.api.getLaporanRentangAdmin(fetchStart, fetchEnd)]);
      const filteredEmps = employees.filter(e => _anlHelpers.checkUnitMatch(e.unit, filterUnit));
      const yearLogs = rawLaporan.filter(r => { if (!r.waktu) return false; const dp = String(r.waktu).split(' ')[0]; const p = dp.split('-'); return (p[0].length === 4 ? parseInt(p[0]) : parseInt(p[2])) === year && _anlHelpers.checkUnitMatch(r.unit, filterUnit); });
      const monthly = Array.from({ length: 12 }, () => ({ hadir: 0, lambat: 0, dates: new Set() }));
      yearLogs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; const p = dp.split('-'); const mi = parseInt(p[1]) - 1; if (mi < 0 || mi > 11) return; monthly[mi].dates.add(dp); if (r.jenis === 'Masuk') { monthly[mi].hadir++; if (r.status === 'Terlambat') monthly[mi].lambat++; } });
      const pctArr = monthly.map(m => { const hk = m.dates.size || 0; const pos = filteredEmps.length * hk; return pos > 0 ? Math.round((m.hadir / pos) * 100) : 0; });

      if (window.pages._cmonthChart) window.pages._cmonthChart.destroy();
      const ctx = document.getElementById('cmonth-chart');
      if (ctx) {
        window.pages._cmonthChart = new Chart(ctx, {
          type: 'line', data: { labels: monthNames.map(m => m.substring(0, 3)), datasets: [{ label: '% Kehadiran', data: pctArr, borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.08)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 4, pointHoverRadius: 7 }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { callback: v => v + '%' } } }, plugins: { legend: { display: false } } }
        });
      }
      document.getElementById('cmonth-table-body').innerHTML = monthly.map((m, i) => {
        const pct = pctArr[i]; const prevPct = i > 0 ? pctArr[i - 1] : pct; const diff = pct - prevPct;
        const diffStr = diff > 0 ? `<span class="text-[#4ADE80] font-bold">+${diff}%</span>` : diff < 0 ? `<span class="text-[#F87171] font-bold">${diff}%</span>` : '<span class="text-white/30">0%</span>';
        return m.dates.size === 0 ? '' : `<tr><td class="text-xs font-semibold text-white">${monthNames[i]}</td><td><span class="badge badge-success">${m.hadir}</span></td><td><span class="${m.lambat > 0 ? 'badge badge-warning' : 'text-xs text-white/30'}">${m.lambat}</span></td><td><span class="text-xs font-bold ${pct >= 90 ? 'text-[#4ADE80]' : pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${pct}%</span></td><td class="text-xs">${diffStr}</td></tr>`;
      }).join('') || '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Tidak ada data</td></tr>';
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Perbandingan bulan selesai!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 8. PERBANDINGAN TAHUN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportCompareYear = function() {
  const y = new Date().getFullYear();
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Perbandingan Tahun</h1>
    <p class="text-sm text-white/40 mt-1">Tren kehadiran antar tahun</p></div></div>
    <div class="glass-card p-5 no-print"><div class="grid grid-cols-2 gap-3 mb-4">
      <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label><select id="cyear-unit" class="hrms-input hrms-select text-sm">${_anlHelpers.unitOpts}</select></div>
      <div class="flex items-end"><button onclick="window.pages.generateCompareYear()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate</button></div>
    </div><button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button></div>
    <div class="chart-container"><div class="chart-title">Kehadiran Per Tahun</div><div style="height:260px;"><canvas id="cyear-chart"></canvas></div></div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto">
      <table class="hrms-table"><thead><tr><th>Tahun</th><th>Total Hadir</th><th>Total Terlambat</th><th>Hari Kerja</th><th>Catatan</th></tr></thead>
      <tbody id="cyear-table-body"><tr><td colspan="5" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div>`;
};
window.pages.initReportCompareYear = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._cyearChart = null;
  window.pages.generateCompareYear = async function() {
    window.ui.showLoading('Membandingkan tahun...');
    try {
      const adminEmail = window.auth.currentUser.email; const filterUnit = document.getElementById('cyear-unit').value;
      const now = new Date(); const fetchStart = `${now.getFullYear()-4}-01-01`; const fetchEnd = `${now.getFullYear()}-12-31`;
      const [employees, rawLaporan] = await Promise.all([window.api.getPegawaiListAdmin(adminEmail), window.api.getLaporanRentangAdmin(fetchStart, fetchEnd)]);
      const filteredLogs = rawLaporan.filter(r => r.waktu && _anlHelpers.checkUnitMatch(r.unit, filterUnit));
      const yearStats = {};
      filteredLogs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; const p = dp.split('-'); const yr = p[0].length === 4 ? p[0] : p[2]; if (!yearStats[yr]) yearStats[yr] = { hadir: 0, lambat: 0, dates: new Set() }; yearStats[yr].dates.add(dp); if (r.jenis === 'Masuk') { yearStats[yr].hadir++; if (r.status === 'Terlambat') yearStats[yr].lambat++; } });
      const years = Object.keys(yearStats).sort();
      if (window.pages._cyearChart) window.pages._cyearChart.destroy();
      const ctx = document.getElementById('cyear-chart');
      if (ctx) {
        window.pages._cyearChart = new Chart(ctx, {
          type: 'bar', data: { labels: years, datasets: [{ label: 'Hadir', data: years.map(y => yearStats[y].hadir), backgroundColor: 'rgba(20,184,138,0.5)', borderColor: '#14B88A', borderWidth: 1.5, borderRadius: 6 }, { label: 'Terlambat', data: years.map(y => yearStats[y].lambat), backgroundColor: 'rgba(245,158,11,0.5)', borderColor: '#F59E0B', borderWidth: 1.5, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' } } }, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } } } }
        });
      }
      document.getElementById('cyear-table-body').innerHTML = years.length === 0
        ? '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Tidak ada data</td></tr>'
        : years.map(y => `<tr><td class="text-sm font-bold text-white">${y}</td><td><span class="badge badge-success">${yearStats[y].hadir}</span></td><td><span class="badge badge-warning">${yearStats[y].lambat}</span></td><td class="text-xs">${yearStats[y].dates.size} hari</td><td class="text-xs text-white/40">-</td></tr>`).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Perbandingan tahun selesai!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 9. LAPORAN EKSEKUTIF
// ═══════════════════════════════════════════════════════════
window.pages.renderReportExecutive = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#1E293B] uppercase mb-1" style="color:#94A3B8">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Eksekutif</h1>
    <p class="text-sm text-white/40 mt-1">Ringkasan eksekutif untuk pimpinan</p></div></div>
    ${_anlHelpers.filterBar('exec')}
    <div id="exec-content"><div class="text-center py-10 text-white/30 text-xs">Klik "Generate" untuk membuat laporan eksekutif</div></div></div>`;
};
window.pages.initReportExecutive = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages.generate_exec = async function() {
    window.ui.showLoading('Menyusun laporan eksekutif...');
    try {
      const { employees, logs } = await _anlHelpers.fetchData('exec');
      const uniqueDates = new Set(); let hadir = 0, lambat = 0, izin = 0, sakit = 0;
      logs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; uniqueDates.add(dp); if (r.jenis === 'Masuk') { hadir++; if (r.status === 'Terlambat') lambat++; } else if (r.jenis === 'Izin') izin++; else if (r.jenis === 'Sakit') sakit++; });
      const hk = uniqueDates.size || 22; const total = employees.length * hk; const pct = total > 0 ? Math.round((hadir / total) * 100) : 0; const absen = Math.max(0, total - hadir - izin - sakit);
      let grade = 'A (Sangat Baik)'; let gradeColor = '#22C55E';
      if (pct < 75) { grade = 'C (Kurang)'; gradeColor = '#EF4444'; } else if (pct < 90) { grade = 'B (Baik)'; gradeColor = '#F59E0B'; }

      document.getElementById('exec-content').innerHTML = `
        <div class="glass-card p-6 border border-white/[0.08]">
          <div class="text-center mb-6"><div class="text-sm font-bold text-[#14B88A] uppercase tracking-widest mb-1">Laporan Eksekutif</div>
            <div class="text-2xl font-extrabold text-white">YAYASAN PONDOK PESANTREN HIDAYATULLAH</div>
            <div class="text-xs text-white/40 mt-1">Samarinda, Kalimantan Timur</div></div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            ${[{l:'Pegawai',v:employees.length,c:'#3B82F6'},{l:'Hari Kerja',v:hk,c:'#8B5CF6'},{l:'Kehadiran',v:pct+'%',c:'#14B88A'},{l:'Terlambat',v:lambat,c:'#F59E0B'},{l:'Tidak Hadir',v:absen,c:'#EF4444'}].map(c => `<div class="text-center p-3 rounded-xl" style="background:${c.c}10;"><div class="text-lg font-black" style="color:${c.c}">${c.v}</div><div class="text-[9px] font-bold text-white/30 uppercase">${c.l}</div></div>`).join('')}
          </div>
          <div class="glass-card p-4 mb-4" style="background:${gradeColor}08; border-color:${gradeColor}20;">
            <div class="flex items-center gap-3"><i data-lucide="award" class="w-8 h-8" style="color:${gradeColor}"></i>
              <div><div class="text-xs text-white/40">Penilaian Keseluruhan</div><div class="text-xl font-black" style="color:${gradeColor}">${grade}</div></div></div>
          </div>
          <div class="space-y-2">
            <div class="flex items-start gap-2 p-3 bg-[#14B88A]/10 rounded-xl"><span>📊</span><div class="text-xs text-white/60">Kehadiran rata-rata berada di angka <strong class="text-white">${pct}%</strong> dengan ${employees.length} pegawai aktif selama ${hk} hari kerja.</div></div>
            <div class="flex items-start gap-2 p-3 bg-[#F59E0B]/10 rounded-xl"><span>⏰</span><div class="text-xs text-white/60">Tercatat <strong class="text-white">${lambat}</strong> kasus keterlambatan. ${lambat > 10 ? 'Perlu perhatian.' : 'Masih dalam batas wajar.'}</div></div>
            <div class="flex items-start gap-2 p-3 bg-[#3B82F6]/10 rounded-xl"><span>📋</span><div class="text-xs text-white/60">Total izin: <strong class="text-white">${izin}</strong>, sakit: <strong class="text-white">${sakit}</strong>.</div></div>
          </div>
        </div>`;
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Laporan eksekutif siap!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};

// ═══════════════════════════════════════════════════════════
// 10. DASHBOARD YAYASAN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportFoundation = function() {
  return `<div class="space-y-6 pb-10 animate-fade-in-up"><div class="mb-2">${_anlHelpers.back}
    <div><p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Laporan & Analitik</p>
    <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Dashboard Yayasan</h1>
    <p class="text-sm text-white/40 mt-1">Overview kehadiran seluruh yayasan</p></div></div>
    ${_anlHelpers.filterBar('found')}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="found-summary"></div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="chart-container"><div class="chart-title">Kehadiran Per Unit</div><div style="height:280px;"><canvas id="found-chart-unit"></canvas></div></div>
      <div class="chart-container"><div class="chart-title">Distribusi Status</div><div style="height:280px;"><canvas id="found-chart-status"></canvas></div></div>
    </div>
    <div class="glass-card p-0 overflow-hidden"><div class="overflow-x-auto">
      <table class="hrms-table"><thead><tr><th>Unit</th><th>Total Pegawai</th><th>Hadir</th><th>Terlambat</th><th>Izin</th><th>Sakit</th><th>% Kehadiran</th></tr></thead>
      <tbody id="found-table-body"><tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Klik "Generate"</td></tr></tbody></table>
    </div></div></div>`;
};
window.pages.initReportFoundation = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._foundCharts = {};
  window.pages.generate_found = async function() {
    window.ui.showLoading('Memuat dashboard yayasan...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const startVal = document.getElementById('found-start').value; const endVal = document.getElementById('found-end').value;
      const [employees, rawLaporan] = await Promise.all([window.api.getPegawaiListAdmin(adminEmail), window.api.getLaporanRentangAdmin(startVal, endVal)]);
      const logs = rawLaporan.filter(r => { if (!r.waktu) return false; const dp = String(r.waktu).split(' ')[0]; return dp >= startVal && dp <= endVal; });
      const uniqueDates = new Set(); let totalH = 0, totalL = 0, totalI = 0, totalS = 0;
      const unitMap = {};
      employees.forEach(e => { if (!unitMap[e.unit]) unitMap[e.unit] = { count: 0, hadir: 0, lambat: 0, izin: 0, sakit: 0 }; unitMap[e.unit].count++; });
      logs.forEach(r => { const dp = String(r.waktu).split(' ')[0]; uniqueDates.add(dp); if (!unitMap[r.unit]) unitMap[r.unit] = { count: 0, hadir: 0, lambat: 0, izin: 0, sakit: 0 };
        if (r.jenis === 'Masuk') { totalH++; unitMap[r.unit].hadir++; if (r.status === 'Terlambat') { totalL++; unitMap[r.unit].lambat++; } }
        else if (r.jenis === 'Izin') { totalI++; unitMap[r.unit].izin++; }
        else if (r.jenis === 'Sakit') { totalS++; unitMap[r.unit].sakit++; }
      });
      const hk = uniqueDates.size || 22; const total = employees.length * hk; const pct = total > 0 ? Math.round((totalH / total) * 100) : 0;
      document.getElementById('found-summary').innerHTML = [
        { label:'Total Pegawai', value: employees.length, color:'#3B82F6' },
        { label:'% Kehadiran', value: pct + '%', color:'#14B88A' },
        { label:'Total Terlambat', value: totalL, color:'#F59E0B' },
        { label:'Unit Sekolah', value: Object.keys(unitMap).length, color:'#8B5CF6' },
      ].map(c => `<div class="stat-card"><div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="building" class="w-4 h-4" style="color:${c.color}"></i></div></div><div class="stat-label">${c.label}</div><div class="stat-value text-xl">${c.value}</div></div>`).join('');

      const units = Object.keys(unitMap);
      Object.values(window.pages._foundCharts).forEach(c => c.destroy());
      const unitCtx = document.getElementById('found-chart-unit');
      if (unitCtx) {
        const colors = ['#14B88A','#3B82F6','#8B5CF6','#F59E0B','#EC4899','#EF4444','#06B6D4'];
        window.pages._foundCharts.unit = new Chart(unitCtx, {
          type: 'bar', data: { labels: units.map(u => u.length > 15 ? u.substring(0, 13) + '...' : u), datasets: [{ label: 'Hadir', data: units.map(u => unitMap[u].hadir), backgroundColor: units.map((_, i) => colors[i % colors.length] + '80'), borderColor: units.map((_, i) => colors[i % colors.length]), borderWidth: 1.5, borderRadius: 6 }] },
          options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false }, ticks: { font: { size: 9 } } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' } } }, plugins: { legend: { display: false } } }
        });
      }
      const statusCtx = document.getElementById('found-chart-status');
      if (statusCtx) {
        window.pages._foundCharts.status = new Chart(statusCtx, {
          type: 'doughnut', data: { labels: ['Hadir', 'Terlambat', 'Izin', 'Sakit'], datasets: [{ data: [totalH - totalL, totalL, totalI, totalS], backgroundColor: ['rgba(20,184,138,0.7)','rgba(245,158,11,0.7)','rgba(59,130,246,0.7)','rgba(6,182,212,0.7)'], borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } } } }
        });
      }
      document.getElementById('found-table-body').innerHTML = units.map(u => { const s = unitMap[u]; const pos = s.count * hk; const upct = pos > 0 ? Math.round((s.hadir / pos) * 100) : 0;
        return `<tr><td class="font-semibold text-white text-xs">${u}</td><td class="text-xs">${s.count}</td><td><span class="badge badge-success">${s.hadir}</span></td><td><span class="${s.lambat > 0 ? 'badge badge-warning' : 'text-xs text-white/30'}">${s.lambat}</span></td><td class="text-xs">${s.izin}</td><td class="text-xs">${s.sakit}</td><td><span class="text-xs font-bold ${upct >= 90 ? 'text-[#4ADE80]' : upct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${upct}%</span></td></tr>`;
      }).join('');
      if (window.lucide) window.lucide.createIcons(); window.ui.hideLoading(); window.ui.showToast('✅', 'Dashboard yayasan dimuat!', true);
    } catch (err) { console.error(err); window.ui.hideLoading(); window.ui.showToast('⚠️', 'Gagal', false); }
  };
};
