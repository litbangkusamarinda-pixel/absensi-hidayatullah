window.pages = window.pages || {};

window.pages.renderLogin = function() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <!-- Decorative Orbs -->
      <div class="absolute w-96 h-96 bg-primary/20 rounded-full blur-[100px] -top-20 -left-20 pointer-events-none"></div>
      <div class="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -bottom-20 -right-20 pointer-events-none"></div>

      <div class="w-full max-w-md glass rounded-2xl p-8 shadow-2xl z-10 relative">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-primary/20">
            <i data-lucide="shield-check" class="w-10 h-10 text-primary"></i>
          </div>
          <h1 class="text-2xl font-bold text-foreground">HRMS Hidayatullah</h1>
          <p class="text-sm text-muted-foreground mt-2">Login untuk mengakses absensi atau dashboard</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Alamat Email</label>
            <input type="email" id="login-email" placeholder="nama@hidayatullah.id" class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
          </div>

          <button onclick="handleLogin()" class="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all active:scale-95">
            Masuk / Verifikasi
          </button>
          
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
            <div class="relative flex justify-center text-xs uppercase"><span class="bg-background px-2 text-muted-foreground">Atau Akses Sebagai Admin</span></div>
          </div>
          
          <button onclick="handleAdminLogin()" class="w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-all active:scale-95">
            Login Admin
          </button>
        </div>
        
        <p class="text-center text-xs text-muted-foreground mt-8">NSFZA &copy; 2026 Building Smart Solutions</p>
      </div>
    </div>
  `;
};

window.pages.initLogin = function() {
  window.handleLogin = function() {
    const email = document.getElementById('login-email').value.trim();
    if (!email) return window.ui.showToast('⚠️', 'Email harus diisi', false);
    window.auth.loginAsEmployee(email);
  };
  
  window.handleAdminLogin = function() {
    const email = document.getElementById('login-email').value.trim();
    if (!email) return window.ui.showToast('⚠️', 'Email admin harus diisi', false);
    window.auth.loginAsAdmin(email);
  };
};

window.pages.renderRegister = function() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div class="absolute w-96 h-96 bg-primary/20 rounded-full blur-[100px] -top-20 -left-20 pointer-events-none"></div>
      
      <div class="w-full max-w-md glass rounded-2xl p-8 shadow-2xl z-10">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-foreground">Selamat Datang! 👋</h1>
          <p class="text-sm text-muted-foreground mt-2">Email Anda belum terdaftar. Lengkapi data berikut.</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Email</label>
            <input type="text" id="reg-email" readonly class="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Nama Lengkap</label>
            <input type="text" id="reg-nama" placeholder="Masukkan nama" class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Unit Sekolah</label>
            <select id="reg-unit" class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none">
              <option value="">Memuat unit...</option>
            </select>
          </div>

          <button onclick="handleRegister()" class="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 mt-4">
            Daftar & Mulai
          </button>
          
          <button onclick="window.auth.logout()" class="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-all">
            Batal
          </button>
        </div>
      </div>
    </div>
  `;
};

window.pages.initRegister = async function() {
  const email = localStorage.getItem('hrms_email_pending');
  if (!email) return window.router.navigateTo('login');
  
  document.getElementById('reg-email').value = email;
  
  try {
    const units = await window.api.getUnitListNames();
    const sel = document.getElementById('reg-unit');
    sel.innerHTML = '<option value="">-- Pilih Unit --</option>' + units.map(u => `<option value="${u}">${u}</option>`).join('');
  } catch(e) {
    console.error(e);
  }
  
  window.handleRegister = async function() {
    const nama = document.getElementById('reg-nama').value.trim();
    const unit = document.getElementById('reg-unit').value;
    if(!nama || !unit) return window.ui.showToast('⚠️', 'Nama & Unit wajib diisi!', false);
    
    window.ui.showLoading("Mendaftarkan...");
    try {
      const res = await window.api.registerUser({ email, nama, unit });
      window.ui.hideLoading();
      if(res.success) {
        window.ui.showToast('🎉', 'Pendaftaran Berhasil!', true);
        localStorage.removeItem('hrms_email_pending');
        window.auth.loginAsEmployee(email); // Re-login properly
      } else {
        window.ui.showToast('⚠️', res.message, false);
      }
    } catch(e) {
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal mendaftar', false);
    }
  };
};
