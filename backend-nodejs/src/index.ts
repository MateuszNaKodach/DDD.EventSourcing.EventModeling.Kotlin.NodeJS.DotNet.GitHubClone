import { runSlices } from './slices/app';

const slicesPort = process.env.REST_API_PORT || process.env.PORT || 4000;

runSlices().then(({ restApi }) =>
  restApi.listen(slicesPort, () => {
    console.log(`[App]: REST API listening on port ${slicesPort}`);
    console.log(`[App]: You can access REST API documentation at http://localhost:${slicesPort}/swagger`);
  }),
);
