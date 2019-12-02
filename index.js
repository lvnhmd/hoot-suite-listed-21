/* eslint-disable max-len */
/* eslint-disable no-console */
const download = require('image-downloader');
const dateFormat = require('dateformat');
const fs = require('fs');
const mongoose = require('mongoose');
const { createPromotion, getPromotion } = require('./models/Promotion');
const crawler = require('./src/crawler');
require('dotenv').config({ path: './.env' });

const regexp = /([A-Z0-9_-]{1,}\.(?:png|jpg|gif|jpeg))/i;
const start = new Date();
const output = () => {
  Promise.resolve(crawler.crawl()).then((promos) => {
    const promises = promos.map((promo) => getPromotion(promo.url).then((exists) => {
      if (exists) return null;

      return createPromotion(promo).then((doc) => {
        const path = `./downloads/${doc.publisher}-${dateFormat(start, 'dd-mmm-yy')}`;
        if (!fs.existsSync(path)) {
          fs.mkdir(path, { recursive: true }, (err) => { console.log(err); });
        }
        return download.image({
          url: doc.img,
          dest: `${path}/${regexp.exec(doc.img)[1]}`,
        }).then(() => doc).catch((err) => console.log(err));
      });
    })).filter((p) => p !== null);

    return Promise.resolve(mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }))
      .then(() => Promise.all(promises).then((result) => {
        console.log('* New promotions * ', result.filter((p) => p !== null));
        mongoose.connection.close();
      })
        .catch((err) => console.log(err)));
  });
};

output();
