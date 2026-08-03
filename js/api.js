const API_URL = "https://script.google.com/macros/s/AKfycbxylQ4Xc6rnyPidyUBsRYlFE7bT4u7V1Zjkf_WtEQscTk_tvvvQvTjPFy0u7vqtrEflng/exec";

window.apiCall = async function(action, payload = {}) {
  payload.action = action;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(payload)
    });
    const json = await response.json();

    // Unwrap doPost() wrapper: {success: true, data: result} → result
    if (json && json.success === true && json.data !== undefined) {
      return json.data;
    }
    // Jika error dari doPost()
    if (json && json.success === false) {
      // Kembalikan object error agar consumer bisa cek .success / .message
      return json;
    }
    // Fallback: kembalikan json apa adanya
    return json;
  } catch (err) {
    console.error("API Error:", err);
    throw new Error("Gagal terhubung ke server.");
  }
};

window.api = {
  checkUserRegistration: (email) => apiCall('checkUserRegistration', { email }),
  getUnitListNames: () => apiCall('getUnitListNames'),
  registerUser: (data) => apiCall('registerUser', data),
  processAttendance: (data) => apiCall('processAttendance', data),
  submitIzin: (data) => apiCall('submitIzin', data),

  getTodayLogAdmin: (adminEmail) => apiCall('getTodayLogAdmin', { adminEmail }),
  getIzinPendingAdmin: (adminEmail) => apiCall('getIzinPendingAdmin', { adminEmail }),
  getIzinAllAdmin: (adminEmail) => apiCall('getIzinAllAdmin', { adminEmail }),
  getUnitListAdmin: (adminEmail) => apiCall('getUnitListAdmin', { adminEmail }),
  getPegawaiListAdmin: (adminEmail) => apiCall('getPegawaiListAdmin', { adminEmail }),
  getFilterDataAdmin: (adminEmail) => apiCall('getFilterDataAdmin', { adminEmail }),
  getLaporanLengkapAdmin: () => apiCall('getLaporanLengkapAdmin'),
  getLaporanHarianAdmin: (tanggal, adminEmail) => apiCall('getLaporanHarianAdmin', { tanggal, adminEmail }),
  getLaporanRentangAdmin: (start, end, adminEmail) => apiCall('getLaporanRentangAdmin', { start, end, adminEmail }),
  prosesIzin: (data) => apiCall('prosesIzin', data),
  getAllLogAdmin: (adminEmail) => apiCall('getAllLogAdmin', { adminEmail }),
  saveUnitAdmin: (data) => apiCall('saveUnitAdmin', data),
  editUnitAdmin: (data) => apiCall('editUnitAdmin', data),
  adminBypassAttendance: (data) => apiCall('adminBypassAttendance', data),
  getJadwalHari: () => apiCall('getJadwalHari'),
  saveJadwalHari: (data) => apiCall('saveJadwalHari', data),
  deleteJadwalHari: (data) => apiCall('deleteJadwalHari', data),
  checkTodayBypass: (email) => apiCall('checkTodayBypass', { email }),
  
  // Hari Libur (Tanggal Merah)
  getHariLibur: () => apiCall('getHariLibur'),
  saveHariLibur: (data) => apiCall('saveHariLibur', data),
  deleteHariLibur: (data) => apiCall('deleteHariLibur', data),
  
  // Riwayat User (Mobile)
  getMyRecentLog: (email) => apiCall('getMyRecentLog', { email }),
  getMyRecentIzin: (email) => apiCall('getMyRecentIzin', { email }),
  
  getPiketListAdmin: () => apiCall('getPiketListAdmin'),
  savePiketAdmin: (data) => apiCall('savePiketAdmin', data),
  deletePiketAdmin: (data) => apiCall('deletePiketAdmin', data)
};
