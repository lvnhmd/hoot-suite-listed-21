/* eslint-disable max-len */
/* eslint-disable no-console */
const download = require('image-downloader');
const dateFormat = require('dateformat');
const fs = require('fs');
const mongoose = require('mongoose');
// const request = require('request');
const emoji = require('node-emoji');
const { createPromotion, getPromotion } = require('./models/Promotion');
const crawler = require('./src/crawler');
// const { createMediaUploadURL, schedule } = require('./hs');
const { schedule } = require('./puppeteer');
require('dotenv').config({ path: './.env' });

const regexp = /([A-Z0-9_-]{1,}\.(?:png|jpg|gif|jpeg))/i;
const start = new Date();
const scrape = (pub) => Promise.resolve(eval(`crawler.crawl${pub}()`)).then((promos) => promos);

const filterOut = (promos) => {
  const promises = promos.map((promo) => getPromotion(promo.url).then((exists) => {
    if (exists) return null;
    return promo;
  })).filter((p) => p !== null);

  return Promise.resolve(mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }))
    .then(() => Promise.all(promises).then((result) => result.filter((p) => p !== null)).catch((err) => console.log(err)));
};

const downloadImages = (promos) => {
  const promises = promos.map((promo) => {
    const path = `./downloads/${promo.publisher}-${dateFormat(start, 'dd-mmm-yy')}`;
    if (!fs.existsSync(path)) {
      fs.mkdir(path, { recursive: true }, (err) => { console.log(err); });
    }
    const imgUrl = `${path}/${regexp.exec(promo.img)[1]}`;
    return download.image({
      url: promo.img,
      dest: imgUrl,
    }).then(() => ({
      ...promo, originalImg: promo.img, img: imgUrl,
    })).catch((err) => console.log(err));
  });

  return Promise.all(promises).then((result) => result.filter((p) => p !== undefined)).catch((err) => console.log(err));
};

const savePosts = (promos) => {
  const promises = promos.map((promo) => createPromotion(promo).then((doc) => doc));

  return Promise.resolve(mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }))
    .then(() => Promise.all(promises).then((result) => result.filter((p) => p !== null)).catch((err) => console.log(err)));
};

const hashtags = {
  goodhousekeeping: '#competition #giveaway #contest #free #fun #prize #winner #instagood #giveaways #travel #sweepstakes #prizes #entertowin #follow #happy #london #freestuff #thatsgoodhousekeeping #peepmypad #mybhghome #simplecozynest #nesttoimpress #lovetohome',
  stylist: '#competition #giveaway #contest #free #fun #prize #winner #instagood #giveaways #travel #sweepstakes #prizes #entertowin #follow #happy #london #freestuff #stylistmagazineuk #graziauk #elleuk #bazaaruk #theoutbound',
};
// Stylist, CNTraveller, MarieClaire
Promise.resolve(scrape('GoodHousekeeping')).then((promos) => {
  console.log('* ALL promotions * ', promos);
  filterOut(promos).then((newPromos) => {
    // console.log('* NEW promotions * ', newPromos);
    downloadImages(newPromos).then((posts) => {
      // add content to posts
      const igPosts = posts.filter((p) => !p.img.includes('.gif')).map((p) => ({ content: emoji.emojify(`${p.title} ${emoji.get('heart_eyes')} ${emoji.get('lollipop')}  , link in bio ↑\n ... \n ${hashtags[p.publisher]}`), ...p }));
      // download images
      console.log('* IG POSTS * ', igPosts);
      schedule(igPosts).then((scheduled) => {
        console.log('* SCHEDULED POSTS * ', scheduled);
        savePosts(scheduled).then((results) => {
          console.log('* SAVED IG posts * ', results);
          mongoose.connection.close();
        });
      });
    });
  });
});
