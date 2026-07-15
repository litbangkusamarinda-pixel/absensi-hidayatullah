/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Personnel Reports
 * Riwayat Karyawan, Riwayat Guru, Pegawai Terdisiplin, Perlu Perhatian
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

// ═══════════════════════════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════════════════════════
const _personnelHelpers = {
  checkUnitMatch(dataUnit, filter) {
    if (filter === 'all') return true;
    if (filter === 'SD Integral Hidayatullah') return dataUnit === 'SD Integral Hidayatullah' || dataUnit === 'SD Integral Hidayatullah 2';
    if (filter === 'TK Islam Qurrata Ayun & TPA') return dataUnit === "TK Islam Qurrata 'Ayun" || dataUnit === "TPA YAA BUNAYYA -PAGI" || dataUnit === "TPA YAA BUNAYYA - SIANG";
    return dataUnit === filter;
  },
  backButton: '<button onclick="window.router.navigateTo(\'reports\')" class="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-4 group no-print"><i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Kembali ke Pusat Laporan</button>',
  unitFilter: `<select id="rpt-pers-unit" class="hrms-input hrms-select text-sm"><option value="all">Semua Unit</option><option>SD Integral Hidayatullah</option><option>MTS-MA Putra</option><option>MTS-MA Putri</option><option>TK Islam Qurrata Ayun & TPA</option><option>STIT HISAM</option></select>`,
  statusBadge(s) {
    const sl = (s || '').toLowerCase();
    if (sl === 'tepat waktu' || sl === 'hadir') return `<span class="badge badge-success">${s}</span>`;
    if (sl === 'terlambat') return `<span class="badge badge-warning">${s}</span>`;
    if (sl === 'izin') return `<span class="badge" style="background:rgba(59,130,246,0.15);color:#60A5FA;">${s}</span>`;
    if (sl === 'sakit') return `<span class="badge" style="background:rgba(6,182,212,0.15);color:#22D3EE;">${s}</span>`;
    if (sl === 'pulang cepat') return `<span class="badge badge-warning">${s}</span>`;
    return `<span class="text-xs text-white/40">${s || '-'}</span>`;
  }
};

