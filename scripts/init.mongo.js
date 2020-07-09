//mongo mongodb+srv://admin:mong9933@cluster0.lhqzq.mongodb.net/issuetracker scripts/init.mongo.js

db.issues.remove({});

const issuesDB = [
  {
    id: 1, status: 'New', owner: 'Liz', effort: 5,
    created: new Date('2019-01-15'), due: undefined,
    title: 'Stunting big time',
  },
  {
    id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
    created: new Date('2019-01-16'), due: new Date('2019-02-01'),
    title: 'Missing bottom border on panel',
  },
];

db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });