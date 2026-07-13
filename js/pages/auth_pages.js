window.pages = window.pages || {};

window.pages.renderLogin = function() {
  return `
    <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-700">
      
      <!-- Decorative Orbs -->
      <div class="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -top-32 -left-32 pointer-events-none"></div>
      <div class="absolute w-[500px] h-[500px] bg-[#84cc16]/10 rounded-full blur-[120px] -bottom-32 -right-32 pointer-events-none"></div>

      <div class="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl z-10 relative">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-5 border border-white/10 shadow-[0_0_25px_rgba(132,204,22,0.15)] relative group">
             <div class="absolute inset-0 rounded-3xl border border-white/20 scale-110 transition-transform duration-500 group-hover:scale-125"></div>
             <img src="Logo_hidayatullah.webp" alt="Logo Hidayatullah" class="w-12 h-12 object-contain drop-shadow-md relative z-10" onerror="this.outerHTML='<i data-lucide=\\'shield-check\\' class=\\'w-10 h-10 text-[#a3e635]\\'></i>'">
          </div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-2">HRMS Hidayatullah</h1>
          <p class="text-sm font-medium text-white/60">Login untuk mengakses absensi atau dashboard</p>
        </div>

        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-bold tracking-widest text-white/50 uppercase">Alamat Email</label>
            <div class="relative">
              <i data-lucide="mail" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></i>
              <input type="email" id="login-email" placeholder="nama@hidayatullah.id" class="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent transition-all shadow-inner">
            </div>
          </div>

          <button onclick="handleLogin()" class="w-full py-4 mt-2 bg-gradient-to-tr from-[#84cc16] to-[#10b981] text-white font-bold rounded-2xl shadow-lg shadow-[#84cc16]/30 hover:shadow-[#84cc16]/50 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group">
            Masuk / Verifikasi
            <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </button>
          
          <div class="relative py-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/10"></div></div>
            <div class="relative flex justify-center text-[10px] font-bold tracking-widest uppercase"><span class="bg-[#0a3d2e] px-4 text-white/40 rounded-full">Atau Akses Sebagai Admin</span></div>
          </div>
          
          <button onclick="handleAdminLogin()" class="w-full py-3.5 bg-white/5 text-white/80 border border-white/10 font-bold rounded-2xl hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
            <i data-lucide="lock" class="w-4 h-4"></i> Login Admin
          </button>
        </div>
        
        <p class="text-center text-[10px] font-bold tracking-widest text-white/30 uppercase mt-10">NSFZA &copy; 2026 Building Smart Solutions</p>
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
    <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-700">
      <div class="absolute w-[500px] h-[500px] bg-[#84cc16]/15 rounded-full blur-[120px] -top-32 -left-32 pointer-events-none"></div>
      
      <div class="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl z-10">
        <div class="text-center mb-8">
          <div class="text-5xl mb-4">👋</div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-2">Selamat Datang!</h1>
          <p class="text-sm font-medium text-white/60">Email Anda belum terdaftar. Lengkapi data berikut.</p>
        </div>

        <div class="space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-bold tracking-widest text-white/50 uppercase">Email</label>
            <div class="relative">
              <i data-lucide="mail" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30"></i>
              <input type="text" id="reg-email" readonly class="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white/60 cursor-not-allowed">
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold tracking-widest text-white/50 uppercase">Nama Lengkap</label>
            <div class="relative">
              <i data-lucide="user" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></i>
              <input type="text" id="reg-nama" placeholder="Masukkan nama" class="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#84cc16]/50 focus:border-[#84cc16]/30 transition-all shadow-inner">
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold tracking-widest text-white/50 uppercase">Unit Sekolah</label>
            <div class="relative">
              <i data-lucide="school" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></i>
              <select id="reg-unit" class="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#84cc16]/50 focus:border-[#84cc16]/30 appearance-none transition-all shadow-inner">
                <option value="">Memuat unit...</option>
              </select>
            </div>
          </div>

          <button onclick="handleRegister()" class="w-full py-4 mt-2 bg-gradient-to-tr from-[#84cc16] to-[#10b981] text-white font-bold rounded-2xl shadow-lg shadow-[#84cc16]/30 hover:shadow-[#84cc16]/50 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group">
            Daftar & Mulai
            <i data-lucide="arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </button>
          
          <button onclick="window.auth.logout()" class="w-full py-3 text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">
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
