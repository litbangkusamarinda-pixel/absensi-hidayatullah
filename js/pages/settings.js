/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Settings, Profile, Calendar, Announcements
 * Placeholder modules with enterprise UI/UX
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderSettings = function(section) {
  const sections = {
    announcements: renderAnnouncements,
    calendar: renderCalendar,
    profile: renderProfile,
    settings: renderSettingsPage,
  };
  return (sections[section] || renderSettingsPage)();
};

// ═══ INIT FUNCTIONS ═══
window.pages.initAnnouncements = function() { if (window.lucide) window.lucide.createIcons(); };
window.pages.initCalendar = function() { if (window.lucide) window.lucide.createIcons(); };
window.pages.initProfile = function() { 
  if (window.lucide) window.lucide.createIcons();
  const user = window.auth.currentUser;
  if (user) {
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const roleEl = document.getElementById('profile-role');
    const initialEl = document.getElementById('profile-initial');
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrator' : user.unit;
    if (initialEl) initialEl.textContent = user.name.charAt(0).toUpperCase();
  }
};
window.pages.initSettings = function() { if (window.lucide) window.lucide.createIcons(); };

// ═══════════════════════════════════════════════════════════
// ANNOUNCEMENTS PAGE
// ═══════════════════════════════════════════════════════════

