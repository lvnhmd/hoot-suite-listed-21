/* eslint-disable max-len */
/* eslint-disable no-console */
const download = require('image-downloader');
const dateFormat = require('dateformat');
const fs = require('fs');
const mongoose = require('mongoose');
const emoji = require('node-emoji');
const { createPost, getPost } = require('./models/Post');
const { schedule } = require('./puppeteer');
require('dotenv').config({ path: './.env' });

const regexp = /([A-Z0-9_-]{1,}\.(?:png|jpg|gif|jpeg))/i;
const start = new Date();
// eslint-disable-next-line no-eval
const scrape = (pub) => Promise.resolve(eval(`crawler.crawl${pub}()`)).then((promos) => promos);

const filterOutExistingPosts = (promos) => {
  const promises = promos.map((promo) => getPost(promo.url, 'IG').then((exists) => {
    if (exists) return null;
    return {
      platform: 'IG',
      ...promo,
    };
  })).filter((p) => p !== null);

  // const promises = [];

  promises.push(
    ...promos.map((promo) => getPost(promo.url, 'FB').then((exists) => {
      if (exists) return null;
      return {
        platform: 'FB',
        ...promo,
      };
    })).filter((p) => p !== null),
  );

  return Promise.resolve(
    mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ).then(() => Promise.all(promises)
    .then((result) => result.filter((p) => p !== null))
    .catch((err) => console.log(err)));
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
  const promises = promos.map((promo) => createPost(promo).then((doc) => doc));

  return Promise.resolve(mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }))
    .then(() => Promise.all(promises).then((result) => result.filter((p) => p !== null)).catch((err) => console.log(err)));
};

const hashtags = {
  goodhousekeeping: '#competition #giveaway #contest #free #fun #prize #winner #instagood #giveaways #travel #sweepstakes #prizes #entertowin #follow #happy #london #freestuff #thatsgoodhousekeeping #peepmypad #mybhghome #simplecozynest #nesttoimpress #lovetohome',
  stylist: '#competition #giveaway #contest #free #fun #prize #winner #instagood #giveaways #travel #sweepstakes #prizes #entertowin #follow #happy #london #freestuff #stylistmagazineuk #graziauk #elleuk #bazaaruk #theoutbound',
  cntraveller: '#competition #giveaway #contest #free #fun #prize #winner #instagood #giveaways #travel #sweepstakes #prizes #entertowin #follow #happy #london #freestuff #condenasttraveller #openmyworld #traveltheglobe #roamtheplanet #theoutbound',
};
// Stylist, CNTraveller, GoodHousekeeping,  MarieClaire
Promise.resolve(scrape('CNTraveller')).then((promos) => {
  // console.log('* ALL promotions * ', promos);
  filterOutExistingPosts(promos).then((newPromos) => {
    // console.log('* NEW promotions * ', newPromos);
    downloadImages(newPromos).then((posts) => {
      // add content to instagram posts
      const laterPosts = posts
        .filter((p) => !p.img.includes('.gif'))
        .map((p) => {
          const content = p.platform === 'IG' ? emoji.emojify(
            `${p.title} ${emoji.get('heart_eyes')} ${emoji.get(
              'lollipop',
            )}, link in bio ↑\n... \n${hashtags[p.publisher]}`,
          ) : emoji.emojify(
            `${p.title} ${emoji.get('heart_eyes')} ${emoji.get(
              'lollipop',
            )} \n${p.url}`,
          );

          return {
            content,
            ...p,
          };
        });

      // download images
      // console.log('* LATER POSTS * ', laterPosts);
      const igPosts = laterPosts.filter((p) => p.platform === 'IG');
      console.log('* IG POSTS * ', igPosts);
      const fbPosts = laterPosts.filter((p) => p.platform === 'FB');
      console.log('* FB POSTS * ', fbPosts);


      schedule(igPosts).then((scheduledIGPosts) => {
        console.log('* SCHEDULED IG POSTS * ', scheduledIGPosts);
        schedule(fbPosts).then((scheduledFBPosts) => {
          console.log('* SCHEDULED FB POSTS * ', scheduledFBPosts);
          savePosts(scheduledIGPosts.concat(scheduledFBPosts)).then((results) => {
            console.log('* SAVED LATER posts * ', results);
            mongoose.connection.close();
          });
        });
      });
    });
  });
});
