const express = require('express');
//compatible btw express nd graphql
//const expressGraphQL = require('express-graphql');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema')
const app = express();

//whn req come to express use graphql
app.use('/graphql',expressGraphQL({
   schema,
   //its development tool,only use in development env
   //makesure abt query
   graphiql: true
}));

app.listen(4000, () => {
   console.log('listening');
});
