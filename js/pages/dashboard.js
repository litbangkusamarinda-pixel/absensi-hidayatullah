/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Premium SaaS Dashboard
 * Enterprise Dashboard with Charts & Analytics
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderDashboard = function() {
  const user = window.auth.currentUser || { name: 'Admin', role: 'admin' };
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  })();
  
  return `
    <div class="space-y-6 pb-10">
      
      <!-- Greeting -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">${greeting}</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1">
            ${user.name.split(' ')[0]}! 👋
          </h1>
          <p class="text-sm text-white/40 font-medium">
            Ringkasan aktivitas HRMS Hidayatullah hari ini
          </p>
        </div>
        <div class="flex items-center gap-2 no-print">
          <div class="flex items-center gap-2 text-xs bg-white/[0.04] px-4 py-2 rounded-xl border border-white/[0.06]">
            <span class="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            <span class="text-white/60 font-semibold">Online</span>
          </div>
        </div>
      </div>

      <!-- ═══ STAT CARDS ═══ -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 stagger-children">
        
        <div class="stat-card accent-info">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#3B82F6]/15 flex items-center justify-center">
              <i data-lucide="graduation-cap" class="w-5 h-5 text-[#60A5FA]"></i>
            </div>
          </div>
          <div class="stat-label">Total Guru</div>
          <div class="stat-value text-2xl" id="stat-guru">-</div>
        </div>

        <div class="stat-card accent-info">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
              <i data-lucide="users" class="w-5 h-5 text-[#A78BFA]"></i>
            </div>
          </div>
          <div class="stat-label">Karyawan</div>
          <div class="stat-value text-2xl" id="stat-total">-</div>
        </div>

        <div class="stat-card accent-success">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#22C55E]/15 flex items-center justify-center">
              <i data-lucide="user-check" class="w-5 h-5 text-[#4ADE80]"></i>
            </div>
          </div>
          <div class="stat-label">Hadir</div>
          <div class="stat-value text-2xl" id="stat-hadir">-</div>
        </div>

        <div class="stat-card accent-warning">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center">
              <i data-lucide="clock" class="w-5 h-5 text-[#FBBF24]"></i>
            </div>
          </div>
          <div class="stat-label">Terlambat</div>
          <div class="stat-value text-2xl" id="stat-telat">-</div>
        </div>

        <div class="stat-card accent-danger">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#EF4444]/15 flex items-center justify-center">
              <i data-lucide="user-x" class="w-5 h-5 text-[#F87171]"></i>
            </div>
          </div>
          <div class="stat-label">Tidak Hadir</div>
          <div class="stat-value text-2xl" id="stat-absen">0</div>
        </div>

        <div class="stat-card accent-warning">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#F97316]/15 flex items-center justify-center">
              <i data-lucide="log-out" class="w-5 h-5 text-[#FB923C]"></i>
            </div>
          </div>
          <div class="stat-label">Belum Pulang</div>
          <div class="stat-value text-2xl" id="stat-belum-pulang">-</div>
        </div>

        <div class="stat-card accent-primary">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#14B88A]/15 flex items-center justify-center">
              <i data-lucide="percent" class="w-5 h-5 text-[#14B88A]"></i>
            </div>
          </div>
          <div class="stat-label">Kehadiran</div>
          <div class="stat-value text-2xl" id="stat-persen">-%</div>
        </div>

      </div>

      <!-- ═══ CHARTS ROW ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Weekly Attendance Chart -->
        <div class="chart-container">
          <div class="chart-title">Tren Absensi Mingguan</div>
          <div class="chart-subtitle">Kehadiran 7 hari terakhir</div>
          <div style="height:220px;"><canvas id="chart-weekly"></canvas></div>
        </div>
        <!-- Attendance Status Donut -->
        <div class="chart-container">
          <div class="chart-title">Status Kehadiran Hari Ini</div>
          <div class="chart-subtitle">Breakdown status absensi</div>
          <div style="height:220px;"><canvas id="chart-status"></canvas></div>
        </div>
      </div>

      <!-- ═══ MAIN CONTENT GRID ═══ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <!-- Live Log Table -->
        <div class="lg:col-span-2 glass-card p-5 flex flex-col h-[420px] relative overflow-hidden">
          <div class="absolute top-0 right-0 w-48 h-48 bg-[#14B88A]/5 rounded-full blur-[60px] -z-10 pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-black/20 border border-white/[0.06] flex items-center justify-center">
                <div class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Log Absensi Live</h3>
                <p class="text-[10px] text-white/30">Auto-refresh 30 detik</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.ui.openBypassModal()" class="btn-primary text-xs py-2 px-3 no-print">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Bypass Absen
              </button>
              <button onclick="window.pages.downloadCSV()" id="btnDl" class="btn-secondary text-xs py-2 px-3 no-print">
                <i data-lucide="download" class="w-3.5 h-3.5"></i> Ekspor CSV
              </button>
            </div>
          </div>
          
          <div class="flex-1 overflow-auto rounded-xl bg-black/20 border border-white/[0.04]">
            <table class="hrms-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama / Unit</th>
                  <th>Jenis</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="tabelLog">
                <tr><td colspan="4" class="text-center py-10 text-white/30 text-xs">Memuat data live...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Izin Pending -->
        <div class="glass-card p-5 flex flex-col h-[420px] relative overflow-hidden">
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-[#F59E0B]/5 rounded-full blur-[60px] -z-10 pointer-events-none"></div>

          <div class="flex items-center gap-3 mb-4 shrink-0">
            <div class="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/20 flex items-center justify-center">
              <i data-lucide="inbox" class="w-5 h-5 text-[#FBBF24]"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Persetujuan Izin</h3>
              <p class="text-[10px] text-[#FBBF24]/70 font-semibold" id="pendingCount">0 menunggu</p>
            </div>
          </div>
          
          <div class="flex-1 overflow-auto space-y-2 pr-1" id="tabelPending">
            <div class="empty-state py-8">
              <div class="empty-icon w-12 h-12"><i data-lucide="inbox" class="w-5 h-5"></i></div>
              <div class="empty-title text-xs">Tidak ada pengajuan</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
};

window.pages.initDashboard = function() {
  const adminEmail = window.auth.currentUser.email;
  let chartWeekly = null;
  let chartStatus = null;

  // ═══ Chart.js Global Defaults ═══
  Chart.defaults.color = 'rgba(255,255,255,0.4)';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.04)';
  Chart.defaults.font.family = 'Inter';
  Chart.defaults.font.weight = 500;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.legend.labels.font = { size: 11, weight: 600 };

  // ═══ Unified Data Loader (Fixes Race Conditions) ═══
  async function refreshDashboardData() {
    try {
      // Fetch in parallel
      const now = new Date();
      const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const [dLog, dPegawai, dIzin] = await Promise.all([
        window.api.getLaporanHarianAdmin(todayStr).catch(() => []),
        window.api.getPegawaiListAdmin(adminEmail).catch(() => []),
        window.api.getIzinPendingAdmin(adminEmail).catch(() => [])
      ]);
      
      // Reverse for newest on top in Live Log
      if (Array.isArray(dLog)) dLog.reverse();
      
      // --- 1 & 2. Process Stats & Live Log using Unified Logic ---
      const tb = document.getElementById('tabelLog');
      const personStats = {};
      let totalGuru = 0;
      let totalKaryawan = 0;

      // Init from Pegawai Database
      if (dPegawai && dPegawai.length) {
        dPegawai.forEach(p => {
          personStats[p.nama] = { status: 'Tidak Hadir', masuk: false, pulang: false };
          const role = (p.jabatan || p.unit || p.role || p.posisi || '').toLowerCase();
          if (role.includes('guru') || role.includes('pengajar') || role.includes('ustadz')) {
            totalGuru++;
          } else {
            totalKaryawan++;
          }
        });
      }

      // Process Logs
      let liveLogHTML = '';
      if (dLog.success === false) { 
        liveLogHTML = '<tr><td colspan="4" class="text-center py-8 text-red-400 text-xs">Gagal memuat log</td></tr>';
      } else if (!dLog.length) { 
        liveLogHTML = '<tr><td colspan="4" class="text-center py-8 text-white/30 text-xs">Belum ada data hari ini</td></tr>'; 
      } else {
        liveLogHTML = dLog.map(r => {
          // If a log exists for a deleted/unknown employee, track them too!
          if (!personStats[r.nama]) {
            personStats[r.nama] = { status: 'Tidak Hadir', masuk: false, pulang: false };
          }
          
          if (r.jenis === 'Masuk') {
            if (personStats[r.nama].status === 'Tidak Hadir') {
              personStats[r.nama].status = r.status || 'Hadir'; // 'Tepat Waktu' or 'Terlambat'
            }
            personStats[r.nama].masuk = true;
          } else if (r.jenis === 'Pulang') {
            personStats[r.nama].pulang = true;
            if ((r.status || '').toLowerCase() === 'pulang cepat') {
              personStats[r.nama].status = 'Pulang Cepat';
            }
          } else if (r.jenis === 'Izin') {
            personStats[r.nama].status = 'Izin';
          } else if (r.jenis === 'Sakit') {
            personStats[r.nama].status = 'Sakit';
          }

          const isIzinSakit = (r.jenis === 'Izin' || r.jenis === 'Sakit');
          const bc = (r.status === 'Terlambat' || r.status === 'Pulang Cepat') 
            ? 'badge badge-danger' : (isIzinSakit ? 'badge' : 'badge badge-success');
          const bgCustom = isIzinSakit ? 'style="background:rgba(59,130,246,0.15);color:#60A5FA;"' : '';
          const jc = r.jenis === 'Masuk' ? 'badge badge-neutral' : (r.jenis === 'Pulang' ? 'badge badge-info' : 'badge badge-warning');
              
          return `
            <tr class="hover:bg-white/[0.02] transition-colors">
              <td class="whitespace-nowrap text-xs text-white/50">${r.waktu.split(' ')[1] || r.waktu}</td>
              <td>
                <div class="font-semibold text-white text-sm">${r.nama}</div>
                <div class="text-[10px] text-white/30 truncate max-w-[140px]">${r.unit}</div>
              </td>
              <td><span class="${jc}">${r.jenis}</span></td>
              <td><span class="${bc}" ${bgCustom}>${r.status}</span></td>
            </tr>
          `;
        }).join('');
      }

      if (tb) tb.innerHTML = liveLogHTML;

      // Calculate final metrics from personStats
      let hadir = 0, uniqueTelat = 0, izinSakitApproved = 0, absenCount = 0, belumPulang = 0;
      
      Object.values(personStats).forEach(p => {
        const s = p.status.toLowerCase();
        if (s === 'tepat waktu' || s === 'hadir') {
          hadir++;
        } else if (s === 'terlambat' || s === 'pulang cepat') { 
          hadir++; 
          uniqueTelat++; 
        } else if (s === 'izin' || s === 'sakit' || s === 'tugas keluar' || s === 'cuti') {
          izinSakitApproved++;
          absenCount++; // Masukkan ke dalam total Ketidakhadiran agar sinkron dengan Laporan
        } else {
          absenCount++;
        }
        
        if (p.masuk && !p.pulang) {
          belumPulang++;
        }
      });

      const totalPegawai = Object.keys(personStats).length;

      // Fallback: If we couldn't differentiate at all, display total for both
      if (totalGuru === 0 && totalKaryawan > 0) {
        totalGuru = totalPegawai;
        totalKaryawan = totalPegawai;
      }
      
      const totalEl = document.getElementById('stat-total');
      const guruEl = document.getElementById('stat-guru');
      if (totalEl) totalEl.innerText = (totalKaryawan > 0 && totalGuru !== totalKaryawan) ? totalKaryawan : totalPegawai;
      if (guruEl) guruEl.innerText = (totalGuru > 0 && totalGuru !== totalKaryawan) ? totalGuru : totalPegawai;
      
      const hadirEl = document.getElementById('stat-hadir');
      const telatEl = document.getElementById('stat-telat');
      const belumPulangEl = document.getElementById('stat-belum-pulang');
      
      if (hadirEl) hadirEl.innerText = hadir;
      if (telatEl) telatEl.innerText = uniqueTelat;
      if (belumPulangEl) belumPulangEl.innerText = belumPulang;
      
      // Update sidebar if exists
      const rsHadir = document.getElementById('rs-hadir');
      const rsTelat = document.getElementById('rs-telat');
      if (rsHadir) rsHadir.textContent = hadir;
      if (rsTelat) rsTelat.textContent = uniqueTelat;

      // --- 3. Process Izin Pending ---
      const tbIzin = document.getElementById('tabelPending');
      const countEl = document.getElementById('pendingCount');
      const statIzinEl = document.getElementById('stat-izin');
      const rsIzin = document.getElementById('rs-izin');
      
      const izinCount = dIzin.length || 0;
      
      if (countEl) countEl.textContent = izinCount + ' menunggu';
      if (statIzinEl) statIzinEl.innerText = izinCount;
      if (rsIzin) rsIzin.textContent = izinCount;
      
      if (tbIzin) {
        if (!izinCount) { 
          tbIzin.innerHTML = `
            <div class="empty-state py-8">
              <div class="empty-icon w-12 h-12"><i data-lucide="inbox" class="w-5 h-5"></i></div>
              <div class="empty-title text-xs">Tidak ada pengajuan</div>
            </div>`;
        } else {
          tbIzin.innerHTML = dIzin.map(r => `
            <div class="bg-black/20 hover:bg-black/30 rounded-xl p-3.5 border border-white/[0.04] hover:border-white/[0.08] transition-all text-sm group">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-bold text-white text-[13px] group-hover:text-[#FBBF24] transition-colors">${r.nama}</div>
                  <div class="text-[10px] text-white/30">${r.waktu} • ${r.unit}</div>
                </div>
                <span class="badge badge-warning text-[8px]">${r.jenis}</span>
              </div>
              <p class="text-xs text-white/50 bg-white/[0.03] p-2.5 rounded-lg mb-2.5 italic">"${r.ket || '-'}"</p>
              <div class="flex gap-2">
                <button onclick="window.pages.prosesIzin(${r.rowIndex}, 'Disetujui')" class="flex-1 py-2 bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#4ADE80] border border-[#22C55E]/20 rounded-lg text-[10px] font-bold transition-all">Setujui</button>
                <button onclick="window.pages.prosesIzin(${r.rowIndex}, 'Ditolak')" class="flex-1 py-2 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#F87171] border border-[#EF4444]/20 rounded-lg text-[10px] font-bold transition-all">Tolak</button>
              </div>
            </div>
          `).join('');
        }
      }
      
      // --- 4. Final Percentage Math ---
      const persenEl = document.getElementById('stat-persen');
      const absenEl = document.getElementById('stat-absen');
      
      if (absenEl) absenEl.innerText = absenCount;
      
      if (persenEl && totalPegawai > 0) {
        const persen = Math.round((hadir / totalPegawai) * 100);
        persenEl.innerText = persen + '%';
      } else if (persenEl) {
        persenEl.innerText = '0%';
      }
      
      // 5. Update Donut Chart
      // Kurangi absenCount dengan izinSakitApproved untuk chart agar tidak terhitung ganda (karena sudah dijumlahkan di absenCount sebelumnya)
      updateStatusChart(Math.max(0, hadir - uniqueTelat), uniqueTelat, izinSakitApproved, Math.max(0, absenCount - izinSakitApproved));

      if (window.lucide) window.lucide.createIcons();
    } catch(e) {
      console.error("Dashboard Data Sync Error:", e);
    }
  }

  // ═══ Charts ═══
  async function initWeeklyChart() {
    const ctx = document.getElementById('chart-weekly');
    if (!ctx) return;
    
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    // Build last 7 days date keys
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push({
        key: d.toISOString().split('T')[0], // YYYY-MM-DD
        label: dayNames[d.getDay()] + ' ' + d.getDate()
      });
    }
    
    const labels = last7.map(d => d.label);
    let hadirData = new Array(7).fill(0);
    let telatData = new Array(7).fill(0);
    
    // Try to fetch real data
    try {
      const startDate = last7[0].key;
      const endDate = last7[last7.length - 1].key;
      const rawLaporan = await window.api.getLaporanRentangAdmin(startDate, endDate);
      const dateMap = {};
      last7.forEach((d, i) => { dateMap[d.key] = i; });
      
      rawLaporan.forEach(r => {
        if (!r.waktu) return;
        const datePart = String(r.waktu).split(' ')[0];
        if (dateMap[datePart] !== undefined) {
          if (r.jenis === 'Masuk') {
            hadirData[dateMap[datePart]]++;
            if (r.status === 'Terlambat' || r.status === 'Pulang Cepat') {
              telatData[dateMap[datePart]]++;
            }
          }
        }
      });
    } catch(e) {
      console.error('Weekly chart data error:', e);
    }
    
    chartWeekly = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Hadir',
            data: hadirData,
            borderColor: '#14B88A',
            backgroundColor: 'rgba(20,184,138,0.1)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#14B88A',
            pointBorderColor: '#102B22',
            pointBorderWidth: 2,
          },
          {
            label: 'Terlambat',
            data: telatData,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245,158,11,0.05)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#F59E0B',
            pointBorderColor: '#102B22',
            pointBorderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, weight: 600 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.03)' },
            ticks: { font: { size: 10 }, stepSize: 10 }
          }
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            backgroundColor: 'rgba(11,26,20,0.9)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            titleFont: { size: 12, weight: 700 },
            bodyFont: { size: 11 }
          }
        }
      }
    });
  }

  function updateStatusChart(hadir, telat, izin = 0, absen = 0) {
    const ctx = document.getElementById('chart-status');
    if (!ctx) return;
    
    if (chartStatus) {
      chartStatus.data.datasets[0].data = [hadir, telat, izin, absen];
      chartStatus.update();
      return;
    }
    
    chartStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Tepat Waktu', 'Terlambat', 'Izin/Sakit', 'Tidak Hadir'],
        datasets: [{
          data: [hadir, telat, izin, absen],
          backgroundColor: ['#14B88A', '#F59E0B', '#3B82F6', '#EF4444'],
          borderColor: '#102B22',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 12, font: { size: 10 } } },
          tooltip: {
            backgroundColor: 'rgba(11,26,20,0.9)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12
          }
        }
      }
    });
  }

  // ═══ Process Izin ═══
  window.pages.prosesIzin = async function(rowIndex, status) {
    window.ui.showLoading("Memproses...");
    try {
      const res = await window.api.prosesIzin({ rowIndex, status, adminEmail });
      window.ui.hideLoading();
      window.ui.showToast(status === 'Disetujui' ? '✅' : '❌', res.message, status === 'Disetujui');
      refreshDashboardData();
    } catch(e) {
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memproses', false);
    }
  };
  
  // ═══ Download CSV ═══
  window.pages.downloadCSV = async function() {
    const btn = document.getElementById('btnDl');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> Menyiapkan...';
    try {
      const data = await window.api.getAllLogAdmin(adminEmail);
      let csv = 'data:text/csv;charset=utf-8,' + data.map(r => r.map(c => '"'+c+'"').join(',')).join('\r\n');
      let a = document.createElement('a');
      a.setAttribute('href', encodeURI(csv));
      a.setAttribute('download', 'Laporan_Absensi_Hidayatullah.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch(e) {
      window.ui.showToast('⚠️', 'Gagal mengunduh CSV', false);
    } finally {
      btn.innerHTML = oldText;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  // ═══ Initialize ═══
  refreshDashboardData();
  initWeeklyChart();
  
  // Auto-refresh
  let refreshInterval = setInterval(() => {
    if (window.router.currentRoute !== 'dashboard') {
      clearInterval(refreshInterval);
      return;
    }
    refreshDashboardData();
  }, 30000);
  
  if (window.lucide) window.lucide.createIcons();
};
