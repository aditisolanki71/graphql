const graphql = require('graphql');
const {
   GraphQLObjectType,
   GraphQLString,
   GraphQLInt,
   GraphQLList,
   GraphQLSchema,
   GraphQLNonNull
} = graphql;
const axios = require('axios');
const CompanyType = new GraphQLObjectType({
   name: 'Company',
   fields: () => ({
      id: { type: GraphQLString },
      name: {type: GraphQLString},
      description: {type: GraphQLString},
      users : {
         type: new GraphQLList(UserType),
         resolve(parentValue,args) {
            return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
               .then(res => res.data);
         }
      }
   })
});

const UserType = new GraphQLObjectType({
   name: 'User',
   fields: () => ({
      id: { type: GraphQLString},
      firstName: {type: GraphQLString},
      age: {type: GraphQLInt},
      company: {
         type: CompanyType,
         resolve(parentValue,args) {
            //console.log(parentValue,args);
            return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
               .then(res => res.data);
         }
      }
   })
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
      },
      company: {
         type: CompanyType,
         args: {id: { type: GraphQLString }},
         resolve(parentValue,args) {
            return axios.get(`http://localhost:3000/companies/${args.id}`)
               .then(res => res.data)
         }
      }
   }
});

const mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
      addUser: {
         //type field will depend on the type of data that we are going to return for resolve function
         //it sounds like similar to the previous one query
         //whn u have mutation that time collection of data that ure operation on and type that u return might notalways be the same
         //not always gong to return same type userType
         type: UserType,
         //args has similar fun
         //have arg or data that u are going to pass to resolve fun
         //whnvr we make(create) new user,user need name,age and companyid
         //to create firstname and age required use  new GraphQLNonNull
         //it just check that value actiiually passed in or not,don't check age is >18 or any condition
         args: {
            firstName: {type: new GraphQLNonNull(GraphQLString)},
            age: {type:  new GraphQLNonNull(GraphQLInt)},
            companyId: {type: GraphQLString}
         },
         resolve(parentValue,{firstName,age}) {
            console.log('resolve fname',firstName);
            console.log('resolve age',age);
            return axios.post(`http://localhost:3000/users`,{firstName,age})
               .then(res => res.data);
         }
      },
      deleteUser: {
         type: UserType,
         args: {
            id: {type: new GraphQLNonNull(GraphQLString)}
         },
         resolve(parentValue,args) {
            return axios.delete(`http://localhost:3000/users/${args.id}`)
               .then(res=> res.data);
         }
      },
      editUser: {
         type: UserType,
         args: {
            id: { type: new GraphQLNonNull(GraphQLString)},
            firstName: {type: GraphQLString},
            age: {type: GraphQLInt},
            companyId: {type: GraphQLString}
         },
         resolve(parentValue,args) {
            return axios.patch(`http://localhost:3000/users/${args.id}`,args)
               .then(res => res.data)
         } 
      }
   }
});
 //takesin a root query nd return a graphql schema instance
module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation
});