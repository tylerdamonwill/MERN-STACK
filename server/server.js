const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');

let aboutMessage = "Issue Tracker API v1.0";

const issuesDB = [
{
	id: 1, status: 'New', owner: 'Tyler', effort: 5,
	created: new Date('2020-06-06'), due: undefined,
	title: 'Error in console when clicking Add',
},
{
	id: 2, status: 'Assigned', owner: 'Liz', effort: 14,
	created: new Date('2020-05-10'), due: new Date('2020-09-23'),
	title: 'Some random issue',
}
]

const GraphQLDate = new GraphQLScalarType({
	name: 'GraphQLDate',
	description: 'A Date() type in GraphQL as a scalar',
	sreialize(value) {
		return value.toISOString();
	},
});

const resolvers = {
	Query: {
		about: () => aboutMessage,
		issueList,
	},
	Mutation: {
		setAboutMessage,
	},
	GraphQLDate,
};

function setAboutMessage(_, { message }) {
	return aboutMessage = message;
}

function issueList() {
	return issuesDB;
}

const server = new ApolloServer({
	typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
	resolvers,
});

const app = express();

/*const fileServerMiddleware = express.static('public');

app.use('/', fileServerMiddleware); */

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
	console.log('App started on port 3000 my dude');
});