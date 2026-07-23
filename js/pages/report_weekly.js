/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Laporan Mingguan (Weekly Report)
 * Rekap absensi per minggu (Senin-Sabtu)
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderReportWeekly = function() {
  const now = new Date();
  // Calculate current week Monday
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  const toLocalISO = (d) => new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up" id="report-weekly-root">

      <div class="mb-2">
        <button onclick="window.router.navigateTo('reports')" class="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-4 group no-print">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Kembali ke Pusat Laporan
        </button>
        <div>
          <p class="text-xs font-bold tracking-widest text-[#3B82F6] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Mingguan</h1>
          <p class="text-sm text-white/40 mt-1">Rekap absensi per minggu (Senin - Sabtu)</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Mulai (Senin)</label>
            <input type="date" id="rpt-weekly-start" class="hrms-input text-sm" value="${toLocalISO(monday)}">
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Sampai (Sabtu)</label>
            <input type="date" id="rpt-weekly-end" class="hrms-input text-sm" value="${toLocalISO(saturday)}">
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-weekly-unit" class="hrms-input hrms-select text-sm">
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
            <select id="rpt-weekly-type" class="hrms-input hrms-select text-sm">
              <option value="all">Semua</option>
              <option>Guru</option>
              <option>Karyawan</option>
            </select>
          </div>
          <div class="flex items-end">
            <button onclick="window.pages.generateWeeklyReport()" class="btn-primary text-xs w-full">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" id="weekly-summary-cards">
        ${[
          { label:'Hari Kerja', value:'-', icon:'calendar', color:'#8B5CF6' },
          { label:'Rata-rata Hadir', value:'-', icon:'user-check', color:'#14B88A' },
          { label:'Total Terlambat', value:'-', icon:'clock', color:'#F59E0B' },
          { label:'Total Izin/Sakit', value:'-', icon:'clipboard-list', color:'#3B82F6' },
          { label:'Skor Minggu', value:'-', icon:'award', color:'#EAB308' },
        ].map(c => `
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="${c.icon}" class="w-4 h-4" style="color:${c.color}"></i></div></div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value text-xl">${c.value}</div>
          </div>
        `).join('')}
      </div>

      <!-- Daily Trend Chart -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#3B82F6]/15 border border-[#3B82F6]/20 text-[#3B82F6]"><i data-lucide="line-chart" class="w-5 h-5"></i></div>
          <div>
            <div class="section-title">Tren Harian Minggu Ini</div>
            <div class="section-subtitle">Pergerakan kehadiran Senin–Sabtu</div>
          </div>
        </div>
        <div class="chart-container">
          <div style="height:220px;"><canvas id="weekly-chart-trend"></canvas></div>
        </div>
      </div>

      <!-- Cross-tab Table -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#14B88A]/15 border border-[#14B88A]/20 text-[#14B88A]"><i data-lucide="table" class="w-5 h-5"></i></div>
          <div>
            <div class="section-title">Tabel Kehadiran Mingguan</div>
            <div class="section-subtitle">Status per pegawai per hari</div>
          </div>
        </div>
        <div class="glass-card p-5">
          <div class="relative mb-4 no-print">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20"></i>
            <input type="text" id="weekly-search" placeholder="Cari nama..." class="hrms-input pl-10 text-sm" oninput="window.pages.filterWeeklyTable()">
          </div>
          <div class="overflow-x-auto" style="max-height:450px;">
            <table class="hrms-table">
              <thead><tr id="weekly-thead"><th>#</th><th>Nama</th><th>Unit</th></tr></thead>
              <tbody id="weekly-tbody">
                <tr><td colspan="9" class="text-center py-10 text-white/30 text-xs">Klik "Generate" untuk memuat data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;
};

