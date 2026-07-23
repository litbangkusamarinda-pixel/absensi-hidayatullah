/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Laporan Harian (Daily Report)
 * Rekap absensi untuk satu hari tertentu
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderReportDaily = function() {
  const now = new Date();
  const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up" id="report-daily-root">

      <!-- Back Button & Header -->
      <div class="mb-2">
        <button onclick="window.router.navigateTo('reports')" class="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-4 group no-print">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Kembali ke Pusat Laporan
        </button>
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Laporan & Analitik</p>
            <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Harian</h1>
            <p class="text-sm text-white/40 mt-1">Rekap absensi untuk satu hari tertentu</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tanggal</label>
            <input type="date" id="rpt-daily-date" class="hrms-input text-sm" value="${todayStr}">
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-daily-unit" class="hrms-input hrms-select text-sm">
              <option value="all">Semua Unit</option>
              <option>SD Integral Hidayatullah</option>
              <option>MTS-MA Putra</option>
              <option>MTS-MA Putri</option>
              <option>TK Islam Qurrata Ayun & TPA</option>
              <option>STIT HISAM</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tipe</label>
            <select id="rpt-daily-type" class="hrms-input hrms-select text-sm">
              <option value="all">Semua</option>
              <option>Guru</option>
              <option>Karyawan</option>
            </select>
          </div>
          <div class="flex items-end">
            <button onclick="window.pages.generateDailyReport()" class="btn-primary text-xs w-full">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.print()" class="btn-secondary text-xs">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="daily-summary-cards">
        ${[
          { label:'Total Pegawai', value:'-', icon:'users', color:'#3B82F6' },
          { label:'Hadir', value:'-', icon:'user-check', color:'#14B88A' },
          { label:'Terlambat', value:'-', icon:'clock', color:'#F59E0B' },
          { label:'Izin', value:'-', icon:'clipboard-list', color:'#3B82F6' },
          { label:'Sakit', value:'-', icon:'heart-pulse', color:'#06B6D4' },
          { label:'Tidak Hadir', value:'-', icon:'user-x', color:'#EF4444' },
        ].map(c => `
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;">
                <i data-lucide="${c.icon}" class="w-4 h-4" style="color:${c.color}"></i>
              </div>
            </div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value text-xl">${c.value}</div>
          </div>
        `).join('')}
      </div>

      <!-- Attendance Distribution Chart -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#14B88A]/15 border border-[#14B88A]/20 text-[#14B88A]">
            <i data-lucide="pie-chart" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Distribusi Kehadiran</div>
            <div class="section-subtitle">Proporsi status kehadiran hari ini</div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="chart-container">
            <div class="chart-title">Status Kehadiran</div>
            <div style="height:220px;"><canvas id="daily-chart-pie"></canvas></div>
          </div>
          <div class="chart-container">
            <div class="chart-title">Jam Masuk Pegawai</div>
            <div class="chart-subtitle">Distribusi waktu check-in</div>
            <div style="height:220px;"><canvas id="daily-chart-checkin"></canvas></div>
          </div>
        </div>
      </div>

      <!-- Detail Table -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#3B82F6]/15 border border-[#3B82F6]/20 text-[#3B82F6]">
            <i data-lucide="table" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Detail Kehadiran</div>
            <div class="section-subtitle">Data lengkap per pegawai</div>
          </div>
        </div>
        <div class="glass-card p-5">
          <div class="relative mb-4 no-print">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20"></i>
            <input type="text" id="daily-search" placeholder="Cari nama pegawai..." class="hrms-input pl-10 text-sm" oninput="window.pages.filterDailyTable()">
          </div>
          <div class="overflow-x-auto" style="max-height:400px;">
            <table class="hrms-table" id="daily-detail-table">
              <thead>
                <tr>
                  <th>#</th><th>Nama</th><th>Unit</th><th>Jam Masuk</th><th>Jam Pulang</th><th>Status</th><th>Keterangan</th>
                </tr>
              </thead>
              <tbody id="daily-detail-body">
                <tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Klik "Generate" untuk memuat data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;
};

