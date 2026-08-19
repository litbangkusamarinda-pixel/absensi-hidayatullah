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
          // Fallback offline: cegah auto-logout jika koneksi timeout
          const localName = localStorage.getItem('hrms_emp_name') || 'Pegawai';
          const localUnit = localStorage.getItem('hrms_emp_unit') || '';
          const localJabatan = localStorage.getItem('hrms_emp_jabatan') || 'Guru';
          this.currentUser = { email: savedEmail, role: 'employee', name: localName, unit: localUnit, jabatan: localJabatan };
          
          ui.showToast('⚠️', 'Koneksi lambat. Menggunakan profil tersimpan.', false);
          window.router.navigateTo('attendance');
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
        localStorage.setItem('hrms_emp_name', res.nama);
        localStorage.setItem('hrms_emp_unit', res.unit);
        localStorage.setItem('hrms_emp_jabatan', res.jabatan || '');
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
