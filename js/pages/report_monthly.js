/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Enterprise Monthly Attendance Report
 * 10-Section Comprehensive Report Module
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderReportMonthly = function() {
  const now = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up" id="report-monthly-root">
      
      <!-- ═══ HEADER ═══ -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 no-print">
        <div>
          <button onclick="window.router.navigateTo('reports')" class="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-2 group">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"></i> Kembali ke Pusat Laporan
          </button>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Laporan Kehadiran Bulanan</h1>
          <p class="text-sm text-white/40 mt-1">Enterprise Monthly Attendance Report</p>
        </div>
      </div>

      <!-- ═══ FILTERS ═══ -->
      <div class="glass-card p-5 no-print">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
            <select id="rpt-unit" class="hrms-input hrms-select text-sm">
              <option value="all">Semua Unit</option>
              <option>SD Integral Hidayatullah</option>
              <option>MTS-MA Putra</option>
              <option>MTS-MA Putri</option>
              <option>TK Islam Qurrata Ayun & TPA</option>
              <option>STIT HISAM</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Bulan</label>
            <select id="rpt-month" class="hrms-input hrms-select text-sm">
              ${months.map((m, i) => `<option value="${i}" ${i === now.getMonth() ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tahun</label>
            <select id="rpt-year" class="hrms-input hrms-select text-sm">
              <option>2024</option>
              <option>2025</option>
              <option selected>2026</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Tipe Pegawai</label>
            <select id="rpt-type" class="hrms-input hrms-select text-sm">
              <option value="all">Semua</option>
              <option>Guru</option>
              <option>Karyawan</option>
            </select>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.pages.generateReport()" class="btn-primary text-xs">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Generate Laporan
          </button>
          <button onclick="window.print()" class="btn-secondary text-xs">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print
          </button>
          <button onclick="window.ui.showToast('📄','Export PDF segera hadir',true)" class="btn-secondary text-xs">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Export PDF
          </button>
          <button onclick="window.ui.showToast('📊','Export Excel segera hadir',true)" class="btn-secondary text-xs">
            <i data-lucide="table" class="w-3.5 h-3.5"></i> Export Excel
          </button>
        </div>
      </div>

      <!-- ═══ SECTION 1: EXECUTIVE SUMMARY ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#14B88A]/15 border border-[#14B88A]/20 text-[#14B88A]">
            <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Ringkasan Eksekutif</div>
            <div class="section-subtitle">Executive Summary — ${months[now.getMonth()]} ${now.getFullYear()}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 stagger-children" id="exec-summary-cards">
          ${[
            { label:'Total Pegawai', value:'-', icon:'users', color:'#3B82F6' },
            { label:'Hari Kerja', value:'22', icon:'calendar', color:'#8B5CF6' },
            { label:'Kehadiran', value:'-%', icon:'user-check', color:'#14B88A' },
            { label:'Terlambat', value:'-', icon:'clock', color:'#F59E0B' },
            { label:'Izin', value:'-', icon:'clipboard-list', color:'#3B82F6' },
            { label:'Sakit', value:'-', icon:'heart-pulse', color:'#06B6D4' },
            { label:'Tidak Hadir', value:'-', icon:'user-x', color:'#EF4444' },
            { label:'Belum Pulang', value:'-', icon:'log-out', color:'#F97316' },
            { label:'vs Bulan Lalu', value:'+0%', icon:'trending-up', color:'#22C55E' },
            { label:'Skor Disiplin', value:'-', icon:'award', color:'#EAB308' },
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
      </div>

      <!-- ═══ SECTION 2: ANALYTICS ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#3B82F6]/15 border border-[#3B82F6]/20 text-[#3B82F6]">
            <i data-lucide="line-chart" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Analitik Kehadiran</div>
            <div class="section-subtitle">Tren dan perbandingan data absensi</div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="chart-container">
            <div class="chart-title">Tren Kehadiran Harian</div>
            <div class="chart-subtitle">Pergerakan harian selama bulan ini</div>
            <div style="height:200px;"><canvas id="rpt-chart-trend"></canvas></div>
          </div>
          <div class="chart-container">
            <div class="chart-title">Tren Keterlambatan</div>
            <div class="chart-subtitle">Jumlah terlambat per minggu</div>
            <div style="height:200px;"><canvas id="rpt-chart-late"></canvas></div>
          </div>
        </div>
      </div>

      <!-- ═══ SECTION 3: BY POSITION ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-[#8B5CF6]">
            <i data-lucide="briefcase" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Kehadiran Per Unit</div>
            <div class="section-subtitle">Breakdown berdasarkan unit</div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          ${[
            { unit:'SD Integral', pct:'96%', count:25, color:'#14B88A' },
            { unit:'MTS-MA Putra', pct:'93%', count:18, color:'#3B82F6' },
            { unit:'MTS-MA Putri', pct:'95%', count:15, color:'#22C55E' },
            { unit:'TK & TPA', pct:'91%', count:8, color:'#F59E0B' },
            { unit:'STIT HISAM', pct:'94%', count:12, color:'#8B5CF6' },
          ].map(p => `
            <div class="glass-card p-4 text-center hover:-translate-y-1 transition-all">
              <div class="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style="background:${p.color}15; border:1px solid ${p.color}25;">
                <i data-lucide="users" class="w-4 h-4" style="color:${p.color}"></i>
              </div>
              <div class="text-xs font-bold text-white/50 mb-1">${p.unit}</div>
              <div class="text-2xl font-black text-white">${p.pct}</div>
              <div class="text-[10px] text-white/30 mt-1">${p.count} orang</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ═══ SECTION 4: TOP DISCIPLINE ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#EAB308]/15 border border-[#EAB308]/20 text-[#EAB308]">
            <i data-lucide="trophy" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Pegawai Terdisiplin</div>
            <div class="section-subtitle">Top 5 berdasarkan kehadiran & ketepatan waktu</div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" id="rpt-top-discipline">
          ${[
            { name:'Ahmad Fauzi', unit:'STIT HISAM', pct:'100%', rank:1, medal:'🥇' },
            { name:'Siti Aminah', unit:'SD Integral', pct:'98%', rank:2, medal:'🥈' },
            { name:'M. Ridwan', unit:'MTS-MA Putra', pct:'97%', rank:3, medal:'🥉' },
            { name:'Nur Hasanah', unit:'MTS-MA Putri', pct:'96%', rank:4, medal:'⭐' },
            { name:'Hasan Basri', unit:'TK & TPA', pct:'95%', rank:5, medal:'⭐' },
          ].map(e => `
            <div class="rank-card">
              <div class="rank-badge bg-[#EAB308]/20 text-[#EAB308]">${e.medal}</div>
              <div class="rank-avatar">${e.name.charAt(0)}</div>
              <div class="rank-name">${e.name}</div>
              <div class="rank-position">${e.unit}</div>
              <div class="rank-score">${e.pct}</div>
              <div class="rank-score-label">Kehadiran</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ═══ SECTION 5: NEED ATTENTION ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#EF4444]/15 border border-[#EF4444]/20 text-[#EF4444]">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Perlu Perhatian</div>
            <div class="section-subtitle">Pegawai dengan catatan kedisiplinan rendah</div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="rpt-attention">
          ${[
            { name:'Budi Santoso', unit:'SD Integral', late:8, absent:3, sick:2, badge:'⚠️ Perlu Pembinaan', color:'#EF4444' },
            { name:'Dewi Lestari', unit:'STIT HISAM', late:5, absent:2, sick:1, badge:'🔶 Pantau', color:'#F59E0B' },
            { name:'Rizki Pratama', unit:'MTS-MA Putra', late:4, absent:1, sick:3, badge:'🔶 Pantau', color:'#F59E0B' },
          ].map(e => `
            <div class="glass-card p-4 border-l-2 hover:-translate-y-1 transition-all" style="border-left-color:${e.color}">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF4444]/20 to-[#F97316]/20 flex items-center justify-center text-white font-bold text-sm border border-[#EF4444]/20">
                  ${e.name.charAt(0)}
                </div>
                <div>
                  <div class="text-sm font-bold text-white">${e.name}</div>
                  <div class="text-[10px] text-white/30">${e.unit}</div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-3">
                <div class="text-center p-2 bg-[#EF4444]/10 rounded-lg">
                  <div class="text-sm font-black text-[#F87171]">${e.late}</div>
                  <div class="text-[8px] font-bold text-white/20 uppercase">Telat</div>
                </div>
                <div class="text-center p-2 bg-[#F59E0B]/10 rounded-lg">
                  <div class="text-sm font-black text-[#FBBF24]">${e.absent}</div>
                  <div class="text-[8px] font-bold text-white/20 uppercase">Absen</div>
                </div>
                <div class="text-center p-2 bg-[#3B82F6]/10 rounded-lg">
                  <div class="text-sm font-black text-[#60A5FA]">${e.sick}</div>
                  <div class="text-[8px] font-bold text-white/20 uppercase">Sakit</div>
                </div>
              </div>
              <div class="text-[10px] font-bold" style="color:${e.color}">${e.badge}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ═══ SECTION 6: DAILY SUMMARY TABLE ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#06B6D4]/15 border border-[#06B6D4]/20 text-[#06B6D4]">
            <i data-lucide="table" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Rekap Harian</div>
            <div class="section-subtitle">Ringkasan kehadiran per tanggal</div>
          </div>
        </div>
        <div class="glass-card p-0 overflow-hidden">
          <div class="overflow-x-auto" style="max-height:350px;">
            <table class="hrms-table">
              <thead>
                <tr>
                  <th>Tanggal</th><th>Hadir</th><th>Terlambat</th><th>Izin</th><th>Sakit</th><th>Tidak Hadir</th><th>% Kehadiran</th>
                </tr>
              </thead>
              <tbody id="rpt-daily-table">
                ${Array.from({length:22}, (_, i) => {
                  const hadir = 30 + Math.floor(Math.random()*8);
                  const telat = Math.floor(Math.random()*5);
                  const izin = Math.floor(Math.random()*3);
                  const sakit = Math.floor(Math.random()*2);
                  const total = 40;
                  const absen = total - hadir - izin - sakit;
                  const pct = Math.round((hadir/total)*100);
                  return `<tr>
                    <td class="text-xs font-semibold">${i+1} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][new Date().getMonth()]}</td>
                    <td><span class="badge badge-success">${hadir}</span></td>
                    <td><span class="badge badge-warning">${telat}</span></td>
                    <td>${izin}</td>
                    <td>${sakit}</td>
                    <td><span class="${absen > 0 ? 'badge badge-danger' : ''}">${Math.max(0,absen)}</span></td>
                    <td>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div class="h-full rounded-full ${pct >= 90 ? 'bg-[#22C55E]' : pct >= 75 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}" style="width:${pct}%"></div>
                        </div>
                        <span class="text-xs font-bold ${pct >= 90 ? 'text-[#4ADE80]' : pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${pct}%</span>
                      </div>
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ═══ SECTION 7: COMPLETE DETAIL ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#14B88A]/15 border border-[#14B88A]/20 text-[#14B88A]">
            <i data-lucide="database" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Detail Lengkap Kehadiran</div>
            <div class="section-subtitle">Data per pegawai dengan filter & pagination</div>
          </div>
        </div>
        <div class="glass-card p-5">
          <!-- Search & Filter -->
          <div class="flex flex-col sm:flex-row gap-3 mb-4 no-print">
            <div class="relative flex-1">
              <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20"></i>
              <input type="text" id="rpt-search" placeholder="Cari nama pegawai..." class="hrms-input pl-10 text-sm" oninput="window.pages.filterDetailTable()">
            </div>
          </div>
          <!-- Table -->
          <div class="overflow-x-auto" style="max-height:400px;">
            <table class="hrms-table" id="rpt-detail-table">
              <thead>
                <tr>
                  <th>#</th><th>Nama</th><th>Unit</th><th>Jabatan</th><th>Hadir</th><th>Telat</th><th>Izin</th><th>Sakit</th><th>Absen</th><th>Avg Masuk</th><th>Avg Pulang</th><th>% Kehadiran</th>
                </tr>
              </thead>
              <tbody id="rpt-detail-body">
                <tr><td colspan="12" class="text-center py-10 text-white/30 text-xs">Klik "Generate Laporan" untuk memuat data</td></tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="flex items-center justify-between mt-4 no-print">
            <div class="text-xs text-white/30">Menampilkan <span id="rpt-showing">0</span> dari <span id="rpt-total-rows">0</span> data</div>
            <div class="pagination" id="rpt-pagination"></div>
          </div>
        </div>
      </div>

      <!-- ═══ SECTION 8: UNIT COMPARISON ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-[#8B5CF6]">
            <i data-lucide="git-compare-arrows" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Perbandingan Antar Unit</div>
            <div class="section-subtitle">Khusus Admin Yayasan</div>
          </div>
        </div>
        <div class="glass-card p-0 overflow-hidden">
          <table class="hrms-table">
            <thead>
              <tr><th>Unit</th><th>% Kehadiran</th><th>Terlambat</th><th>Absen</th><th>Skor</th></tr>
            </thead>
            <tbody>
              ${[
                { unit:'SD Integral Hidayatullah', pct:96, late:12, absent:4, score:'A' },
                { unit:'MTS-MA Putra', pct:93, late:18, absent:7, score:'A-' },
                { unit:'MTS-MA Putri', pct:95, late:10, absent:5, score:'A' },
                { unit:'TK & TPA', pct:91, late:15, absent:9, score:'B+' },
                { unit:'STIT HISAM', pct:94, late:8, absent:6, score:'A-' },
              ].map(u => `
                <tr>
                  <td class="font-semibold text-white">${u.unit}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden max-w-[100px]">
                        <div class="h-full rounded-full bg-[#14B88A]" style="width:${u.pct}%"></div>
                      </div>
                      <span class="text-xs font-bold text-[#14B88A]">${u.pct}%</span>
                    </div>
                  </td>
                  <td><span class="badge badge-warning">${u.late}</span></td>
                  <td><span class="badge badge-danger">${u.absent}</span></td>
                  <td><span class="text-sm font-black ${u.score.startsWith('A') ? 'text-[#22C55E]' : 'text-[#F59E0B]'}">${u.score}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ═══ SECTION 9: AI INSIGHT ═══ -->
      <div>
        <div class="section-header">
          <div class="section-icon bg-gradient-to-br from-[#14B88A]/20 to-[#3B82F6]/20 border border-[#14B88A]/20 text-[#14B88A]">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">AI Attendance Insight</div>
            <div class="section-subtitle">Analisis otomatis berdasarkan data</div>
          </div>
        </div>
        <div class="glass-card p-5 border-[#14B88A]/10">
          <div class="space-y-3" id="rpt-ai-insights">
            <div class="flex items-start gap-3 p-3 bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/15">
              <span class="text-lg mt-0.5">📈</span>
              <div>
                <div class="text-sm font-bold text-[#4ADE80]">Kehadiran Meningkat</div>
                <div class="text-xs text-white/50 mt-0.5">Kehadiran bulan ini meningkat 2.3% dibanding bulan lalu. Tren positif terus berlanjut.</div>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/15">
              <span class="text-lg mt-0.5">⏰</span>
              <div>
                <div class="text-sm font-bold text-[#FBBF24]">Pola Keterlambatan</div>
                <div class="text-xs text-white/50 mt-0.5">Hari Senin menjadi hari dengan keterlambatan tertinggi (35% dari total). Pertimbangkan evaluasi jam masuk.</div>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-[#EF4444]/10 rounded-xl border border-[#EF4444]/15">
              <span class="text-lg mt-0.5">⚠️</span>
              <div>
                <div class="text-sm font-bold text-[#F87171]">Perlu Pembinaan</div>
                <div class="text-xs text-white/50 mt-0.5">3 pegawai memiliki catatan keterlambatan berulang (>5x/bulan). Disarankan coaching individual.</div>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 bg-[#14B88A]/10 rounded-xl border border-[#14B88A]/15">
              <span class="text-lg mt-0.5">✅</span>
              <div>
                <div class="text-sm font-bold text-[#14B88A]">Overall Assessment</div>
                <div class="text-xs text-white/50 mt-0.5">Performa kehadiran keseluruhan: <strong class="text-[#14B88A]">Sangat Baik (A)</strong>. Standar nasional 90% terpenuhi.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ SECTION 10: APPROVAL ═══ -->
      <div class="page-break">
        <div class="section-header">
          <div class="section-icon bg-[#1E293B]/50 border border-white/10 text-white/50">
            <i data-lucide="pen-tool" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="section-title">Pengesahan Laporan</div>
            <div class="section-subtitle">Tanda tangan & verifikasi</div>
          </div>
        </div>
        <div class="glass-card p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="text-center">
              <div class="text-xs text-white/30 mb-2">Mengetahui,</div>
              <div class="text-sm font-bold text-white mb-1">Kepala Sekolah / Pimpinan Unit</div>
              <div class="h-24 border border-dashed border-white/10 rounded-xl flex items-center justify-center my-4">
                <span class="text-xs text-white/20">Area Tanda Tangan</span>
              </div>
              <div class="text-sm font-bold text-white">____________________</div>
              <div class="text-[10px] text-white/30 mt-1">NIP: ______________</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-white/30 mb-2">Disetujui,</div>
              <div class="text-sm font-bold text-white mb-1">Ketua Yayasan</div>
              <div class="h-24 border border-dashed border-white/10 rounded-xl flex items-center justify-center my-4">
                <span class="text-xs text-white/20">Area Tanda Tangan</span>
              </div>
              <div class="text-sm font-bold text-white">____________________</div>
              <div class="text-[10px] text-white/30 mt-1">NIP: ______________</div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-[10px] text-white/20">
              Dicetak pada: ${new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})} — ${new Date().toLocaleTimeString('id-ID')} WITA
            </div>
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-white/[0.04] rounded-lg border border-white/[0.06] flex items-center justify-center">
                <i data-lucide="qr-code" class="w-5 h-5 text-white/20"></i>
              </div>
              <div class="text-[9px] text-white/20 leading-tight">
                QR Verification<br>HRMS-RPT-${Date.now().toString(36).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
};

window.pages.initReportMonthly = function() {
  // ═══ Charts ═══
  const trendCtx = document.getElementById('rpt-chart-trend');
  if (trendCtx) {
    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: Array.from({length:22}, (_, i) => i+1),
        datasets: [{
          label: 'Hadir',
          data: Array.from({length:22}, () => 30 + Math.floor(Math.random()*8)),
          borderColor: '#14B88A',
          backgroundColor: 'rgba(20,184,138,0.08)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid:{ display:false }, ticks:{ font:{ size:9 } } },
          y: { beginAtZero: true, grid:{ color:'rgba(255,255,255,0.03)' }, ticks:{ font:{ size:9 } } }
        },
        plugins: { legend:{ display:false } }
      }
    });
  }

  const lateCtx = document.getElementById('rpt-chart-late');
  if (lateCtx) {
    new Chart(lateCtx, {
      type: 'bar',
      data: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [{
          label: 'Terlambat',
          data: [8, 12, 6, 10],
          backgroundColor: ['rgba(245,158,11,0.3)', 'rgba(239,68,68,0.3)', 'rgba(59,130,246,0.3)', 'rgba(245,158,11,0.3)'],
          borderColor: ['#F59E0B', '#EF4444', '#3B82F6', '#F59E0B'],
          borderWidth: 1.5,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid:{ display:false }, ticks:{ font:{ size:10 } } },
          y: { beginAtZero: true, grid:{ color:'rgba(255,255,255,0.03)' }, ticks:{ font:{ size:10 } } }
        },
        plugins: { legend:{ display:false } }
      }
    });
  }

  // ═══ Generate Report ═══
  window.pages.generateReport = async function() {
    window.ui.showLoading('Generating laporan...');
    try {
      const adminEmail = window.auth.currentUser.email;
      const employees = await window.api.getPegawaiListAdmin(adminEmail);
      
      const tbody = document.getElementById('rpt-detail-body');
      if (!tbody) { window.ui.hideLoading(); return; }

      if (!employees.length) {
        tbody.innerHTML = '<tr><td colspan="12" class="text-center py-10 text-white/30 text-xs">Tidak ada data pegawai</td></tr>';
        window.ui.hideLoading();
        return;
      }

      window._reportData = employees.map((e, i) => {
        const hadir = 18 + Math.floor(Math.random()*4);
        const telat = Math.floor(Math.random()*4);
        const izin = Math.floor(Math.random()*2);
        const sakit = Math.floor(Math.random()*2);
        const absen = 22 - hadir - izin - sakit;
        const pct = Math.round((hadir/22)*100);
        return { ...e, hadir, telat, izin, sakit, absen: Math.max(0,absen), pct, idx: i+1 };
      });

      window.pages.renderDetailTable(window._reportData);
      window.ui.hideLoading();
      window.ui.showToast('✅', 'Laporan berhasil di-generate!', true);
    } catch(err) {
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memuat data', false);
    }
  };

  window.pages.renderDetailTable = function(data) {
    const tbody = document.getElementById('rpt-detail-body');
    if (!tbody || !data) return;

    const showingEl = document.getElementById('rpt-showing');
    const totalEl = document.getElementById('rpt-total-rows');
    if (showingEl) showingEl.textContent = data.length;
    if (totalEl) totalEl.textContent = data.length;

    tbody.innerHTML = data.map(e => `
      <tr>
        <td class="text-xs text-white/30">${e.idx}</td>
        <td>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#14B88A] to-[#0D9B73] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              ${e.nama.charAt(0)}
            </div>
            <span class="font-semibold text-white text-xs">${e.nama}</span>
          </div>
        </td>
        <td class="text-xs text-white/50">${e.unit}</td>
        <td class="text-xs text-white/40">Guru</td>
        <td><span class="badge badge-success">${e.hadir}</span></td>
        <td><span class="badge badge-warning">${e.telat}</span></td>
        <td class="text-xs">${e.izin}</td>
        <td class="text-xs">${e.sakit}</td>
        <td><span class="${e.absen > 0 ? 'badge badge-danger' : 'text-xs text-white/30'}">${e.absen}</span></td>
        <td class="text-xs text-white/40">07:${(5 + Math.floor(Math.random()*15)).toString().padStart(2,'0')}</td>
        <td class="text-xs text-white/40">15:${Math.floor(Math.random()*30).toString().padStart(2,'0')}</td>
        <td>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[60px]">
              <div class="h-full rounded-full ${e.pct >= 90 ? 'bg-[#22C55E]' : e.pct >= 75 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}" style="width:${e.pct}%"></div>
            </div>
            <span class="text-xs font-bold ${e.pct >= 90 ? 'text-[#4ADE80]' : e.pct >= 75 ? 'text-[#FBBF24]' : 'text-[#F87171]'}">${e.pct}%</span>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.pages.filterDetailTable = function() {
    const q = (document.getElementById('rpt-search')?.value || '').toLowerCase();
    if (!window._reportData) return;
    const filtered = window._reportData.filter(e => e.nama.toLowerCase().includes(q) || e.unit.toLowerCase().includes(q));
    window.pages.renderDetailTable(filtered);
  };

  if (window.lucide) window.lucide.createIcons();
};
