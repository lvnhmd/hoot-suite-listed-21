const puppeteer = require('puppeteer');

exports.schedule = async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 100, defaultViewport: null });
  // const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app.later.com/2ZX7V/schedule/calendar');
  // await page.screenshot({ path: 'later.png' });
  await page.click('#login_instagram');
  // await page.type('[name="username"]', process.env.IG_LOGIN);
  // await page.type('[name="password"]', process.env.IG_PWD);
  await page.waitForSelector('[name="username"]');
  await page.type('[name="username"]', 'listed21');
  await page.type('[name="password"]', 'gdy.bg2016');
  await page.click('button.sqdOP.L3NKy.y3zKF');
  // click on upload media
  await page.waitForSelector('div.cUP--upload__text.is--base');
  await page.click('div.cUP--upload__text.is--base');
  const input = await page.$('input[type="file"]');
  await input.uploadFile('./downloads/cntraveller-02-Dec-19/16la.jpg');
  // click on the first thumbnail - which is the last uploaded image
  await page.waitForSelector('img.o--media');
  const images = await page.$$('img.o--media');
  await images[0].click();
  const editLinks = await page.$$('a.u--m__l__sm.u--text--sm.u--text--uppercase');
  await editLinks[0].click();
  // await editLinks[1].click();
  // await page.$('i.i-template');
  // await page.click('i.i-template');
  // instead of doing this, write in the field notes straight away
  // click on save/close
  // click on create post


  // await browser.close();
};
