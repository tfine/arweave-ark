const express = require("express");
const app = express();
const base64url = require("base64url");
let requester = require("request");

// set arweave domain to use: TO-DO look for other options if fails?
const arweave_domain = "arweave.net";

// use pug templating
app.set("view engine", "pug");

app.use(express.static("public"));

// information page
app.get("", (request, response) => {
  response.render("index");  
});

// redirect request with an arweave id
app.get("/:id/", (request, response) => {
  response.redirect(`http://arweave.net/${request.params['id']}`)
});

// if word question after arweave id, look from what, where, when, and who, display as metadata


// NEED TO MAKE question a question mark, won't work in Express
app.get("/:id/question", (request, response) => {
  
  let what = "";
  let where = "";
  let when = "";
  let who = "";

  // create arweave url for transaction data
  var arweave_url = `https://${arweave_domain}/tx/${request.params['id']}`;
  
  // options for arweave direction
  
  let options = {
    method: "GET",
    url: arweave_url
  };

  // look for ERC metadata in arweave tags 
  requester(options, function(error, response2, body) {
    if (error) {
      console.error(error);
    }

    // TO-DO: need to verify that this was a valid arweave transaction
    
    var tags = JSON.parse(body).tags;
    
    for (var tag of tags) {
      if (base64url.decode(tag["name"]) == "who") {
        who = base64url.decode(tag["value"]);
      }

      if (base64url.decode(tag["name"]) == "what") {
        what = base64url.decode(tag["value"]);
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
      where: `where: ${request.params['id']}`,
      when: `when: ${when}`
    });
    
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
