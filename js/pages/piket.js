/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Guru Piket Schedule
 * Manage duty teachers (Guru Piket) schedules
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderPiketSchedule = function() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Administration</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Jadwal Guru Piket</h1>
          <p class="text-sm text-white/40 mt-1">Atur jadwal guru piket beserta jam masuk dan pulangnya</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        <!-- Add Form -->
        <div class="lg:col-span-2 glass-card p-5 space-y-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-[#14B88A]/15 border border-[#14B88A]/20 flex items-center justify-center">
              <i data-lucide="clipboard-list" class="w-5 h-5 text-[#14B88A]"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Tambah Guru Piket</h3>
              <p class="text-[10px] text-white/30">Pengaturan jam tugas</p>
            </div>
          </div>
          
          <!-- Form Fields -->
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Pilih Unit</label>
              <select id="pUnit" class="hrms-input text-sm" onchange="window.pages.filterPiketGuru()">
                <option value="">Pilih Unit...</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Pilih Guru</label>
              <select id="pGuru" class="hrms-input text-sm">
                <option value="">Pilih Guru...</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Pilih Hari</label>
              <select id="pHari" class="hrms-input text-sm">
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
                <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jam Masuk Piket</label>
                <input type="time" id="pMasuk" value="06:30" class="hrms-input text-sm">
              </div>
              <div>
                <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jam Pulang Piket</label>
                <input type="time" id="pPulang" value="16:00" class="hrms-input text-sm">
              </div>
            </div>
            
          </div>
          
          <button onclick="window.pages.simpanPiket()" id="btnSimpanPiket" class="btn-primary w-full py-3 text-sm mt-4">
            <i data-lucide="save" class="w-4 h-4"></i> Simpan Jadwal Piket
          </button>
        </div>

        <!-- Schedule List -->
        <div class="lg:col-span-3 space-y-4">
          <div class="glass-card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/20 flex items-center justify-center">
                <i data-lucide="users" class="w-5 h-5 text-[#60A5FA]"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Daftar Guru Piket</h3>
                <p class="text-[10px] text-white/30" id="piket-count">Memuat...</p>
              </div>
            </div>
            <div class="overflow-x-auto" style="max-height:400px;">
              <table class="hrms-table" id="tabelPiket">
                <thead>
                  <tr><th>Unit</th><th>Hari</th><th>Nama Guru</th><th>Masuk</th><th>Pulang</th><th>Aksi</th></tr>
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

window.pages.initPiketSchedule = function() {
  const adminEmail = window.auth.currentUser.email;
  window.pages.piketPegawaiList = [];

  // Load Units and Pegawai
  async function loadFormData() {
    try {
      const p = await window.api.getPegawaiListAdmin(adminEmail);
      window.pages.piketPegawaiList = p;
      
      const units = [...new Set(p.map(g => g.unit).filter(Boolean))].sort();
      const pUnit = document.getElementById('pUnit');
      
      if(pUnit) {
          pUnit.innerHTML = '<option value="">Pilih Unit...</option>';
          units.forEach(u => {
            pUnit.innerHTML += \`<option value="\${u}">\${u}</option>\`;
          });
      }
    } catch(e) {
      console.error("Failed to load forms data", e);
    }
  }

  window.pages.filterPiketGuru = function() {
    const selectedUnit = document.getElementById('pUnit').value;
    const selectGuru = document.getElementById('pGuru');
    
    if(!selectGuru) return;

    selectGuru.innerHTML = '<option value="">Pilih Guru...</option>';
    
    const filtered = selectedUnit 
      ? window.pages.piketPegawaiList.filter(g => g.unit === selectedUnit)
      : window.pages.piketPegawaiList;
      
    filtered.forEach(g => {
      selectGuru.innerHTML += \`<option value="\${g.nama}">\${g.nama}</option>\`;
    });
  };

  // Load Piket Schedule Table
  async function loadPiketList() {
    try {
      const d = await window.api.getPiketListAdmin();
      const tb = document.querySelector('#tabelPiket tbody');
      const countEl = document.getElementById('piket-count');
      if (!tb) return;

      if (countEl) countEl.textContent = d.length + ' jadwal piket terdaftar';

      if (!d.length) {
        tb.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-white/30 text-xs">Belum ada jadwal piket</td></tr>';
        return;
      }

      tb.innerHTML = d.map(r => {
        return \`
          <tr>
            <td class="font-semibold text-white text-[11px]">\${r.unit}</td>
            <td class="font-bold text-white text-xs">\${r.hari}</td>
            <td class="text-xs">\${r.nama}</td>
            <td class="text-xs">\${r.masuk}</td>
            <td class="text-xs">\${r.pulang}</td>
            <td>
              <button onclick="window.pages.hapusPiket(\${r.rowIndex})" class="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg p-1.5 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
      
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error("Failed to load piket list", e);
    }
  }

  // Save Schedule
  window.pages.simpanPiket = async function() {
    const d = {
      unit: document.getElementById('pUnit').value,
      hari: document.getElementById('pHari').value,
      nama: document.getElementById('pGuru').value,
      masuk: document.getElementById('pMasuk').value,
      pulang: document.getElementById('pPulang').value
    };

    if (!d.unit || !d.nama) {
      window.ui.showToast('⚠️', 'Silakan pilih unit dan guru terlebih dahulu!', false);
      return;
    }

    const btn = document.getElementById('btnSimpanPiket');
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Menyimpan...';
    
    try {
      const res = await window.api.savePiketAdmin({ piketData: d });
      window.ui.showToast('✅', res.message, true);
      loadPiketList();
      
      // Reset form to default values for convenience
      document.getElementById('pGuru').value = '';
    } catch(e) {
      window.ui.showToast('⚠️', 'Gagal menyimpan jadwal piket', false);
    } finally {
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Simpan Jadwal Piket';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  // Delete Schedule
  window.pages.hapusPiket = async function(rowIndex) {
    if (confirm('Yakin ingin menghapus jadwal piket ini?')) {
      try {
        const res = await window.api.deletePiketAdmin({ rowIndex: rowIndex });
        window.ui.showToast('✅', res.message, true);
        loadPiketList();
      } catch (e) {
        window.ui.showToast('⚠️', 'Gagal menghapus jadwal piket', false);
      }
    }
  };

  // Init Calls
  loadFormData();
  loadPiketList();
  if (window.lucide) window.lucide.createIcons();
};
