window.auth = {
  currentUser: null,

  init: async function() {
    const savedEmail = localStorage.getItem('hrms_email');
    const savedRole = localStorage.getItem('hrms_role');
    
    if (savedEmail && savedRole) {
      if (savedRole === 'admin') {
        this.currentUser = { email: savedEmail, role: 'admin', name: 'Admin', unit: 'Semua Unit' };
        window.router.navigateTo('dashboard');
      } else {
        try {
          ui.showLoading("Memverifikasi sesi...");
          const res = await window.api.checkUserRegistration(savedEmail);
          ui.hideLoading();
          if (res.registered) {
            this.currentUser = { email: savedEmail, role: 'employee', name: res.nama, unit: res.unit, jabatan: res.jabatan };
            window.router.navigateTo('attendance');
          } else {
            this.logout();
          }
        } catch (err) {
          ui.hideLoading();
          ui.showToast('⚠️', 'Gagal memverifikasi sesi', false);
          this.logout();
        }
      }
    } else {
      window.router.navigateTo('login');
    }
  },

  loginAsEmployee: async function(email) {
    try {
      ui.showLoading("Memeriksa data...");
      const res = await window.api.checkUserRegistration(email);
      ui.hideLoading();
      if (res.registered) {
        localStorage.setItem('hrms_email', email);
        localStorage.setItem('hrms_role', 'employee');
        this.currentUser = { email, role: 'employee', name: res.nama, unit: res.unit, jabatan: res.jabatan };
        ui.showToast('✅', 'Berhasil login!', true);
        window.router.navigateTo('attendance');
      } else {
        localStorage.setItem('hrms_email_pending', email);
        window.router.navigateTo('register');
      }
    } catch (err) {
      ui.hideLoading();
      ui.showToast('⚠️', 'Koneksi error', false);
    }
  },

  loginAsAdmin: function(email) {
    localStorage.setItem('hrms_email', email);
    localStorage.setItem('hrms_role', 'admin');
    this.currentUser = { email, role: 'admin', name: 'Admin', unit: 'Semua Unit' };
    ui.showToast('✅', 'Login Admin berhasil!', true);
    window.router.navigateTo('dashboard');
  },

  logout: function() {
    localStorage.removeItem('hrms_email');
    localStorage.removeItem('hrms_role');
    localStorage.removeItem('hrms_email_pending');
    this.currentUser = null;
    window.router.navigateTo('login');
  }
};
