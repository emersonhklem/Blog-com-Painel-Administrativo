const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')
const connection = require("./database/database")

const usersController = require("./users/UsersController")
const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")


const Article = require ('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

app.set('view engine', 'ejs');


app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 30000 }
}))

app.use( express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


connection.authenticate().then(() =>{
    console.log("Conexão feita com sucesso")
}).catch((error)=>{
 console.log(error);
})

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get ("/", (req, res) =>{

    
  
  
    Article.findAll({
      order: [
          ['id', 'DESC']
      ],
      limit: 4
  }).then(articles =>{
      Category.findAll().then(categories =>{
        res.render("index", {articles: articles, categories: categories});  
      })
  
  })
  
})  
  app.get("/:slug", (req,res)=>{
      var slug = req.params.slug;
      Article.findOne({
          where:{
              slug: slug,
          }
          
      }).then(article =>{
          if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article", {article: article, categories: categories});  
              })
          }else{
              res.redirect("/")
          }
          
      }).catch( err =>{
          res.redirect("/")
      })
  })

  app.get("/category/:slug", (req, res) =>{
      var slug = req.params.slug;
      Category.findOne({
          where: {
              slug: slug,
          },
          include: [{model: Article}]
      }).then( category => {
          if(category != undefined){

            Category.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories: categories})
            })
          }else{
              res.redirect("/")
          }
      }).catch( err =>{
          res.redirect("/")
      })
  })

app.listen(8081, () => {
    console.log("O servidor está rodando...");
})