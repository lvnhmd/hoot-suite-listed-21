const request = require('request');

const options = {
  method: 'POST',
  url: 'https://platform.hootsuite.com/v1/messages',
  headers:
   {
     'cache-control': 'no-cache',
     Connection: 'keep-alive',
     Cookie: '__hsaneauuid=5ea2bc8e-4f78-4c27-830a-8473fe502f6b.4n+cqA1I8XjQfRBvwCgb8o7xs2n/I0ob6MstHIOU7LseEPhKlF81t7jXNO700HMkZuGVC2Y4nXH7MgmDeRgxig==; _gcl_au=1.1.1300687640.1575281954; __utmz=26142884.1575281954.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.304820577.1575281954; _fbp=fb.1.1575281954218.694458627; language=en-us; hsMemberPlanInfo=5|5|0|2; __utmc=26142884; _gid=GA1.2.278729129.1576173457; __utma=26142884.304820577.1575281954.1575561048.1576173457.3; trwv.uid=hootsuitemediainc-1575281954165-5cf37b6f%3A3; apiAuthorization=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXUyJ9.eyJtZW1iZXJJZCI6MjA5OTA2OTgsInRva2VuIjoicUY4Wnc2M25DNGdtaWR3TnpEYlZMM3k4aDQ5UnBqRHRyV2NpSEhTUCIsImdzcyI6IjIwOTkwNjk4LThkMjllNmFkNTY4MzQ4MDY5ZjFiZDk1Mzk3ZDc1NWUxOTZkMTY5ODdlZDU3NDVkN2JmOTIwZDlhNDRjYWE2ZDJkYTI1YTc1NTZlNGQ0Yjc4YjA3ZTZkODRhYzVjNjY2NWJjYmJlY2UxMmM3MjQyZmQ5M2ViZGQ1YzNhYzI4NGJhIiwiZXhwIjoxNTc2MjQ1NTE4LCJpYXQiOjE1NzYxOTMxNzN9.V1yVDt1QYwA2rnZAlWe4fdfyL6OOVt1oU1jAyFyKO3ct9_on6gQESj_YVZmSICoHj0gL2I0BblMQn23K3Fcwy9YpRw1toKCQX51PSIxjkYMrL11xg0Rtbi3zoRIqzjrrgzIWWDu3QutaWTDOVxQMRxPGGx6vh_27y-VE1vCnotHwR29LGZTmnfO-xh0mq5pYvqGZCfGbRgJlAZPS8oicXRFtjaupBatvVYHhIW7CZPX5rUqXOz4CUKAOqNYLeeHdkAkCtaq0YFzKphe16J0yvv7VamTt7_XKLQWzX0rxD6C5pwBW9UyYCs-BXe8B_1EYNZzhegBdvDT3MWWnR_5UFA; consent_session=MTU3NjE5MzE3NnxEdi1CQkFFQ180SUFBUkFCRUFBQUJQLUNBQUE9fEZXRXMonKdS8H9y-r8jMvhlLh9wrFtlfjAULOhAnFLZ',
     'Content-Length': '327',
     'Accept-Encoding': 'gzip, deflate',
     Host: 'platform.hootsuite.com',
     'Postman-Token': '4791a693-c9f0-40c6-9e6a-242805db495c,734ddc50-5b05-4998-a507-780f32296544',
     'Cache-Control': 'no-cache',
     'User-Agent': 'PostmanRuntime/7.20.1',
     Authorization: 'Bearer 2qxnTYSz7YJj6NHlEXvkjEvpRzAJOYSRGvtlu4LDKek.1J6AEfqNWNmL_xgsYh76ATT8Xci1eQ6HKmqdPL46JQc',
     'Content-Type': 'application/json',
     Accept: 'application/json;charset=utf-8',
   },
  body:
   {
     text: 'meh bleh',
     socialProfileIds: ['129134802'],
     scheduledSendTime: '2019-12-12T23:50:00Z',
     media: [{ id: 'aHR0cHM6Ly9ob290c3VpdGUtdmlkZW8uczMuYW1hem9uYXdzLmNvbS9wcm9kdWN0aW9uLzIwOTkwNjk4X2VlNjZmNDllLWIzMzktNDA4YS05NGQ1LTA5YWFiMGMxMzEwYi5qcGc=' }],
   },
  json: true,
};

request(options, (error, response, body) => {
  if (error) throw new Error(error);

  console.log(body);
});