function renderAnnouncements() {
  const announcements = [
    { id: 1, title: 'Rapat Yayasan Bulanan', date: '14 Juli 2026', priority: 'high', content: 'Seluruh kepala unit wajib hadir di Rapat Yayasan yang akan dilaksanakan hari Jumat pukul 14:00 WITA di Aula Utama.', author: 'Admin Yayasan' },
    { id: 2, title: 'Pelatihan Guru Semester 2', date: '20 Juli 2026', priority: 'medium', content: 'Workshop peningkatan kompetensi pedagogik untuk seluruh guru SD Integral dan MTS-MA.', author: 'Bidang Pendidikan' },
    { id: 3, title: 'Libur Tahun Ajaran Baru', date: '1 Agustus 2026', priority: 'low', content: 'Informasi jadwal libur dan persiapan tahun ajaran baru 2026/2027.', author: 'Admin Yayasan' },
    { id: 4, title: 'Evaluasi Kinerja Semester 1', date: '25 Juli 2026', priority: 'high', content: 'Penilaian kinerja semester 1 akan dilakukan mulai tanggal 25 Juli. Seluruh pegawai dimohon menyiapkan laporan kerja.', author: 'HRD' },
  ];

  const priorityConfig = {
    high: { badge: 'badge-danger', label: 'Penting', icon: '🔴' },
    medium: { badge: 'badge-warning', label: 'Sedang', icon: '🟡' },
    low: { badge: 'badge-info', label: 'Info', icon: '🔵' },
  };

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Communication</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Pengumuman</h1>
          <p class="text-sm text-white/40 mt-1">Informasi dan pengumuman penting untuk seluruh unit</p>
        </div>
        <button onclick="window.ui.showToast('📢','Fitur buat pengumuman segera hadir',true)" class="btn-primary text-xs no-print">
          <i data-lucide="plus" class="w-4 h-4"></i> Buat Pengumuman
        </button>
      </div>

      <div class="space-y-3 stagger-children">
        ${announcements.map(a => {
          const p = priorityConfig[a.priority];
          return `
            <div class="glass-card p-5 hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div class="flex items-start gap-4">
                <div class="text-2xl mt-1">${p.icon}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-sm font-bold text-white group-hover:text-[#14B88A] transition-colors">${a.title}</h3>
                    <span class="badge ${p.badge} text-[8px]">${p.label}</span>
                  </div>
                  <p class="text-xs text-white/40 mb-2">${a.content}</p>
                  <div class="flex items-center gap-3 text-[10px] text-white/25">
                    <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3 h-3"></i> ${a.date}</span>
                    <span class="flex items-center gap-1"><i data-lucide="user" class="w-3 h-3"></i> ${a.author}</span>
                  </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors shrink-0 mt-2"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// CALENDAR PAGE
// ═══════════════════════════════════════════════════════════

function renderCalendar() {
  const now = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const today = now.getDate();

  let calendarDays = '';
  for (let i = 0; i < firstDay; i++) calendarDays += '<div></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today;
    const isWeekend = (firstDay + d - 1) % 7 === 0 || (firstDay + d - 1) % 7 === 6;
    calendarDays += `
      <div class="text-center p-2 rounded-lg cursor-pointer transition-all hover:bg-white/[0.06] ${isToday ? 'bg-[#14B88A]/20 border border-[#14B88A]/30 font-bold text-[#14B88A]' : isWeekend ? 'text-white/20' : 'text-white/60'}">
        <div class="text-sm">${d}</div>
      </div>
    `;
  }

  const events = [
    { date: '14 Jul', title: 'Rapat Yayasan', type: 'meeting', color: '#EF4444' },
    { date: '20 Jul', title: 'Pelatihan Guru', type: 'training', color: '#3B82F6' },
    { date: '25 Jul', title: 'Evaluasi Kinerja', type: 'evaluation', color: '#F59E0B' },
    { date: '1 Agu', title: 'Tahun Ajaran Baru', type: 'academic', color: '#14B88A' },
  ];

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div>
        <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Schedule</p>
        <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Kalender Akademik</h1>
        <p class="text-sm text-white/40 mt-1">Jadwal kegiatan dan kalender kerja</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Calendar Grid -->
        <div class="lg:col-span-2 glass-card p-5">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-white">${months[now.getMonth()]} ${now.getFullYear()}</h2>
            <div class="flex gap-1">
              <button class="btn-icon"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
              <button class="btn-icon"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-1 mb-2">
            ${['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => `<div class="text-center text-[10px] font-bold text-white/25 uppercase py-2">${d}</div>`).join('')}
          </div>
          <div class="grid grid-cols-7 gap-1">
            ${calendarDays}
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="glass-card p-5">
          <h3 class="text-sm font-bold text-white mb-4">Agenda Mendatang</h3>
          <div class="space-y-3">
            ${events.map(e => `
              <div class="flex items-center gap-3 p-3 glass-surface rounded-xl hover:border-white/[0.1] transition-all cursor-pointer group">
                <div class="w-1 h-10 rounded-full" style="background:${e.color}"></div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-white group-hover:text-[#14B88A] transition-colors">${e.title}</div>
                  <div class="text-[10px] text-white/30">${e.date}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════

function renderProfile() {
  const user = window.auth.currentUser || { name: 'User', email: 'user@email.com', role: 'admin' };
  
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div>
        <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Account</p>
        <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Profil Saya</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Profile Card -->
        <div class="glass-card p-6 text-center">
          <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#14B88A] to-[#0D9B73] flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl shadow-[#14B88A]/20" id="profile-initial">
            ${user.name.charAt(0)}
          </div>
          <h2 class="text-lg font-bold text-white mb-1" id="profile-name">${user.name}</h2>
          <p class="text-xs text-white/40 mb-1" id="profile-email">${user.email}</p>
          <span class="badge badge-primary" id="profile-role">${user.role === 'admin' ? 'Administrator' : user.unit}</span>
          
          <div class="mt-6 pt-4 border-t border-white/[0.04] space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-white/30">Status</span>
              <span class="badge badge-success">Aktif</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-white/30">Bergabung</span>
              <span class="text-white/60">2024</span>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2 glass-card p-6">
          <h3 class="text-sm font-bold text-white mb-4">Informasi Pribadi</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Nama Lengkap</label>
              <input type="text" value="${user.name}" class="hrms-input text-sm" readonly>
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Email</label>
              <input type="email" value="${user.email}" class="hrms-input text-sm" readonly>
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Jabatan</label>
              <input type="text" value="${user.role === 'admin' ? 'Administrator' : 'Guru'}" class="hrms-input text-sm" readonly>
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Unit</label>
              <input type="text" value="${user.unit || 'Semua Unit'}" class="hrms-input text-sm" readonly>
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">No. Telepon</label>
              <input type="text" placeholder="Belum diisi" class="hrms-input text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1.5">Alamat</label>
              <input type="text" placeholder="Belum diisi" class="hrms-input text-sm">
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button onclick="window.ui.showToast('✅','Profil disimpan (demo)',true)" class="btn-primary text-xs">
              <i data-lucide="save" class="w-4 h-4"></i> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════

function renderSettingsPage() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      <div>
        <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">System</p>
        <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Pengaturan</h1>
        <p class="text-sm text-white/40 mt-1">Konfigurasi sistem dan preferensi</p>
      </div>

      <div class="space-y-4">
        <!-- General -->
        <div class="glass-card p-5">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i data-lucide="sliders" class="w-4 h-4 text-[#14B88A]"></i> Umum
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Organisasi</div>
                <div class="text-xs text-white/30">Yayasan Pondok Pesantren Hidayatullah Samarinda</div>
              </div>
              <span class="badge badge-primary">Aktif</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Bahasa</div>
                <div class="text-xs text-white/30">Bahasa Indonesia</div>
              </div>
              <span class="text-xs text-white/40">🇮🇩 ID</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Zona Waktu</div>
                <div class="text-xs text-white/30">WITA (UTC+8)</div>
              </div>
              <span class="text-xs text-white/40">Asia/Makassar</span>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="glass-card p-5">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i data-lucide="palette" class="w-4 h-4 text-[#8B5CF6]"></i> Tampilan
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Mode Gelap</div>
                <div class="text-xs text-white/30">Tampilan gelap saat ini aktif</div>
              </div>
              <div class="w-11 h-6 bg-[#14B88A] rounded-full relative cursor-pointer">
                <div class="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Animasi</div>
                <div class="text-xs text-white/30">Smooth transitions dan micro-interactions</div>
              </div>
              <div class="w-11 h-6 bg-[#14B88A] rounded-full relative cursor-pointer">
                <div class="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="glass-card p-5">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i data-lucide="bell" class="w-4 h-4 text-[#F59E0B]"></i> Notifikasi
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Notifikasi Push</div>
                <div class="text-xs text-white/30">Terima notifikasi absensi real-time</div>
              </div>
              <div class="w-11 h-6 bg-white/10 rounded-full relative cursor-pointer">
                <div class="w-5 h-5 bg-white/40 rounded-full absolute left-0.5 top-0.5 shadow-md"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-white">Email Digest</div>
                <div class="text-xs text-white/30">Rangkuman harian via email</div>
              </div>
              <div class="w-11 h-6 bg-white/10 rounded-full relative cursor-pointer">
                <div class="w-5 h-5 bg-white/40 rounded-full absolute left-0.5 top-0.5 shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="glass-card p-5">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 text-[#3B82F6]"></i> Tentang Sistem
          </h3>
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between text-white/40">
              <span>Versi Aplikasi</span><span class="font-bold text-white/60">2.0.0 Enterprise</span>
            </div>
            <div class="flex items-center justify-between text-white/40">
              <span>Platform</span><span class="font-bold text-white/60">Google Apps Script</span>
            </div>
            <div class="flex items-center justify-between text-white/40">
              <span>Frontend</span><span class="font-bold text-white/60">HTML / CSS / JS</span>
            </div>
            <div class="flex items-center justify-between text-white/40">
              <span>Database</span><span class="font-bold text-white/60">Google Spreadsheet</span>
            </div>
            <div class="flex items-center justify-between text-white/40">
              <span>Pengembang</span><span class="font-bold text-white/60">NSFZA — Smart Solutions</span>
            </div>
            <div class="flex items-center justify-between text-white/40">
              <span>No. HP / WhatsApp</span><span class="font-bold text-white/60">085250414056</span>
            </div>
            <div class="flex items-center justify-between text-white/40">
              <span>Email</span><span class="font-bold text-white/60">syukur.lpihs@gmail.com</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
