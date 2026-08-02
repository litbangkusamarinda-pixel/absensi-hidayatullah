/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Holiday Management (Hari Libur)
 * Manage public holidays and school-specific holidays
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderHolidays = function() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Administration</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Manajemen Hari Libur</h1>
          <p class="text-sm text-white/40 mt-1">Kelola tanggal merah dan hari libur khusus yayasan</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        <!-- Add Form -->
        <div class="lg:col-span-2 glass-card p-5 space-y-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/20 flex items-center justify-center">
              <i data-lucide="calendar-off" class="w-5 h-5 text-[#F87171]"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Tambah Hari Libur</h3>
              <p class="text-[10px] text-white/30">Tanggal merah & libur khusus</p>
            </div>
          </div>
          
          <!-- Form Fields -->
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Tanggal Libur</label>
              <input type="date" id="liburTanggal" class="hrms-input text-sm">
            </div>

            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Keterangan</label>
              <input type="text" id="liburKeterangan" placeholder="Contoh: Hari Raya Idul Fitri" class="hrms-input text-sm">
            </div>
          </div>
          
          <button onclick="window.pages.simpanHariLibur()" id="btnSimpanLibur" class="btn-primary w-full py-3 text-sm mt-4">
            <i data-lucide="save" class="w-4 h-4"></i> Simpan Hari Libur
          </button>

          <!-- Info Box -->
          <div class="mt-4 p-3 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20">
            <div class="flex items-start gap-2">
              <i data-lucide="info" class="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5"></i>
              <div class="text-[10px] text-[#60A5FA]/80 leading-relaxed">
                <strong>Info:</strong> Hari libur yang terdaftar akan otomatis mempengaruhi perhitungan absensi. 
                Pegawai tidak akan dihitung absen pada tanggal yang tercatat sebagai hari libur.
              </div>
            </div>
          </div>
        </div>

        <!-- Holiday List -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-3">
            <div class="stat-card accent-danger">
              <div class="stat-label">Total Hari Libur</div>
              <div class="stat-value text-2xl" id="libur-total">-</div>
            </div>
            <div class="stat-card accent-info">
              <div class="stat-label">Libur Mendatang</div>
              <div class="stat-value text-2xl" id="libur-upcoming">-</div>
            </div>
          </div>

          <!-- Holiday Table -->
          <div class="glass-card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/20 flex items-center justify-center">
                <i data-lucide="calendar-days" class="w-5 h-5 text-[#FBBF24]"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Daftar Hari Libur Terdaftar</h3>
                <p class="text-[10px] text-white/30" id="libur-count">Memuat...</p>
              </div>
            </div>
            <div class="overflow-x-auto" style="max-height:400px;">
              <table class="hrms-table" id="tabelLibur">
                <thead>
                  <tr><th>#</th><th>Tanggal</th><th>Keterangan</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  <tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Memuat...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
};

window.pages.initHolidays = function() {
  // ═══ Load Holiday Table ═══
  async function loadHolidayTable() {
    try {
      const d = await window.api.getHariLibur();
      const tb = document.querySelector('#tabelLibur tbody');
      const countEl = document.getElementById('libur-count');
      const totalEl = document.getElementById('libur-total');
      const upcomingEl = document.getElementById('libur-upcoming');
      if (!tb) return;

      if (totalEl) totalEl.textContent = d.length;
      if (countEl) countEl.textContent = d.length + ' hari libur terdaftar';

      // Count upcoming holidays
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let upcoming = 0;
      d.forEach(r => {
        const liburDate = new Date(r.tanggal);
        if (liburDate >= today) upcoming++;
      });
      if (upcomingEl) upcomingEl.textContent = upcoming;

      if (!d.length) {
        tb.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-white/30 text-xs">Belum ada hari libur terdaftar</td></tr>';
        return;
      }

      // Sort by date descending (newest first)
      d.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

      tb.innerHTML = d.map((r, i) => {
        const liburDate = new Date(r.tanggal);
        const isPast = liburDate < today;
        const isToday = liburDate.toDateString() === today.toDateString();
        
        // Format date for display: dd MMM yyyy
        const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
        const displayDate = liburDate.getDate() + ' ' + months[liburDate.getMonth()] + ' ' + liburDate.getFullYear();
        const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const dayName = dayNames[liburDate.getDay()];
        
        let statusBadge;
        if (isToday) {
          statusBadge = '<span class="badge badge-warning text-[9px]">Hari Ini</span>';
        } else if (isPast) {
          statusBadge = '<span class="badge badge-neutral text-[9px]">Lewat</span>';
        } else {
          statusBadge = '<span class="badge badge-success text-[9px]">Mendatang</span>';
        }
        
        return `
          <tr class="${isToday ? 'bg-[#F59E0B]/5' : ''}">
            <td class="text-xs text-white/30">${i + 1}</td>
            <td>
              <div class="font-semibold text-white text-xs">${displayDate}</div>
              <div class="text-[10px] text-white/30">${dayName}</div>
            </td>
            <td class="text-xs text-white/60">${r.keterangan || '-'}</td>
            <td>${statusBadge}</td>
            <td>
              <button onclick="window.pages.hapusHariLibur(${r.rowIndex})" class="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg p-1.5 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
      
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error("Failed to load holidays", e);
      const tb = document.querySelector('#tabelLibur tbody');
      if (tb) tb.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-400 text-xs">Gagal memuat data hari libur</td></tr>';
    }
  }

  // ═══ Save Holiday ═══
  window.pages.simpanHariLibur = async function() {
    const tanggal = document.getElementById('liburTanggal').value;
    const keterangan = document.getElementById('liburKeterangan').value;

    if (!tanggal) {
      window.ui.showToast('⚠️', 'Tanggal libur wajib diisi!', false);
      return;
    }
    if (!keterangan.trim()) {
      window.ui.showToast('⚠️', 'Keterangan libur wajib diisi!', false);
      return;
    }

    const btn = document.getElementById('btnSimpanLibur');
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Menyimpan...';
    
    try {
      const res = await window.api.saveHariLibur({ liburData: { tanggal, keterangan } });
      window.ui.showToast('✅', res.message || 'Hari libur berhasil ditambahkan!', true);
      loadHolidayTable();
      
      // Reset form
      document.getElementById('liburTanggal').value = '';
      document.getElementById('liburKeterangan').value = '';
    } catch(e) {
      window.ui.showToast('⚠️', 'Gagal menyimpan hari libur', false);
    } finally {
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Simpan Hari Libur';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  // ═══ Delete Holiday ═══
  window.pages.hapusHariLibur = async function(rowIndex) {
    if (confirm('Yakin ingin menghapus hari libur ini?')) {
      try {
        const res = await window.api.deleteHariLibur({ rowIndex: rowIndex });
        window.ui.showToast('✅', res.message || 'Hari libur berhasil dihapus!', true);
        loadHolidayTable();
      } catch (e) {
        window.ui.showToast('⚠️', 'Gagal menghapus hari libur', false);
      }
    }
  };

  // Init
  loadHolidayTable();
  if (window.lucide) window.lucide.createIcons();
};
