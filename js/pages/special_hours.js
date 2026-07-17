/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Special Working Hours
 * Manage specific working hours for different days (e.g. Friday)
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderSpecialHours = function() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Administration</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Jam Kerja Khusus</h1>
          <p class="text-sm text-white/40 mt-1">Atur jadwal masuk/pulang khusus berdasarkan hari dan unit</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        <!-- Add Form -->
        <div class="lg:col-span-2 glass-card p-5 space-y-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/20 flex items-center justify-center">
              <i data-lucide="calendar-clock" class="w-5 h-5 text-[#F59E0B]"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Atur Hari Kerja Khusus</h3>
              <p class="text-[10px] text-white/30">Contoh: Jadwal khusus hari Jumat</p>
            </div>
          </div>
          
          <!-- Form Fields -->
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Pilih Unit</label>
              <select id="jUnit" class="hrms-input text-sm">
                <option value="">Pilih Unit Aktif...</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Pilih Hari</label>
              <select id="jHari" class="hrms-input text-sm">
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jam Masuk</label>
                <input type="time" id="jMasuk" value="07:00" class="hrms-input text-sm">
              </div>
              <div>
                <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jam Pulang</label>
                <input type="time" id="jPulang" value="11:30" class="hrms-input text-sm">
              </div>
            </div>
            
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jadikan Hari Libur?</label>
              <select id="jLibur" class="hrms-input text-sm">
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya, Libur</option>
              </select>
            </div>
          </div>
          
          <button onclick="window.pages.simpanJadwalHari()" id="btnSimpanJadwal" class="btn-primary w-full py-3 text-sm mt-4">
            <i data-lucide="save" class="w-4 h-4"></i> Simpan Jadwal Khusus
          </button>
        </div>

        <!-- Schedule List -->
        <div class="lg:col-span-3 space-y-4">
          <div class="glass-card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 flex items-center justify-center">
                <i data-lucide="calendar-days" class="w-5 h-5 text-[#A78BFA]"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Daftar Jadwal Khusus Terdaftar</h3>
                <p class="text-[10px] text-white/30" id="jadwal-count">Memuat...</p>
              </div>
            </div>
            <div class="overflow-x-auto" style="max-height:400px;">
              <table class="hrms-table" id="tabelJadwal">
                <thead>
                  <tr><th>Unit</th><th>Hari</th><th>Masuk</th><th>Pulang</th><th>Status Libur</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  <tr><td colspan="6" class="text-center py-8 text-white/30 text-xs">Memuat...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
};

window.pages.initSpecialHours = function() {
  const adminEmail = window.auth.currentUser.email;

  // Load Unit List for Dropdown
  async function loadUnitDropdown() {
    try {
      const d = await window.api.getUnitListAdmin(adminEmail);
      const jSel = document.getElementById('jUnit');
      if (!jSel) return;
      
      jSel.innerHTML = '<option value="">Pilih Unit Aktif...</option>';
      if (d.length > 0) {
        d.forEach(r => {
          jSel.innerHTML += `<option value="${r.unit}">${r.unit}</option>`;
        });
      }
    } catch(e) {
      console.error("Failed to load units", e);
    }
  }

  // Load Special Schedule Table
  async function loadJadwalHari() {
    try {
      const d = await window.api.getJadwalHari();
      const tb = document.querySelector('#tabelJadwal tbody');
      const countEl = document.getElementById('jadwal-count');
      if (!tb) return;

      if (countEl) countEl.textContent = d.length + ' jadwal khusus terdaftar';

      if (!d.length) {
        tb.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-white/30 text-xs">Belum ada jadwal khusus</td></tr>';
        return;
      }

      tb.innerHTML = d.map(r => {
        const stat = r.libur === "Ya" 
          ? '<span class="badge badge-danger text-[9px]">Libur</span>' 
          : '<span class="badge badge-success text-[9px]">Masuk</span>';
        
        return `
          <tr>
            <td class="font-semibold text-white text-xs">${r.unit}</td>
            <td class="font-bold text-white text-xs">${r.hari}</td>
            <td class="text-xs">${r.masuk}</td>
            <td class="text-xs">${r.pulang}</td>
            <td>${stat}</td>
            <td>
              <button onclick="window.pages.hapusJadwalHari(${r.rowIndex})" class="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg p-1.5 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
      
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error("Failed to load jadwal hari", e);
    }
  }

  // Save Schedule
  window.pages.simpanJadwalHari = async function() {
    const d = {
      unit: document.getElementById('jUnit').value,
      hari: document.getElementById('jHari').value,
      masuk: document.getElementById('jMasuk').value,
      pulang: document.getElementById('jPulang').value,
      libur: document.getElementById('jLibur').value
    };

    if (!d.unit) {
      window.ui.showToast('⚠️', 'Silakan pilih unit terlebih dahulu!', false);
      return;
    }

    const btn = document.getElementById('btnSimpanJadwal');
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Menyimpan...';
    
    try {
      const res = await window.api.saveJadwalHari({ jadwalData: d });
      window.ui.showToast('✅', res.message, true);
      loadJadwalHari();
      
      // Reset form to default values for convenience
      document.getElementById('jMasuk').value = '07:00';
      document.getElementById('jPulang').value = '11:30';
      document.getElementById('jLibur').value = 'Tidak';
    } catch(e) {
      window.ui.showToast('⚠️', 'Gagal menyimpan jadwal', false);
    } finally {
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Simpan Jadwal Khusus';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  // Delete Schedule
  window.pages.hapusJadwalHari = async function(rowIndex) {
    if (confirm('Yakin ingin menghapus jadwal khusus ini?')) {
      try {
        const res = await window.api.deleteJadwalHari({ rowIndex: rowIndex });
        window.ui.showToast('✅', res.message, true);
        loadJadwalHari();
      } catch (e) {
        window.ui.showToast('⚠️', 'Gagal menghapus jadwal', false);
      }
    }
  };

  // Init Calls
  loadUnitDropdown();
  loadJadwalHari();
  if (window.lucide) window.lucide.createIcons();
};
