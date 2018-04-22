import { v4 } from 'uuid';

import { connect } from '../connection';
import wtfuuid from '../wtfuuid';

setImmediate(async () => {

  const connection = await connect({
    host: process.env.ES_HOST!,
    port: 1113,
    credentials: {
      username: process.env.ES_USERNAME!,
      password: process.env.ES_PASSWORD!,
    },
  });

  connection.$
    .filter(event => event.code === 199)
    .subscribe((event) => {
      connection.send({
        code: 204,
        correlationId: event.correlationId,
        data: {
          processedEventIds: [ event.data.event.link.eventId ],
          subscriptionId: '$ce-dev_test_shareable::dev_test_shareable',
        },
      });
    });
  connection.send({
    code: 197,
    data: {
      allowedInFlightMessages: 100,
      eventStreamId: '$ce-dev_test_shareable',
      subscriptionId: 'dev_test_shareable',
    },
  });
  setInterval(() => {
    const command = {
      code: 130,
      data: {
        eventStreamId: `dev_test_shareable-resource-${v4()}`,
        expectedVersion: -2,
        requireMaster: false,
        events: [ {
          data: Buffer.from(JSON.stringify({ it: 'doesnt matter' })),
          dataContentType: 1,
          eventId: wtfuuid.write(v4()),
          eventType: 'TestEvent',
          metadataContentType: 0,
        }, {
          data: Buffer.from(JSON.stringify({ it: 'doesnt matter' })),
          dataContentType: 1,
          eventId: wtfuuid.write(v4()),
          eventType: 'TestEvent',
          metadataContentType: 0,
        }, {
          data: Buffer.from(JSON.stringify({ it: 'doesnt matter' })),
          dataContentType: 1,
          eventId: wtfuuid.write(v4()),
          eventType: 'TestEvent',
          metadataContentType: 0,
        }, {
          data: Buffer.from(JSON.stringify({ it: 'doesnt matter' })),
          dataContentType: 1,
          eventId: wtfuuid.write(v4()),
          eventType: 'TestEvent',
          metadataContentType: 0,
        }, {
          data: Buffer.from(JSON.stringify({ it: 'doesnt matter' })),
          dataContentType: 1,
          eventId: wtfuuid.write(v4()),
          eventType: 'TestEvent',
          metadataContentType: 0,
        } ],
      },
    };
    connection.send(command);
  }, 1000);

});
