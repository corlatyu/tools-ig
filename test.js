const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs/promises');
puppeteer.use(StealthPlugin());

(async () => {
  // Memuat data login dari file
  const loginData = JSON.parse(await fs.readFile('loginData.json', 'utf8'));

  // Fungsi untuk login dengan satu akun
  const login = async (browser, account) => {
    const page = await browser.newPage();

    try {
      // Mengatur User-Agent yang realistis
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Mengunjungi halaman login
      await page.goto('https://www.instagram.com/accounts/login/');

      // Tunggu elemen input muncul
      await page.waitForSelector('input[name="username"]');
      await page.waitForSelector('input[name="password"]');

      // Mengisi formulir login
      console.log(`Mengisi formulir login untuk email: ${account.email}`);
      await page.type('input[name="username"]', account.email);
      await page.type('input[name="password"]', account.password);

      // Tambahkan jeda 1 detik setelah mengisi formulir login
      await page.waitForTimeout(1000); // Menunggu selama 1000ms atau 1 detik

      // Tunggu hingga tombol login dapat diklik
      await page.waitForFunction(() => {
        const loginButton = document.querySelector('button[type="submit"]');
        return !loginButton.disabled;
      });

      // Klik tombol login
      const loginButtonSelector = 'button[type="submit"]';
      await page.click(loginButtonSelector);

      // Menunggu halaman berhasil login
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      console.log(`Berhasil login dengan email ${account.email}`);
    } catch (error) {
      console.error(`Terjadi kesalahan saat login dengan email ${account.email}:`, error);
    }
  };

  // Memulai browser baru dengan opsi untuk menggunakan Chrome/Chromium
  const browser = await puppeteer.launch({
    headless: false, // Set to false for debugging
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Sesuaikan jalur ini
  });

  // Batasi hingga 5 tab sekaligus
  const maxTabs = 5;
  const tabPromises = loginData.slice(0, maxTabs).map(account => login(browser, account));

  // Tunggu semua tab selesai login
  await Promise.all(tabPromises);

  console.log('Login selesai untuk semua akun. Browser akan tetap terbuka.');
  // Jangan menutup browser untuk tujuan debugging
  // await browser.close();
})();
