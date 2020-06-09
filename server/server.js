const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

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
	serialize(value) {
		return value.toISOString();
	},
	parseValue(value) {
		return new Date(value);
	},
	parseLiteral(ast) {
		return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
	},
});

const resolvers = {
	Query: {
		about: () => aboutMessage,
		issueList,
	},
	Mutation: {
		setAboutMessage,
		issueAdd,
	},
	GraphQLDate,
};

function setAboutMessage(_, { message }) {
	return aboutMessage = message;
}

function issueList() {
	return issuesDB;
}

function issueAdd(_, { issue }) {
	issue.created = new Date();
	issue.id = issuesDB.length + 1;
	if (issue.status == undefined) issue.status = 'New';
	issuesDB.push(issue);
	return issue;
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