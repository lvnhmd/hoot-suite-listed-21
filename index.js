/* eslint-disable max-len */
/* eslint-disable no-console */
const download = require('image-downloader');
const dateFormat = require('dateformat');
const fs = require('fs');
const mongoose = require('mongoose');
const request = require('request');
const { createPromotion, getPromotion } = require('./models/Promotion');
const crawler = require('./src/crawler');
const { createMediaUploadURL, schedule } = require('./hs');
require('dotenv').config({ path: './.env' });

const regexp = /([A-Z0-9_-]{1,}\.(?:png|jpg|gif|jpeg))/i;
const start = new Date();
const scrape = () => Promise.resolve(crawler.crawl()).then((promos) => {
  const promises = promos.map((promo) => getPromotion(promo.url).then((exists) => {
    if (exists) return null;

    return createPromotion(promo).then((doc) => {
      const path = `./downloads/${doc.publisher}-${dateFormat(start, 'dd-mmm-yy')}`;
      if (!fs.existsSync(path)) {
        fs.mkdir(path, { recursive: true }, (err) => { console.log(err); });
      }
      const imgUrl = `${path}/${regexp.exec(doc.img)[1]}`;
      return download.image({
        url: doc.img,
        dest: imgUrl,
      }).then(() => ({
        img: imgUrl, title: doc.title, url: doc.url, publisher: doc.publisher,
      })).catch((err) => console.log(err));
    });
  })).filter((p) => p !== null);

  return Promise.resolve(mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }))
    .then(() => Promise.all(promises).then((result) => {
      mongoose.connection.close();
      return result.filter((p) => p !== null);
    }).catch((err) => console.log(err)));
});

Promise.resolve(scrape()).then((promos) => {
  console.log('* New promotions * ', promos);
  promos.forEach((promo) => {
    const imageSize = fs.statSync(promo.img).size;
    console.log('Image size ', imageSize);

    Promise.resolve(createMediaUploadURL(fs.statSync(promo.img).size)).then((result) => {
      console.log('Create media upload url ', result.body.data);
      const { uploadUrl, id } = result.body.data;
      request({
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': imageSize,
        },
        url: uploadUrl,
        body: fs.createReadStream(promo.img),
      },
      // eslint-disable-next-line consistent-return
      (error, response) => {
        console.log('Upload successful!  Server responded with:', response.statusCode);

        setTimeout(() => schedule({
          text: promo.title,
          scheduledSendTime: '2019-12-13T23:50:00Z',
          media: [
            {
              id,
            },
          ],
        }), 1500); // give it a sec so the id can propagate through hs system
      });
    });
  });
});
