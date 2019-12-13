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
