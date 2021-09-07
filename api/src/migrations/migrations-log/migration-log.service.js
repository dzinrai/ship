const db = require('db');

const validateSchema = require('./migration-log.schema.js');

function createService(dbInstance) {
  const newService = dbInstance.createService('__migrationLog', { validate: validateSchema });

  newService.startMigrationLog = (_id, startTime, migrationVersion) => {
    return newService.atomic.findOneAndUpdate({ _id }, {
      $set: {
        migrationVersion,
        startTime,
        status: 'running',
      },
      $setOnInsert: {
        _id,
      },
    }, { upsert: true });
  };

  newService.failMigrationLog = (_id, finishTime, err) => newService.atomic.update({ _id }, {
    $set: {
      finishTime,
      status: 'failed',
      error: err.message,
      errorStack: err.stack,
    },
  });

  newService.finishMigrationLog = (_id, finishTime, duration) => newService.atomic.update({ _id }, {
    $set: {
      finishTime,
      status: 'completed',
      duration,
    },
  });
}

const service = db(createService);

module.exports = service;
