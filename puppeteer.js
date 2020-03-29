/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const moment = require('moment');

exports.schedule = async (posts) => {
  const scheduled = [];
  const browser = await puppeteer.launch({ headless: false, slowMo: 10, defaultViewport: null });
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    page.setDefaultTimeout(60000);
    await page.goto('https://app.later.com/2ZX7V/schedule/calendar');
    await page.waitForSelector('#login_instagram');
    await page.click('#login_instagram');
    // await page.type('[name="username"]', process.env.IG_LOGIN);
    // await page.type('[name="password"]', process.env.IG_PWD);
    await page.waitForSelector('[name="username"]');
    await page.type('[name="username"]', 'listed21');
    await page.type('[name="password"]', 'gdy.bg2016');
    await page.waitForSelector('button.sqdOP.L3NKy.y3zKF');
    await page.click('button.sqdOP.L3NKy.y3zKF');


    const isFB = posts[0].platform === 'FB';

    if (isFB) {
      await page.waitForSelector('img[title="Listed21"]');
      await page.hover('img[title="Listed21"]');
      await page.waitFor(4000);
      await page.click('img[title="Listed21"]');
    }

    let publishAt = moment(moment.now()).add(15, 'hour');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < posts.length; i++) {
      await page.waitFor(4000);
      // const promises = posts.map(async (post) => {
      publishAt = moment(publishAt).add(60, 'minutes');
      const post = posts[i];
      // click on upload media
      await page.waitForSelector('div.cUP--upload__text.is--base');
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('div.cUP--upload__text.is--base'),
      ]);
      await fileChooser.accept([post.img]);
      await page.waitFor(4000);
      // click on the first thumbnail - which is the last uploaded image
      await page.waitForSelector('img.o--media');
      const images = await page.$$('img.o--media');
      await images[0].click();
      await page.waitForSelector('a.u--m__l__sm.u--text--sm.u--text--uppercase');
      const editLinks = await page.$$('a.u--m__l__sm.u--text--sm.u--text--uppercase');
      await editLinks[0].click();

      // instead of typing assign a value
      await page.waitForSelector('#textareaMediaNote');
      await page.$eval('#textareaMediaNote', (el, value) => el.value = value, post.content);
      await page.waitForSelector('button.o--btn.o--btn--primary');
      await page.click('button.o--btn.o--btn--primary');

      await page.waitForSelector('a.o--btn.o--btn--primary.qa--media_modal__primary_button');
      await page.click('a.o--btn.o--btn--primary.qa--media_modal__primary_button');

      if (!isFB) {
        await page.waitForSelector('[name="linkUrl"]');
        // await page.$eval('[name="linkUrl"]', (el, value) => el.value = value, post.url);
        await page.type('[name="linkUrl"]', post.url);
      }
      const dateField = await page.waitForSelector('#l--scheduleDate');
      await dateField.click({ clickCount: 3 });
      await page.type('#l--scheduleDate', publishAt.format('YYYY/MM/DD hh:mm a'));
      // await page.$eval('#l--scheduleDate', (el, value) => el.value = value, publishAt);

      await page.waitForSelector('a.o--btn.o--btn--primary.e--modal--save.u--p__lr__lg.qa--media_modal__primary_button');
      await page.click('a.o--btn.o--btn--primary.e--modal--save.u--p__lr__lg.qa--media_modal__primary_button');
      scheduled.push(post);
    }
    await page.waitFor(4000);
    await page.close();
    await browser.close();
    return scheduled;
  } catch (err) {
    console.log(err);
    await page.close();
    await browser.close();
    return scheduled;
  }
};
