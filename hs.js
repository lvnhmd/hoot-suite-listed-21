// eslint-disable-next-line global-require
const curl = new (require('curl-request'))();

const headersToSend = ['Authorization: Bearer Lve2wY2L5KYaCSt325wJziBLc-UvjDes_PcLFckIM5A.WHvP1UEq04RT8DNb42PWc4QOtUKknVJ8qFNSPRZhfZQ'];

exports.createMediaUploadURL = (size) => curl.setHeaders(headersToSend)
  .setBody(JSON.stringify({ sizeBytes: size, mimeType: 'image/jpeg' }))
  .post('https://platform.hootsuite.com/v1/media') // env
  .catch((e) => {
    console.log(e);
  });

exports.schedule = (data) => {
  headersToSend.push('Content-Type: application/json');
  curl.setHeaders(headersToSend)
    .setBody(JSON.stringify({
      text: data.text,
      socialProfileIds: [
        '129134802',
      ],
      scheduledSendTime: data.scheduledSendTime,
      media: data.media,
    }))
    .post('https://platform.hootsuite.com/v1/messages') // env
    .then(({ statusCode, body, headers }) => {
      console.log(statusCode, body, headers);
    })
    .catch((e) => {
      console.log(e);
    });
};

// if you want to use it , put it in index where it says /* Hoot-suite functionality */

// promos.forEach((promo) => {
//   const imageSize = fs.statSync(promo.img).size;
//   console.log('Image size ', imageSize);

//   Promise.resolve(createMediaUploadURL(fs.statSync(promo.img).size)).then((result) => {
//     console.log('Create media upload url ', result.body.data);
//     const { uploadUrl, id } = result.body.data;
//     // TODO promisify uploadMeadia and schedule
//     // generate time , each promo after 10 min or something
//     // implement auth
//     // add tags , emojis ? and link in bio
//     request({
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'image/jpeg',
//         'Content-Length': imageSize,
//       },
//       url: uploadUrl,
//       body: fs.createReadStream(promo.img),
//     },
//     // eslint-disable-next-line consistent-return
//     (error, response) => {
//       console.log('Upload successful!  Server responded with:', response.statusCode);

//       setTimeout(() => schedule({
//         // text: emoji.emojify(`${promo.title} :arrow_up link in bio ${promo.url}`),
//         text: `${promo.title} :arrow_up link in bio ${promo.url}`,
//         scheduledSendTime: '2019-12-13T23:50:00Z',
//         media: [
//           {
//             id,
//           },
//         ],
//       }), 1500); // give it a sec so the id can propagate through hs system
//     });
//   });
// });