window.pages.initReportWeekly = function() {
  if (window.lucide) window.lucide.createIcons();

  window.pages._weeklyData = null;
  window.pages._weeklyDates = [];
  window.pages._weeklyChartTrend = null;

  window.pages.generateWeeklyReport = async function() {
    window.ui.showLoading('Memuat laporan mingguan...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const startVal = document.getElementById('rpt-weekly-start').value;
      const endVal = document.getElementById('rpt-weekly-end').value;
      const filterUnit = document.getElementById('rpt-weekly-unit').value;
      const filterTipe = document.getElementById('rpt-weekly-type').value;

      const [employees, rawLaporan] = await Promise.all([
        window.api.getPegawaiListAdmin(adminEmail),
        window.api.getLaporanRentangAdmin(startVal, endVal)
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

      // Get all dates between start and end
      const start = new Date(startVal);
      const end = new Date(endVal);
      const dates = [];
      const hariNama = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        dates.push({ date: iso, label: hariNama[d.getDay()] + ' ' + d.getDate() });
      }
      window.pages._weeklyDates = dates;

      // Filter logs (date already filtered by backend, but we filter by unit and tipe)
      const weekLogs = rawLaporan.filter(r => {
        if (!r.waktu) return false;
        const emp = employees.find(e => e.nama === r.nama);
        const jabatan = emp ? emp.jabatan : '';
        return checkUnitMatch(r.unit, filterUnit) && checkTipeMatch(jabatan, filterTipe);
      });

      // Build per-person per-date
      const personDays = {};
      filteredEmployees.forEach(e => {
        personDays[e.nama] = { unit: e.unit, days: {} };
        dates.forEach(d => { personDays[e.nama].days[d.date] = 'A'; }); // default Absent
      });

      weekLogs.forEach(r => {
        const datePart = String(r.waktu).split(' ')[0];
        if (!personDays[r.nama]) personDays[r.nama] = { unit: r.unit, days: {} };
        
        const currentStatus = personDays[r.nama].days[datePart];
        if (r.jenis === 'Masuk') {
          // Jangan timpa status jika sudah 'PC' (jika berbalik urutannya)
          if (currentStatus !== 'PC' && currentStatus !== 'I' && currentStatus !== 'S') {
            personDays[r.nama].days[datePart] = r.status === 'Terlambat' ? 'T' : 'H';
          }
        } else if (r.jenis === 'Pulang') {
          if ((r.status || '').toLowerCase() === 'pulang cepat') {
            personDays[r.nama].days[datePart] = 'PC';
          }
        } else if (r.jenis === 'Izin') {
          personDays[r.nama].days[datePart] = 'I';
        } else if (r.jenis === 'Sakit') {
          personDays[r.nama].days[datePart] = 'S';
        }
      });

      // Compute summaries
      let totalH = 0, totalT = 0, totalIS = 0, totalA = 0;
      const dailyCounts = {};
      dates.forEach(d => { dailyCounts[d.date] = { hadir: 0, total: 0 }; });

      Object.values(personDays).forEach(p => {
        dates.forEach(d => {
          const st = p.days[d.date] || 'A';
          dailyCounts[d.date].total++;
          if (st === 'H') { 
            totalH++; 
            dailyCounts[d.date].hadir++; 
          } else if (st === 'T' || st === 'PC') { 
            totalT++; 
            dailyCounts[d.date].hadir++; 
          } else if (st === 'I' || st === 'S') {
            totalIS++;
          } else {
            totalA++;
          }
        });
      });

      const totalPeople = Object.keys(personDays).length;
      const avgHadir = dates.length > 0 ? Math.round((totalH + totalT) / dates.length) : 0;
      const totalPossible = totalPeople * dates.length;
      const skorMinggu = totalPossible > 0 ? Math.round(((totalH + totalT) / totalPossible) * 100) : 0;

      // Summary cards
      const summaryEl = document.getElementById('weekly-summary-cards');
      if (summaryEl) {
        const cards = [
          { label:'Hari Kerja', value: dates.length, icon:'calendar', color:'#8B5CF6' },
          { label:'Rata-rata Hadir/Hari', value: avgHadir, icon:'user-check', color:'#14B88A' },
          { label:'Total Terlambat', value: totalT, icon:'clock', color:'#F59E0B' },
          { label:'Total Izin/Sakit', value: totalIS, icon:'clipboard-list', color:'#3B82F6' },
          { label:'Skor Minggu', value: skorMinggu + '%', icon:'award', color:'#EAB308' },
        ];
        summaryEl.innerHTML = cards.map(c => `
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="${c.icon}" class="w-4 h-4" style="color:${c.color}"></i></div></div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value text-xl">${c.value}</div>
          </div>
        `).join('');
      }

      // Trend chart
      if (window.pages._weeklyChartTrend) window.pages._weeklyChartTrend.destroy();
      const trendCtx = document.getElementById('weekly-chart-trend');
      if (trendCtx) {
        window.pages._weeklyChartTrend = new Chart(trendCtx, {
          type: 'line',
          data: {
            labels: dates.map(d => d.label),
            datasets: [{
              label: 'Hadir',
              data: dates.map(d => dailyCounts[d.date].hadir),
              borderColor: '#14B88A',
              backgroundColor: 'rgba(20,184,138,0.08)',
              fill: true, tension: 0.3, borderWidth: 2, pointRadius: 4, pointHoverRadius: 7,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { font: { size: 10 } } }
            },
            plugins: { legend: { display: false } }
          }
        });
      }

      // Cross-tab table
      const thead = document.getElementById('weekly-thead');
      if (thead) {
        thead.innerHTML = '<th>#</th><th>Nama</th><th>Unit</th>' + dates.map(d => `<th class="text-center">${d.label}</th>`).join('') + '<th>%</th>';
      }

      const tableData = Object.keys(personDays).map((nama, i) => ({
        idx: i + 1, nama, unit: personDays[nama].unit, days: personDays[nama].days
      }));
      window.pages._weeklyData = tableData;
      window.pages.renderWeeklyTable(tableData);

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Laporan mingguan berhasil di-generate!', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };

  window.pages.renderWeeklyTable = function(data) {
    const tbody = document.getElementById('weekly-tbody');
    if (!tbody || !data) return;
    const dates = window.pages._weeklyDates;

    const statusCell = (s) => {
      if (s === 'H') return '<span class="badge badge-success text-[9px]">H</span>';
      if (s === 'T' || s === 'PC') return `<span class="badge badge-warning text-[9px]">${s}</span>`;
      if (s === 'I') return '<span class="badge text-[9px]" style="background:rgba(59,130,246,0.15);color:#60A5FA;">I</span>';
      if (s === 'S') return '<span class="badge text-[9px]" style="background:rgba(6,182,212,0.15);color:#22D3EE;">S</span>';
      return '<span class="badge badge-danger text-[9px]">A</span>';
    };

    tbody.innerHTML = data.length === 0
      ? `<tr><td colspan="${3 + dates.length + 1}" class="text-center py-10 text-white/30 text-xs">Tidak ada data</td></tr>`
      : data.map(e => {
          let hadir = 0;
          dates.forEach(d => { const s = e.days[d.date]; if (s === 'H' || s === 'T' || s === 'PC') hadir++; });
          const pct = dates.length > 0 ? Math.round((hadir / dates.length) * 100) : 0;
          return `<tr>
            <td class="text-xs text-white/30">${e.idx}</td>
            <td><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white text-[9px] font-bold shrink-0">${e.nama.charAt(0)}</div><span class="font-semibold text-white text-xs">${e.nama}</span></div></td>
            <td class="text-xs text-white/50">${e.unit}</td>
            ${dates.map(d => `<td class="text-center">${statusCell(e.days[d.date] || 'A')}</td>`).join('')}
            <td><span class="text-xs font-bold ${pct >= 90 ? 'text-[#4ADE80]' : pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${pct}%</span></td>
          </tr>`;
        }).join('');
  };

  window.pages.filterWeeklyTable = function() {
    const q = (document.getElementById('weekly-search')?.value || '').toLowerCase();
    if (!window.pages._weeklyData) return;
    const filtered = window.pages._weeklyData.filter(e => e.nama.toLowerCase().includes(q) || e.unit.toLowerCase().includes(q));
    window.pages.renderWeeklyTable(filtered);
  };
};
