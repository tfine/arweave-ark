const express = require("express");
const app = express();
const base64url = require("base64url");
let requester = require("request");

// use pug templating
app.set("view engine", "pug");

app.use(express.static("public"));

// 
app.get("", (request, response) => {
  response.render("index");  
});

app.get("/:id/", (request, response) => {
  response.redirect(`http://arweave.net/${request.params['id']}`)
});

app.get("/:id/question", (request, response) => {
  
  let what = "";
  let where = "";
  let when = "";
  let who = "";

  // create arweave url
  var arweave_url = `https://arweave.net/tx/${request.params['id']}`;
  
  let options = {
    method: "GET",
    url: arweave_url
  };

  // look for ERC metadata in arweave tags 
  requester(options, function(error, response2, body) {
    if (error) {
      console.error(error);
    }

    var tags = JSON.parse(body).tags;
    
    for (var tag of tags) {
      if (base64url.decode(tag["name"]) == "who") {
        who = base64url.decode(tag["value"]);
      }

      if (base64url.decode(tag["name"]) == "what") {
        what = base64url.decode(tag["value"]);
      }

      if (base64url.decode(tag["name"]) == "where") {
        where = base64url.decode(tag["value"]);
      }

      if (base64url.decode(tag["name"]) == "when") {
        when = base64url.decode(tag["value"]);
      }
    }
    
    // send tags to templating engine
    response.render("metadata", {
      title: "",
      who: `who: ${who}`,
      what: `what: ${what}`,
      where: `where: ${where}`,
      when: `when: ${when}`
    });
    
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