window.pages.initReportDaily = function() {
  if (window.lucide) window.lucide.createIcons();

  window.pages._dailyData = null;
  window.pages._dailyChartPie = null;
  window.pages._dailyChartCheckin = null;

  window.pages.generateDailyReport = async function() {
    window.ui.showLoading('Memuat laporan harian...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const dateVal = document.getElementById('rpt-daily-date').value;
      const filterUnit = document.getElementById('rpt-daily-unit').value;

      const filterTipe = document.getElementById('rpt-daily-type').value;
      const [employees, rawLaporan] = await Promise.all([
        window.api.getPegawaiListAdmin(adminEmail),
        window.api.getLaporanHarianAdmin(dateVal)
      ]);

      const checkUnitMatch = (dataUnit, filter) => {
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
      };

      const checkTipeMatch = (jabatan, filter) => {
        if (filter === 'all') return true;
        const isGuru = (jabatan || '').toLowerCase().includes('guru');
        if (filter === 'Guru') return isGuru;
        if (filter === 'Karyawan') return !isGuru;
        return true;
      };

      const filteredEmployees = employees.filter(e => checkUnitMatch(e.unit, filterUnit) && checkTipeMatch(e.jabatan, filterTipe));

      // Filter logs (date is already filtered by backend, but we filter by Unit and Tipe here)
      const dayLogs = rawLaporan.filter(r => {
        if (!r.waktu) return false;
        const emp = employees.find(e => (e.email || e.nama) === (r.email || r.nama));
        const jabatan = emp ? emp.jabatan : '';
        return checkUnitMatch(r.unit, filterUnit) && checkTipeMatch(jabatan, filterTipe);
      });

      // Build per-person stats
      const personStats = {};
      dayLogs.forEach(r => {
        const key = r.email || r.nama;
        if (!personStats[key]) personStats[key] = { nama: r.nama, unit: r.unit, masuk: null, pulang: null, status: '-', keterangan: '-' };
        const waktuParts = String(r.waktu).split(' ');
        const jam = waktuParts[1] || '';

        if (r.jenis === 'Masuk') {
          personStats[key].masuk = jam;
          // Jangan timpa status jika sudah 'Pulang Cepat' atau izin (berjaga-jaga jika terbalik urutannya)
          if (personStats[key].status === '-' || personStats[key].status === 'Tidak Hadir') {
            personStats[key].status = (r.status || 'Hadir').trim();
          }
          personStats[key].unit = r.unit;
        } else if (r.jenis === 'Pulang') {
          personStats[key].pulang = jam;
          const statusPulang = (r.status || '').toLowerCase().trim();
          
          if (statusPulang === 'pulang cepat') {
            personStats[key].status = 'Pulang Cepat';
          } else if (personStats[key].status === '-' || personStats[key].status === 'Tidak Hadir') {
            // Jika mereka lupa absen masuk tapi absen pulang, anggap hadir
            personStats[key].status = (r.status || 'Hadir').trim();
          }
        } else if (r.jenis === 'Izin') {
          personStats[key].status = 'Izin';
          personStats[key].keterangan = r.keterangan || 'Izin';
        } else if (r.jenis === 'Sakit') {
          personStats[key].status = 'Sakit';
          personStats[key].keterangan = r.keterangan || 'Sakit';
        }
      });

      // Add employees who have no logs (absent)
      filteredEmployees.forEach(e => {
        const key = e.email || e.nama;
        if (!personStats[key]) {
          personStats[key] = { nama: e.nama, unit: e.unit, masuk: null, pulang: null, status: 'Tidak Hadir', keterangan: '-' };
        }
      });

      // Calculate summaries
      let totalHadir = 0, totalTerlambat = 0, totalIzin = 0, totalSakit = 0, totalAbsen = 0;
      const checkinHours = {};

      Object.values(personStats).forEach(p => {
        const s = (p.status || '').toLowerCase().trim();
        if (s === 'tepat waktu' || s === 'hadir') {
          totalHadir++;
        } else if (s === 'terlambat' || s === 'pulang cepat') { 
          totalHadir++; 
          totalTerlambat++; 
        } else if (s === 'izin') {
          totalIzin++;
        } else if (s === 'sakit') {
          totalSakit++;
        } else {
          totalAbsen++;
        }

        if (p.masuk) {
          const hour = p.masuk.split(':')[0];
          checkinHours[hour] = (checkinHours[hour] || 0) + 1;
        }
      });

      const totalPegawai = Object.keys(personStats).length;

      // Update summary cards
      const summaryEl = document.getElementById('daily-summary-cards');
      if (summaryEl) {
        const cards = [
          { label:'Total Pegawai', value: totalPegawai, icon:'users', color:'#3B82F6' },
          { label:'Hadir', value: totalHadir, icon:'user-check', color:'#14B88A' },
          { label:'Terlambat', value: totalTerlambat, icon:'clock', color:'#F59E0B' },
          { label:'Izin', value: totalIzin, icon:'clipboard-list', color:'#3B82F6' },
          { label:'Sakit', value: totalSakit, icon:'heart-pulse', color:'#06B6D4' },
          { label:'Tidak Hadir', value: totalAbsen, icon:'user-x', color:'#EF4444' },
        ];
        summaryEl.innerHTML = cards.map(c => `
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;">
                <i data-lucide="${c.icon}" class="w-4 h-4" style="color:${c.color}"></i>
              </div>
            </div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value text-xl">${c.value}</div>
          </div>
        `).join('');
      }

      // Pie Chart
      if (window.pages._dailyChartPie) window.pages._dailyChartPie.destroy();
      const pieCtx = document.getElementById('daily-chart-pie');
      if (pieCtx) {
        window.pages._dailyChartPie = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Tidak Hadir'],
            datasets: [{
              data: [totalHadir - totalTerlambat, totalTerlambat, totalIzin, totalSakit, totalAbsen],
              backgroundColor: ['rgba(20,184,138,0.7)', 'rgba(245,158,11,0.7)', 'rgba(59,130,246,0.7)', 'rgba(6,182,212,0.7)', 'rgba(239,68,68,0.7)'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } } }
          }
        });
      }

      // Check-in time chart
      if (window.pages._dailyChartCheckin) window.pages._dailyChartCheckin.destroy();
      const checkinCtx = document.getElementById('daily-chart-checkin');
      if (checkinCtx) {
        const hours = ['05','06','07','08','09','10','11'];
        window.pages._dailyChartCheckin = new Chart(checkinCtx, {
          type: 'bar',
          data: {
            labels: hours.map(h => h + ':00'),
            datasets: [{
              label: 'Pegawai',
              data: hours.map(h => checkinHours[h] || 0),
              backgroundColor: 'rgba(20,184,138,0.4)',
              borderColor: '#14B88A',
              borderWidth: 1.5,
              borderRadius: 6,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 9 } } },
              y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { font: { size: 9 } } }
            },
            plugins: { legend: { display: false } }
          }
        });
      }

      // Detail Table
      const tableData = Object.values(personStats).map((person, i) => ({
        idx: i + 1,
        ...person
      }));

      window.pages._dailyData = tableData;
      window.pages.renderDailyTable(tableData);

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Laporan harian berhasil di-generate!', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data: ' + err.message, false);
    }
  };

  window.pages.renderDailyTable = function(data) {
    const tbody = document.getElementById('daily-detail-body');
    if (!tbody || !data) return;

    const statusBadge = (s) => {
      const sl = s.toLowerCase();
      if (sl === 'tepat waktu' || sl === 'hadir') return `<span class="badge badge-success">${s}</span>`;
      if (sl === 'terlambat' || sl === 'pulang cepat') return `<span class="badge badge-warning">${s}</span>`;
      if (sl === 'izin') return `<span class="badge" style="background:rgba(59,130,246,0.15);color:#60A5FA;">${s}</span>`;
      if (sl === 'sakit') return `<span class="badge" style="background:rgba(6,182,212,0.15);color:#22D3EE;">${s}</span>`;
      if (sl === 'tidak hadir') return `<span class="badge badge-danger">${s}</span>`;
      return `<span class="text-xs text-white/40">${s}</span>`;
    };

    tbody.innerHTML = data.length === 0
      ? '<tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Tidak ada data untuk tanggal ini</td></tr>'
      : data.map(e => `
        <tr>
          <td class="text-xs text-white/30">${e.idx}</td>
          <td>
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#14B88A] to-[#0D9B73] flex items-center justify-center text-white text-[10px] font-bold shrink-0">${e.nama.charAt(0)}</div>
              <span class="font-semibold text-white text-xs">${e.nama}</span>
            </div>
          </td>
          <td class="text-xs text-white/50">${e.unit}</td>
          <td class="text-xs ${e.masuk ? 'text-white' : 'text-white/20'}">${e.masuk || '-'}</td>
          <td class="text-xs ${e.pulang ? 'text-white' : 'text-white/20'}">${e.pulang || '-'}</td>
          <td>${statusBadge(e.status)}</td>
          <td class="text-xs text-white/40">${e.keterangan}</td>
        </tr>
      `).join('');
  };

  window.pages.filterDailyTable = function() {
    const q = (document.getElementById('daily-search')?.value || '').toLowerCase();
    if (!window.pages._dailyData) return;
    const filtered = window.pages._dailyData.filter(e => e.nama.toLowerCase().includes(q) || e.unit.toLowerCase().includes(q));
    window.pages.renderDailyTable(filtered);
  };
};