// ═══════════════════════════════════════════════════════════
// 1. RIWAYAT KARYAWAN
// ═══════════════════════════════════════════════════════════
window.pages.renderReportEmpHistory = function() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div class="mb-2">
        ${_personnelHelpers.backButton}
        <div>
          <p class="text-xs font-bold tracking-widest text-[#F59E0B] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Riwayat Karyawan</h1>
          <p class="text-sm text-white/40 mt-1">Detail riwayat absensi per individu karyawan</p>
        </div>
      </div>

      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Pilih Karyawan</label>
            <select id="pers-emp-select" class="hrms-input hrms-select text-sm"><option value="">-- Pilih --</option></select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            ${_personnelHelpers.unitFilter}
          </div>
          <div class="flex items-end">
            <button onclick="window.pages.generateEmpHistory()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Tampilkan</button>
          </div>
        </div>
        <button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button>
      </div>

      <!-- Profile Card -->
      <div id="pers-emp-profile" class="hidden">
        <div class="glass-card p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white text-xl font-black" id="pers-emp-avatar">?</div>
            <div>
              <div class="text-lg font-extrabold text-white" id="pers-emp-name">-</div>
              <div class="text-xs text-white/40" id="pers-emp-unit">-</div>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="pers-emp-stats"></div>
        </div>
      </div>

      <!-- History Table -->
      <div id="pers-emp-history-section" class="hidden">
        <div class="section-header">
          <div class="section-icon bg-[#F59E0B]/15 border border-[#F59E0B]/20 text-[#F59E0B]"><i data-lucide="clock" class="w-5 h-5"></i></div>
          <div><div class="section-title">Riwayat Log Absensi</div><div class="section-subtitle">Semua catatan absensi karyawan ini</div></div>
        </div>
        <div class="glass-card p-0 overflow-hidden">
          <div class="overflow-x-auto" style="max-height:400px;">
            <table class="hrms-table"><thead><tr><th>#</th><th>Tanggal</th><th>Jam</th><th>Jenis</th><th>Status</th></tr></thead>
              <tbody id="pers-emp-log-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.pages.initReportEmpHistory = function() {
  if (window.lucide) window.lucide.createIcons();

  // Load employee list
  (async () => {
    try {
      const adminEmail = window.auth.currentUser.email;
      const employees = await window.api.getPegawaiListAdmin(adminEmail);
      window.pages._allEmployees = employees;
      const select = document.getElementById('pers-emp-select');
      if (select) {
        select.innerHTML = '<option value="">-- Pilih Karyawan --</option>' +
          employees.map(e => `<option value="${e.nama}">${e.nama} (${e.unit})</option>`).join('');
      }
    } catch(e) { console.error(e); }
  })();

  window.pages.generateEmpHistory = async function() {
    const nama = document.getElementById('pers-emp-select')?.value;
    if (!nama) { window.ui.showToast('⚠️', 'Pilih karyawan terlebih dahulu', false); return; }

    window.ui.showLoading('Memuat riwayat...');
    try {
      const rawLaporan = await window.api.getLaporanLengkapAdmin();
      const logs = rawLaporan.filter(r => r.nama === nama).sort((a, b) => {
        return String(b.waktu || '').localeCompare(String(a.waktu || ''));
      });

      // Stats
      let hadir = 0, terlambat = 0, izin = 0, sakit = 0;
      logs.forEach(r => {
        if (r.jenis === 'Masuk') { hadir++; if (r.status === 'Terlambat') terlambat++; }
        else if (r.jenis === 'Izin') izin++;
        else if (r.jenis === 'Sakit') sakit++;
      });

      const emp = (window.pages._allEmployees || []).find(e => e.nama === nama);
      document.getElementById('pers-emp-avatar').textContent = nama.charAt(0);
      document.getElementById('pers-emp-name').textContent = nama;
      document.getElementById('pers-emp-unit').textContent = emp ? emp.unit : '-';

      document.getElementById('pers-emp-stats').innerHTML = [
        { label:'Hadir', value: hadir, color:'#14B88A' },
        { label:'Terlambat', value: terlambat, color:'#F59E0B' },
        { label:'Izin', value: izin, color:'#3B82F6' },
        { label:'Sakit', value: sakit, color:'#06B6D4' },
      ].map(c => `
        <div class="text-center p-3 rounded-xl" style="background:${c.color}10;">
          <div class="text-lg font-black" style="color:${c.color}">${c.value}</div>
          <div class="text-[9px] font-bold text-white/30 uppercase">${c.label}</div>
        </div>
      `).join('');

      document.getElementById('pers-emp-profile').classList.remove('hidden');
      document.getElementById('pers-emp-history-section').classList.remove('hidden');

      const tbody = document.getElementById('pers-emp-log-body');
      tbody.innerHTML = logs.length === 0
        ? '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Belum ada riwayat</td></tr>'
        : logs.map((r, i) => {
            const parts = String(r.waktu || '').split(' ');
            return `<tr>
              <td class="text-xs text-white/30">${i + 1}</td>
              <td class="text-xs font-semibold text-white">${parts[0] || '-'}</td>
              <td class="text-xs text-white/50">${parts[1] || '-'}</td>
              <td class="text-xs text-white/50">${r.jenis || '-'}</td>
              <td>${_personnelHelpers.statusBadge(r.status)}</td>
            </tr>`;
          }).join('');

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Riwayat berhasil dimuat', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };
};

// ═══════════════════════════════════════════════════════════
// 2. RIWAYAT GURU (same as emp history but filtered for guru)
// ═══════════════════════════════════════════════════════════
window.pages.renderReportTeacherHistory = function() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div class="mb-2">
        ${_personnelHelpers.backButton}
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Riwayat Guru</h1>
          <p class="text-sm text-white/40 mt-1">Detail riwayat absensi per individu guru</p>
        </div>
      </div>

      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Pilih Guru</label>
            <select id="pers-guru-select" class="hrms-input hrms-select text-sm"><option value="">-- Pilih --</option></select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-guru-unit" class="hrms-input hrms-select text-sm"><option value="all">Semua Unit</option><option>SD Integral Hidayatullah</option><option>MTS-MA Putra</option><option>MTS-MA Putri</option><option>TK Islam Qurrata Ayun & TPA</option><option>STIT HISAM</option></select>
          </div>
          <div class="flex items-end">
            <button onclick="window.pages.generateGuruHistory()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Tampilkan</button>
          </div>
        </div>
        <button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button>
      </div>

      <div id="pers-guru-profile" class="hidden">
        <div class="glass-card p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#14B88A] to-[#0D9B73] flex items-center justify-center text-white text-xl font-black" id="pers-guru-avatar">?</div>
            <div>
              <div class="text-lg font-extrabold text-white" id="pers-guru-name">-</div>
              <div class="text-xs text-white/40" id="pers-guru-unit-label">-</div>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="pers-guru-stats"></div>
        </div>
      </div>

      <div id="pers-guru-history-section" class="hidden">
        <div class="section-header">
          <div class="section-icon bg-[#14B88A]/15 border border-[#14B88A]/20 text-[#14B88A]"><i data-lucide="clock" class="w-5 h-5"></i></div>
          <div><div class="section-title">Riwayat Log Absensi</div><div class="section-subtitle">Semua catatan absensi guru ini</div></div>
        </div>
        <div class="glass-card p-0 overflow-hidden">
          <div class="overflow-x-auto" style="max-height:400px;">
            <table class="hrms-table"><thead><tr><th>#</th><th>Tanggal</th><th>Jam</th><th>Jenis</th><th>Status</th></tr></thead>
              <tbody id="pers-guru-log-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.pages.initReportTeacherHistory = function() {
  if (window.lucide) window.lucide.createIcons();

  (async () => {
    try {
      const adminEmail = window.auth.currentUser.email;
      const employees = await window.api.getPegawaiListAdmin(adminEmail);
      window.pages._allEmployees = employees;
      const select = document.getElementById('pers-guru-select');
      if (select) {
        select.innerHTML = '<option value="">-- Pilih Guru --</option>' +
          employees.map(e => `<option value="${e.nama}">${e.nama} (${e.unit})</option>`).join('');
      }
    } catch(e) { console.error(e); }
  })();

  window.pages.generateGuruHistory = async function() {
    const nama = document.getElementById('pers-guru-select')?.value;
    if (!nama) { window.ui.showToast('⚠️', 'Pilih guru terlebih dahulu', false); return; }

    window.ui.showLoading('Memuat riwayat...');
    try {
      const rawLaporan = await window.api.getLaporanLengkapAdmin();
      const logs = rawLaporan.filter(r => r.nama === nama).sort((a, b) => String(b.waktu || '').localeCompare(String(a.waktu || '')));

      let hadir = 0, terlambat = 0, izin = 0, sakit = 0;
      logs.forEach(r => {
        if (r.jenis === 'Masuk') { hadir++; if (r.status === 'Terlambat') terlambat++; }
        else if (r.jenis === 'Izin') izin++;
        else if (r.jenis === 'Sakit') sakit++;
      });

      const emp = (window.pages._allEmployees || []).find(e => e.nama === nama);
      document.getElementById('pers-guru-avatar').textContent = nama.charAt(0);
      document.getElementById('pers-guru-name').textContent = nama;
      document.getElementById('pers-guru-unit-label').textContent = emp ? emp.unit : '-';

      document.getElementById('pers-guru-stats').innerHTML = [
        { label:'Hadir', value: hadir, color:'#14B88A' },
        { label:'Terlambat', value: terlambat, color:'#F59E0B' },
        { label:'Izin', value: izin, color:'#3B82F6' },
        { label:'Sakit', value: sakit, color:'#06B6D4' },
      ].map(c => `
        <div class="text-center p-3 rounded-xl" style="background:${c.color}10;">
          <div class="text-lg font-black" style="color:${c.color}">${c.value}</div>
          <div class="text-[9px] font-bold text-white/30 uppercase">${c.label}</div>
        </div>
      `).join('');

      document.getElementById('pers-guru-profile').classList.remove('hidden');
      document.getElementById('pers-guru-history-section').classList.remove('hidden');

      const tbody = document.getElementById('pers-guru-log-body');
      tbody.innerHTML = logs.length === 0
        ? '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Belum ada riwayat</td></tr>'
        : logs.map((r, i) => {
            const parts = String(r.waktu || '').split(' ');
            return `<tr>
              <td class="text-xs text-white/30">${i + 1}</td>
              <td class="text-xs font-semibold text-white">${parts[0] || '-'}</td>
              <td class="text-xs text-white/50">${parts[1] || '-'}</td>
              <td class="text-xs text-white/50">${r.jenis || '-'}</td>
              <td>${_personnelHelpers.statusBadge(r.status)}</td>
            </tr>`;
          }).join('');

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Riwayat guru berhasil dimuat', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };
};

// ═══════════════════════════════════════════════════════════
// 3. PEGAWAI TERDISIPLIN (Top Discipline)
// ═══════════════════════════════════════════════════════════
window.pages.renderReportTopDiscipline = function() {
  const now = new Date();
  const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const firstDay = todayStr.substring(0, 8) + '01';

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div class="mb-2">
        ${_personnelHelpers.backButton}
        <div>
          <p class="text-xs font-bold tracking-widest text-[#EAB308] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Pegawai Terdisiplin</h1>
          <p class="text-sm text-white/40 mt-1">Ranking kedisiplinan berdasarkan ketepatan waktu</p>
        </div>
      </div>

      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Dari</label><input type="date" id="rpt-disc-start" class="hrms-input text-sm" value="${firstDay}"></div>
          <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Sampai</label><input type="date" id="rpt-disc-end" class="hrms-input text-sm" value="${todayStr}"></div>
          <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-disc-unit" class="hrms-input hrms-select text-sm"><option value="all">Semua Unit</option><option>SD Integral Hidayatullah</option><option>MTS-MA Putra</option><option>MTS-MA Putri</option><option>TK Islam Qurrata Ayun & TPA</option><option>STIT HISAM</option></select>
          </div>
          <div class="flex items-end"><button onclick="window.pages.generateTopDiscipline()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate</button></div>
        </div>
        <button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button>
      </div>

      <!-- Top 5 Podium -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" id="disc-top5"></div>

      <!-- Full Ranking Table -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#EAB308]/15 border border-[#EAB308]/20 text-[#EAB308]"><i data-lucide="trophy" class="w-5 h-5"></i></div>
          <div><div class="section-title">Ranking Lengkap</div><div class="section-subtitle">Seluruh pegawai diurutkan berdasarkan skor disiplin</div></div>
        </div>
        <div class="glass-card p-0 overflow-hidden">
          <div class="overflow-x-auto" style="max-height:450px;">
            <table class="hrms-table"><thead><tr><th>Rank</th><th>Nama</th><th>Unit</th><th>Hadir</th><th>Tepat</th><th>Terlambat</th><th>Skor</th></tr></thead>
              <tbody id="disc-ranking-body"><tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Klik "Generate" untuk memuat data</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.pages.initReportTopDiscipline = function() {
  if (window.lucide) window.lucide.createIcons();

  window.pages.generateTopDiscipline = async function() {
    window.ui.showLoading('Menganalisis kedisiplinan...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const startVal = document.getElementById('rpt-disc-start').value;
      const endVal = document.getElementById('rpt-disc-end').value;
      const filterUnit = document.getElementById('rpt-disc-unit').value;

      const [employees, rawLaporan] = await Promise.all([
        window.api.getPegawaiListAdmin(adminEmail),
        window.api.getLaporanLengkapAdmin()
      ]);

      const logs = rawLaporan.filter(r => {
        if (!r.waktu) return false;
        const datePart = String(r.waktu).split(' ')[0];
        return datePart >= startVal && datePart <= endVal && _personnelHelpers.checkUnitMatch(r.unit, filterUnit);
      });

      const stats = {};
      logs.forEach(r => {
        if (r.jenis !== 'Masuk') return;
        if (!stats[r.nama]) stats[r.nama] = { unit: r.unit, hadir: 0, tepat: 0, lambat: 0 };
        stats[r.nama].hadir++;
        if (r.status === 'Tepat Waktu') stats[r.nama].tepat++;
        if (r.status === 'Terlambat' || r.status === 'Pulang Cepat') stats[r.nama].lambat++;
      });

      const ranking = Object.keys(stats).map(nama => {
        const s = stats[nama];
        const skor = s.hadir > 0 ? Math.round((s.tepat / s.hadir) * 100) : 0;
        return { nama, ...s, skor };
      }).sort((a, b) => b.skor - a.skor || b.tepat - a.tepat);

      // Top 5 podium
      const top5El = document.getElementById('disc-top5');
      const medals = ['🥇','🥈','🥉','⭐','⭐'];
      if (top5El) {
        const top5 = ranking.slice(0, 5);
        top5El.innerHTML = top5.length === 0
          ? '<div class="col-span-full text-center py-4 text-xs text-white/40">Belum ada data</div>'
          : top5.map((e, i) => `
            <div class="rank-card">
              <div class="rank-badge bg-[#EAB308]/20 text-[#EAB308]">${medals[i]}</div>
              <div class="rank-avatar">${e.nama.charAt(0)}</div>
              <div class="rank-name">${e.nama}</div>
              <div class="rank-position">${e.unit}</div>
              <div class="rank-score">${e.skor}%</div>
              <div class="rank-score-label">Skor Disiplin</div>
            </div>
          `).join('');
      }

      // Full ranking table
      const tbody = document.getElementById('disc-ranking-body');
      if (tbody) {
        tbody.innerHTML = ranking.length === 0
          ? '<tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Tidak ada data</td></tr>'
          : ranking.map((e, i) => `
            <tr>
              <td class="text-xs font-bold ${i < 3 ? 'text-[#EAB308]' : 'text-white/30'}">${i + 1}</td>
              <td><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#EAB308] to-[#CA8A04] flex items-center justify-center text-white text-[10px] font-bold shrink-0">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td>
              <td class="text-xs text-white/50">${e.unit}</td>
              <td><span class="badge badge-success">${e.hadir}</span></td>
              <td class="text-xs font-bold text-[#4ADE80]">${e.tepat}</td>
              <td><span class="${e.lambat > 0 ? 'badge badge-warning' : 'text-xs text-white/30'}">${e.lambat}</span></td>
              <td><span class="text-sm font-black ${e.skor >= 90 ? 'text-[#22C55E]' : e.skor >= 75 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}">${e.skor}%</span></td>
            </tr>
          `).join('');
      }

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Ranking kedisiplinan berhasil di-generate!', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };
};

// ═══════════════════════════════════════════════════════════
// 4. PERLU PERHATIAN (Need Attention)
// ═══════════════════════════════════════════════════════════
window.pages.renderReportAttention = function() {
  const now = new Date();
  const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const firstDay = todayStr.substring(0, 8) + '01';

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div class="mb-2">
        ${_personnelHelpers.backButton}
        <div>
          <p class="text-xs font-bold tracking-widest text-[#EF4444] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Perlu Perhatian</h1>
          <p class="text-sm text-white/40 mt-1">Pegawai dengan catatan kedisiplinan yang memerlukan pembinaan</p>
        </div>
      </div>

      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Dari</label><input type="date" id="rpt-attn-start" class="hrms-input text-sm" value="${firstDay}"></div>
          <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Sampai</label><input type="date" id="rpt-attn-end" class="hrms-input text-sm" value="${todayStr}"></div>
          <div><label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-attn-unit" class="hrms-input hrms-select text-sm"><option value="all">Semua Unit</option><option>SD Integral Hidayatullah</option><option>MTS-MA Putra</option><option>MTS-MA Putri</option><option>TK Islam Qurrata Ayun & TPA</option><option>STIT HISAM</option></select>
          </div>
          <div class="flex items-end"><button onclick="window.pages.generateAttention()" class="btn-primary text-xs w-full"><i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate</button></div>
        </div>
        <button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button>
      </div>

      <!-- Attention Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="attn-cards">
        <div class="col-span-full text-center py-10 text-white/30 text-xs">Klik "Generate" untuk menganalisis data</div>
      </div>

      <!-- Summary -->
      <div id="attn-summary" class="hidden">
        <div class="glass-card p-5 border-l-2 border-l-[#EF4444]">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#EF4444]/15 flex items-center justify-center shrink-0"><i data-lucide="alert-triangle" class="w-5 h-5 text-[#EF4444]"></i></div>
            <div>
              <div class="text-sm font-bold text-[#F87171]">Ringkasan</div>
              <div class="text-xs text-white/50 mt-1" id="attn-summary-text">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.pages.initReportAttention = function() {
  if (window.lucide) window.lucide.createIcons();

  window.pages.generateAttention = async function() {
    window.ui.showLoading('Menganalisis data...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const startVal = document.getElementById('rpt-attn-start').value;
      const endVal = document.getElementById('rpt-attn-end').value;
      const filterUnit = document.getElementById('rpt-attn-unit').value;

      const [employees, rawLaporan] = await Promise.all([
        window.api.getPegawaiListAdmin(adminEmail),
        window.api.getLaporanLengkapAdmin()
      ]);

      const logs = rawLaporan.filter(r => {
        if (!r.waktu) return false;
        const datePart = String(r.waktu).split(' ')[0];
        return datePart >= startVal && datePart <= endVal && _personnelHelpers.checkUnitMatch(r.unit, filterUnit);
      });

      const uniqueDates = new Set();
      const stats = {};
      logs.forEach(r => {
        const datePart = String(r.waktu).split(' ')[0];
        uniqueDates.add(datePart);
        if (!stats[r.nama]) stats[r.nama] = { unit: r.unit, hadir: 0, lambat: 0, izin: 0, sakit: 0 };
        if (r.jenis === 'Masuk') {
          stats[r.nama].hadir++;
          if (r.status === 'Terlambat' || r.status === 'Pulang Cepat') stats[r.nama].lambat++;
        } else if (r.jenis === 'Izin') stats[r.nama].izin++;
        else if (r.jenis === 'Sakit') stats[r.nama].sakit++;
      });

      const hariKerja = uniqueDates.size || 22;

      // Filter: employees with high tardiness or absences
      const filteredEmps = employees.filter(e => _personnelHelpers.checkUnitMatch(e.unit, filterUnit));
      const attentionList = filteredEmps.map(e => {
        const s = stats[e.nama] || { hadir: 0, lambat: 0, izin: 0, sakit: 0 };
        const absen = Math.max(0, hariKerja - s.hadir - s.izin - s.sakit);
        return { nama: e.nama, unit: e.unit, ...s, absen };
      }).filter(e => e.lambat > 2 || e.absen > 3).sort((a, b) => (b.lambat + b.absen) - (a.lambat + a.absen));

      const cardsEl = document.getElementById('attn-cards');
      if (cardsEl) {
        if (attentionList.length === 0) {
          cardsEl.innerHTML = '<div class="col-span-full text-center py-10"><div class="text-4xl mb-3">🎉</div><div class="text-sm font-bold text-[#4ADE80]">Semua Pegawai Disiplin!</div><div class="text-xs text-white/40 mt-1">Tidak ada pegawai yang memerlukan perhatian khusus</div></div>';
        } else {
          cardsEl.innerHTML = attentionList.map(e => {
            const severity = (e.lambat > 5 || e.absen > 5) ? 'high' : 'medium';
            const color = severity === 'high' ? '#EF4444' : '#F59E0B';
            const badge = severity === 'high' ? '⚠️ Perlu Pembinaan' : '🔶 Pantau';
            return `
              <div class="glass-card p-4 border-l-2 hover:-translate-y-1 transition-all" style="border-left-color:${color}">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[${color}]/20 to-[${color}]/10 flex items-center justify-center text-white font-bold text-sm border border-[${color}]/20">${e.nama.charAt(0)}</div>
                  <div>
                    <div class="text-sm font-bold text-white">${e.nama}</div>
                    <div class="text-[10px] text-white/30">${e.unit}</div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 mb-3">
                  <div class="text-center p-2 bg-[#EF4444]/10 rounded-lg"><div class="text-sm font-black text-[#F87171]">${e.lambat}</div><div class="text-[8px] font-bold text-white/20 uppercase">Telat</div></div>
                  <div class="text-center p-2 bg-[#F59E0B]/10 rounded-lg"><div class="text-sm font-black text-[#FBBF24]">${e.absen}</div><div class="text-[8px] font-bold text-white/20 uppercase">Absen</div></div>
                  <div class="text-center p-2 bg-[#3B82F6]/10 rounded-lg"><div class="text-sm font-black text-[#60A5FA]">${e.izin + e.sakit}</div><div class="text-[8px] font-bold text-white/20 uppercase">Izin/Sakit</div></div>
                </div>
                <div class="text-[10px] font-bold" style="color:${color}">${badge}</div>
              </div>
            `;
          }).join('');
        }
      }

      const summaryEl = document.getElementById('attn-summary');
      const summaryTextEl = document.getElementById('attn-summary-text');
      if (summaryEl && summaryTextEl) {
        summaryEl.classList.remove('hidden');
        const perluBinaan = attentionList.filter(e => e.lambat > 5 || e.absen > 5).length;
        summaryTextEl.textContent = attentionList.length === 0
          ? 'Semua pegawai menunjukkan kedisiplinan yang baik pada periode ini.'
          : `Ditemukan ${attentionList.length} pegawai yang memerlukan perhatian. ${perluBinaan} diantaranya perlu pembinaan intensif (terlambat >5x atau absen >5x).`;
      }

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Analisis berhasil!', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };
};
