const graphql = require('graphql');
const {
   GraphQLObjectType,
   GraphQLString,
   GraphQLInt,
   GraphQLSchema
} = graphql;
const axios = require('axios');
const UserType = new GraphQLObjectType({
   name: 'User',
   fields: {
      id: {type: GraphQLString},
      firstName: { type: GraphQLString},
      age: {type: GraphQLInt}
   }
})

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      //1you are looking for user
      user: {
         //3 i will give back usertypeobj
         type: UserType,
         //if you will give me id of user that u are looking for i willreturn UserType object
         //it is specify arg that is require
         //2if u ggive me id
         args: { id: { type: GraphQLString }},
         //in resolve function we actually go in to a database or data store and find data that we looking for
         resolve(parentValue, args) {
            //wtvr arg we pass in original query
            //if our query expect to be provide with id,than that id will be present in args obj
           return axios.get( `http://localhost:3000/users/${args.id}`)
               .then((res) => res.data);
         }
      }
   }
});

 //takesin a root query nd return a graphql schema instance
module.exports = new GraphQLSchema({
   query: RootQuery
});