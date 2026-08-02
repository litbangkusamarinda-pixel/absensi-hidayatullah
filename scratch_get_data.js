const API_URL = "https://script.google.com/macros/s/AKfycbxGOqvlE1qZAhulmg6z5MZ5gyiTSCz_13dspzdjECdJL5xkCLx4Trjv8JCHb97r_zybew/exec";

async function testApi() {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: "getPegawaiListAdmin", adminEmail: "litbangkusamarinda@gmail.com" })
    });
    const json = await res.json();
    console.log("getPegawaiListAdmin response:", JSON.stringify(json).substring(0, 500));
  } catch (err) {
    console.error("Error getPegawaiListAdmin:", err);
  }

  try {
    const now = new Date();
    const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: "getLaporanHarianAdmin", tanggal: todayStr, adminEmail: "litbangkusamarinda@gmail.com" })
    });
    const json = await res.json();
    console.log("getLaporanHarianAdmin response:", JSON.stringify(json).substring(0, 500));
  } catch (err) {
    console.error("Error getLaporanHarianAdmin:", err);
  }
}

testApi();
