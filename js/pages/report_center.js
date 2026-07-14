/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Report Center
 * Hub for all 18 report types
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderReportCenter = function() {
  const reports = [
    { id: 'daily',         icon: 'calendar-check', color: '#14B88A', title: 'Laporan Harian',            desc: 'Rekap absensi per hari' },
    { id: 'weekly',        icon: 'calendar-range',  color: '#3B82F6', title: 'Laporan Mingguan',          desc: 'Rekap absensi per minggu' },
    { id: 'monthly',       icon: 'calendar',        color: '#8B5CF6', title: 'Laporan Bulanan',           desc: 'Rekap lengkap per bulan', featured: true },
    { id: 'yearly',        icon: 'calendar-clock',  color: '#EC4899', title: 'Laporan Tahunan',           desc: 'Ringkasan absensi tahunan' },
    { id: 'emp-history',   icon: 'user-search',     color: '#F59E0B', title: 'Riwayat Karyawan',          desc: 'Detail per individu karyawan' },
    { id: 'teacher-history',icon: 'graduation-cap', color: '#14B88A', title: 'Riwayat Guru',              desc: 'Detail per individu guru' },
    { id: 'late',          icon: 'alarm-clock',     color: '#EF4444', title: 'Laporan Keterlambatan',     desc: 'Analisis jam datang terlambat' },
    { id: 'absent',        icon: 'user-x',          color: '#DC2626', title: 'Laporan Ketidakhadiran',    desc: 'Pegawai yang tidak masuk' },
    { id: 'permission',    icon: 'clipboard-list',  color: '#F59E0B', title: 'Laporan Izin',              desc: 'Rekap pengajuan izin' },
    { id: 'sick',          icon: 'heart-pulse',     color: '#06B6D4', title: 'Laporan Sakit',             desc: 'Rekap absen sakit' },
    { id: 'performance',   icon: 'trending-up',     color: '#22C55E', title: 'Performa Kehadiran',        desc: 'Skor disiplin kehadiran' },
    { id: 'compare-unit',  icon: 'git-compare-arrows',color:'#8B5CF6',title:'Perbandingan Unit',          desc: 'Bandingkan antar unit sekolah' },
    { id: 'compare-month', icon: 'arrow-left-right',color: '#3B82F6', title: 'Perbandingan Bulan',        desc: 'Tren kehadiran antar bulan' },
    { id: 'compare-year',  icon: 'bar-chart-3',     color: '#14B88A', title: 'Perbandingan Tahun',        desc: 'Tren kehadiran antar tahun' },
    { id: 'top-discipline',icon: 'trophy',           color: '#EAB308', title: 'Pegawai Terdisiplin',       desc: 'Ranking kedisiplinan' },
    { id: 'attention',     icon: 'alert-triangle',  color: '#EF4444', title: 'Perlu Perhatian',           desc: 'Pegawai indisipliner' },
    { id: 'executive',     icon: 'briefcase',       color: '#1E293B', title: 'Laporan Eksekutif',         desc: 'Ringkasan untuk pimpinan' },
    { id: 'foundation',    icon: 'building',        color: '#14B88A', title: 'Dashboard Yayasan',         desc: 'Overview seluruh yayasan' },
  ];

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Laporan & Analitik</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Pusat Laporan</h1>
          <p class="text-sm text-white/40 mt-1">Pilih jenis laporan untuk menganalisis data kehadiran</p>
        </div>
        <div class="flex gap-2 no-print">
          <button onclick="window.router.navigateTo('report-monthly')" class="btn-primary">
            <i data-lucide="file-bar-chart" class="w-4 h-4"></i>
            Laporan Bulanan
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-white">${reports.length}</div>
          <div class="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">Jenis Laporan</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-[#14B88A]">5</div>
          <div class="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">Unit Sekolah</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-[#3B82F6]">PDF</div>
          <div class="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">Export Format</div>
        </div>
        <div class="glass-card p-4 text-center">
          <div class="text-2xl font-black text-[#F59E0B]">A4</div>
          <div class="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-1">Print Ready</div>
        </div>
      </div>

      <!-- Report Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
        ${reports.map(r => `
          <div onclick="${r.id === 'monthly' ? "window.router.navigateTo('report-monthly')" : `window.ui.showToast('📊', 'Laporan ${r.title} sedang dikembangkan', true)`}" 
               class="glass-card p-5 cursor-pointer group hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${r.featured ? 'ring-1 ring-[#14B88A]/30' : ''}">
            ${r.featured ? '<div class="absolute top-3 right-3"><span class="badge badge-primary text-[8px]">Tersedia</span></div>' : ''}
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style="background:${r.color}15; border:1px solid ${r.color}25;">
                <i data-lucide="${r.icon}" class="w-5 h-5" style="color:${r.color}"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-bold text-white group-hover:text-[#14B88A] transition-colors">${r.title}</h3>
                <p class="text-[11px] text-white/30 mt-0.5">${r.desc}</p>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-white/10 group-hover:text-white/30 group-hover:translate-x-1 transition-all shrink-0 mt-1"></i>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
};

window.pages.initReports = function() {
  if (window.lucide) window.lucide.createIcons();
};
