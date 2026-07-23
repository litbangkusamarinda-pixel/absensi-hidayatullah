/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Laporan Tahunan (Yearly Report)
 * Ringkasan absensi tahunan dengan chart 12 bulan
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderReportYearly = function() {
  const now = new Date();

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up" id="report-yearly-root">

      <div class="mb-2">
        <button onclick="window.router.navigateTo('reports')" class="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-4 group no-print">
          <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Kembali ke Pusat Laporan
        </button>
        <div>
          <p class="text-xs font-bold tracking-widest text-[#EC4899] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Tahunan</h1>
          <p class="text-sm text-white/40 mt-1">Ringkasan absensi tahunan dengan tren 12 bulan</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tahun</label>
            <select id="rpt-yearly-year" class="hrms-input hrms-select text-sm">
              ${[now.getFullYear(), now.getFullYear()-1, now.getFullYear()-2].map(y => `<option value="${y}">${y}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-yearly-unit" class="hrms-input hrms-select text-sm">
              <option value="all">Semua Unit</option>
              <option>SD Integral Hidayatullah</option>
              <option>MTS-MA Putra</option>
              <option>MTS-MA Putri</option>
              <option>TK Islam Qurrata Ayun & TPA</option>
              <option>STIT HISAM</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tipe Pegawai</label>
            <select id="rpt-yearly-type" class="hrms-input hrms-select text-sm">
              <option value="all">Semua</option>
              <option>Guru</option>
              <option>Karyawan</option>
            </select>
          </div>
          <div class="flex items-end">
            <button onclick="window.pages.generateYearlyReport()" class="btn-primary text-xs w-full">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.print()" class="btn-secondary text-xs"><i data-lucide="printer" class="w-3.5 h-3.5"></i> Print</button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" id="yearly-summary-cards">
        ${[
          { label:'Total Pegawai', value:'-', icon:'users', color:'#3B82F6' },
          { label:'Hari Kerja', value:'-', icon:'calendar', color:'#8B5CF6' },
          { label:'Rata-rata Hadir', value:'-', icon:'user-check', color:'#14B88A' },
          { label:'Total Terlambat', value:'-', icon:'clock', color:'#F59E0B' },
          { label:'Skor Tahunan', value:'-', icon:'award', color:'#EAB308' },
        ].map(c => `
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="${c.icon}" class="w-4 h-4" style="color:${c.color}"></i></div></div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value text-xl">${c.value}</div>
          </div>
        `).join('')}
      </div>

      <!-- Monthly Bar Chart -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#EC4899]/15 border border-[#EC4899]/20 text-[#EC4899]"><i data-lucide="bar-chart-3" class="w-5 h-5"></i></div>
          <div>
            <div class="section-title">Tren Kehadiran 12 Bulan</div>
            <div class="section-subtitle">Persentase kehadiran per bulan</div>
          </div>
        </div>
        <div class="chart-container">
          <div style="height:260px;"><canvas id="yearly-chart-bar"></canvas></div>
        </div>
      </div>

      <!-- Monthly Detail Table -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-[#8B5CF6]"><i data-lucide="table" class="w-5 h-5"></i></div>
          <div>
            <div class="section-title">Rekap Per Bulan</div>
            <div class="section-subtitle">Detail kehadiran 12 bulan</div>
          </div>
        </div>
        <div class="glass-card p-0 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="hrms-table">
              <thead>
                <tr><th>Bulan</th><th>Hadir</th><th>Terlambat</th><th>Izin</th><th>Sakit</th><th>Tidak Hadir</th><th>% Kehadiran</th></tr>
              </thead>
              <tbody id="yearly-monthly-table">
                <tr><td colspan="7" class="text-center py-10 text-white/30 text-xs">Klik "Generate" untuk memuat data</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Best & Worst Months -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="yearly-highlights">
      </div>

    </div>
  `;
};

window.pages.initReportYearly = function() {
  if (window.lucide) window.lucide.createIcons();
  window.pages._yearlyChartBar = null;

  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  window.pages.generateYearlyReport = async function() {
    window.ui.showLoading('Memuat laporan tahunan...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const year = parseInt(document.getElementById('rpt-yearly-year').value);
      const filterUnit = document.getElementById('rpt-yearly-unit').value;
      const filterTipe = document.getElementById('rpt-yearly-type').value;

      const fetchStart = `${year}-01-01`;
      const fetchEnd = `${year}-12-31`;

      const [employees, rawLaporan] = await Promise.all([
        window.api.getPegawaiListAdmin(adminEmail),
        window.api.getLaporanRentangAdmin(fetchStart, fetchEnd)
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

      // Filter logs for selected year and filters
      const yearLogs = rawLaporan.filter(r => {
        if (!r.waktu) return false;
        const datePart = String(r.waktu).split(' ')[0];
        const parts = datePart.split('-');
        const logYear = parts[0] && parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
        if (logYear !== year) return false;
        
        if (!checkUnitMatch(r.unit, filterUnit)) return false;

        const emp = employees.find(e => e.nama === r.nama);
        const jabatan = emp ? emp.jabatan : '';
        if (!checkTipeMatch(jabatan, filterTipe)) return false;

        return true;
      });

      // Build monthly stats
      const monthly = Array.from({ length: 12 }, () => ({ hadir: 0, terlambat: 0, izin: 0, sakit: 0, dates: new Set() }));

      yearLogs.forEach(r => {
        const datePart = String(r.waktu).split(' ')[0];
        const parts = datePart.split('-');
        const monthIdx = parts[0].length === 4 ? parseInt(parts[1]) - 1 : parseInt(parts[1]) - 1;
        if (monthIdx < 0 || monthIdx > 11) return;

        monthly[monthIdx].dates.add(datePart);

        if (r.jenis === 'Masuk') {
          monthly[monthIdx].hadir++;
          if (r.status === 'Terlambat') monthly[monthIdx].terlambat++;
        } else if (r.jenis === 'Pulang') {
          if ((r.status || '').toLowerCase() === 'pulang cepat') {
            monthly[monthIdx].terlambat++;
          }
        } else if (r.jenis === 'Izin' || r.status === 'Izin') {
          monthly[monthIdx].izin++;
        } else if (r.jenis === 'Sakit' || r.status === 'Sakit') {
          monthly[monthIdx].sakit++;
        }
      });

      // Calculate summary
      let totalHadir = 0, totalTerlambat = 0, allDates = new Set();
      const pctArr = [];
      monthly.forEach((m, i) => {
        totalHadir += m.hadir;
        totalTerlambat += m.terlambat;
        m.dates.forEach(d => allDates.add(d));

        const hariKerja = m.dates.size || 22;
        const possible = filteredEmployees.length * hariKerja;
        const pct = possible > 0 ? Math.round((m.hadir / possible) * 100) : 0;
        pctArr.push(pct);
        m.pct = pct;
        m.absent = Math.max(0, possible - m.hadir - m.izin - m.sakit);
      });

      const totalPossible = filteredEmployees.length * (allDates.size || 264);
      const avgPct = totalPossible > 0 ? Math.round((totalHadir / totalPossible) * 100) : 0;

      // Summary cards
      const summaryEl = document.getElementById('yearly-summary-cards');
      if (summaryEl) {
        const cards = [
          { label:'Total Pegawai', value: filteredEmployees.length, icon:'users', color:'#3B82F6' },
          { label:'Hari Kerja', value: allDates.size, icon:'calendar', color:'#8B5CF6' },
          { label:'Rata-rata Hadir', value: avgPct + '%', icon:'user-check', color:'#14B88A' },
          { label:'Total Terlambat', value: totalTerlambat, icon:'clock', color:'#F59E0B' },
          { label:'Skor Tahunan', value: avgPct + '%', icon:'award', color:'#EAB308' },
        ];
        summaryEl.innerHTML = cards.map(c => `
          <div class="stat-card">
            <div class="flex items-center gap-2 mb-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c.color}15;"><i data-lucide="${c.icon}" class="w-4 h-4" style="color:${c.color}"></i></div></div>
            <div class="stat-label">${c.label}</div>
            <div class="stat-value text-xl">${c.value}</div>
          </div>
        `).join('');
      }

      // Bar Chart
      if (window.pages._yearlyChartBar) window.pages._yearlyChartBar.destroy();
      const barCtx = document.getElementById('yearly-chart-bar');
      if (barCtx) {
        window.pages._yearlyChartBar = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: monthNames.map(m => m.substring(0, 3)),
            datasets: [{
              label: '% Kehadiran',
              data: pctArr,
              backgroundColor: pctArr.map(p => p >= 90 ? 'rgba(20,184,138,0.5)' : p >= 75 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'),
              borderColor: pctArr.map(p => p >= 90 ? '#14B88A' : p >= 75 ? '#F59E0B' : '#EF4444'),
              borderWidth: 1.5,
              borderRadius: 6,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { font: { size: 10 }, callback: v => v + '%' } }
            },
            plugins: { legend: { display: false } }
          }
        });
      }

      // Monthly Table
      const tableBody = document.getElementById('yearly-monthly-table');
      if (tableBody) {
        tableBody.innerHTML = monthly.map((m, i) => {
          const pct = m.pct || 0;
          return `<tr>
            <td class="text-xs font-semibold text-white">${monthNames[i]}</td>
            <td><span class="badge badge-success">${m.hadir}</span></td>
            <td><span class="badge badge-warning">${m.terlambat}</span></td>
            <td class="text-xs">${m.izin}</td>
            <td class="text-xs">${m.sakit}</td>
            <td><span class="${m.absent > 0 ? 'badge badge-danger' : 'text-xs text-white/30'}">${m.absent}</span></td>
            <td>
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[80px]">
                  <div class="h-full rounded-full ${pct >= 90 ? 'bg-[#22C55E]' : pct >= 75 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}" style="width:${pct}%"></div>
                </div>
                <span class="text-xs font-bold ${pct >= 90 ? 'text-[#4ADE80]' : pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${pct}%</span>
              </div>
            </td>
          </tr>`;
        }).join('');
      }

      // Highlights
      const highlightsEl = document.getElementById('yearly-highlights');
      if (highlightsEl) {
        const monthsWithData = monthly.map((m, i) => ({ ...m, idx: i })).filter(m => m.dates.size > 0);
        const bestMonth = monthsWithData.length > 0 ? monthsWithData.reduce((a, b) => a.pct > b.pct ? a : b) : null;
        const worstMonth = monthsWithData.length > 0 ? monthsWithData.reduce((a, b) => a.pct < b.pct ? a : b) : null;

        highlightsEl.innerHTML = `
          <div class="glass-card p-5 border-l-2 border-l-[#22C55E]">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#22C55E]/15 flex items-center justify-center"><i data-lucide="trophy" class="w-5 h-5 text-[#22C55E]"></i></div>
              <div>
                <div class="text-sm font-bold text-[#4ADE80]">Bulan Terbaik</div>
                <div class="text-[10px] text-white/30">Kehadiran tertinggi</div>
              </div>
            </div>
            <div class="text-2xl font-black text-white">${bestMonth ? monthNames[bestMonth.idx] : '-'}</div>
            <div class="text-xs text-white/40 mt-1">${bestMonth ? bestMonth.pct + '% kehadiran' : 'Belum ada data'}</div>
          </div>
          <div class="glass-card p-5 border-l-2 border-l-[#EF4444]">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#EF4444]/15 flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5 text-[#EF4444]"></i></div>
              <div>
                <div class="text-sm font-bold text-[#F87171]">Bulan Terendah</div>
                <div class="text-[10px] text-white/30">Kehadiran terendah</div>
              </div>
            </div>
            <div class="text-2xl font-black text-white">${worstMonth ? monthNames[worstMonth.idx] : '-'}</div>
            <div class="text-xs text-white/40 mt-1">${worstMonth ? worstMonth.pct + '% kehadiran' : 'Belum ada data'}</div>
          </div>
        `;
      }

      if (window.lucide) window.lucide.createIcons();
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Laporan tahunan berhasil di-generate!', true);
    } catch (err) {
      console.error(err);
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };
};
