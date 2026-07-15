const API_URL = "https://script.google.com/macros/s/AKfycbx3Gt5JpJVTFtcaBI2cOpkcO5md5-yy6qXE4Q_9bJ1WwX2Dftwen2eRo65liShMD1nf/exec";

window.apiCall = async function(action, payload = {}) {
  payload.action = action;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return await response.json();
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
  getLaporanLengkapAdmin: () => apiCall('getLaporanLengkapAdmin'),
  prosesIzin: (data) => apiCall('prosesIzin', data),
  getAllLogAdmin: (adminEmail) => apiCall('getAllLogAdmin', { adminEmail }),
  saveUnitAdmin: (data) => apiCall('saveUnitAdmin', data)
};
