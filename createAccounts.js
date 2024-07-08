const puppeteer = require('puppeteer');

// Data akun yang akan didaftarkan
const accountData = [
  { email: 'kamjisantosa@gmail.com', fullname: 'John Doekas', username: 'johndoekas_unik01', password: 'Berkah123@', birthDate: { day: '15', month: '4', year: '1995' } },
  // Tambahkan data akun lainnya di sini
];

(async () => {
  // Memulai browser baru
  const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
  const page = await browser.newPage();

  try {
    // Mengunjungi halaman pendaftaran
    await page.goto('https://www.instagram.com/accounts/emailsignup/');

    // Tunggu elemen input muncul
    await page.waitForSelector('input[name="emailOrPhone"]');
    await page.waitForSelector('input[name="fullName"]');
    await page.waitForSelector('input[name="username"]');
    await page.waitForSelector('input[name="password"]');

    for (const account of accountData) {
      console.log(`Mengisi formulir untuk email: ${account.email}`);
      await page.type('input[name="emailOrPhone"]', account.email, { delay: 100 }); // Menambahkan jeda 100ms
      await page.type('input[name="fullName"]', account.fullname, { delay: 100 }); // Menambahkan jeda 100ms
      await page.type('input[name="username"]', account.username, { delay: 100 }); // Menambahkan jeda 100ms
      await page.type('input[name="password"]', account.password, { delay: 100 }); // Menambahkan jeda 100ms

      const nextButtonSelector = 'button[type="submit"]';
      await page.waitForSelector(nextButtonSelector);
      await page.click(nextButtonSelector);

      console.log('Menunggu elemen dropdown untuk tanggal lahir...');
      await page.waitForSelector('select[title="Month:"]');
      await page.waitForSelector('select[title="Day:"]');
      await page.waitForSelector('select[title="Year:"]');

      // Mengisi tanggal lahir
      console.log('Mengisi tanggal lahir...');
      await page.select('select[title="Month:"]', account.birthDate.month);
      await page.select('select[title="Day:"]', account.birthDate.day);
      await page.select('select[title="Year:"]', account.birthDate.year);

      // Klik tombol "Next" untuk melanjutkan pendaftaran
      await page.click(nextButtonSelector);

      // Tunggu hingga navigasi selesai
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      console.log(`Akun dengan email ${account.email} berhasil didaftarkan`);

      // Tambahkan jeda waktu untuk menghindari masalah dengan deteksi bot
      await page.waitForTimeout(3000);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }

  // Tetap buka browser untuk debugging
  console.log('Pendaftaran selesai. Browser akan tetap terbuka.');
  // Jangan menutup browser untuk tujuan debugging
  // await browser.close();
})();
