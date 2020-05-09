var http = require("http");
var url = require("url");
var qs = require("querystring");
var template = require("./lib/template.js");
var db = require("./lib/db");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      db.query(`SELECT * FROM topic`, function (error, topics) {
        var title = "Welcome";
        var list = template.list(topics);
        var pages = template.page(topics);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${pages}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (
          error2,
          topic
        ) {
          if (error2) {
            throw error2;
          }
          var title = topic[0].title;
          var image = topic[0].image;
          var text = topic[0].text;
          var list = template.list(topics);
          var html = template.HTML(
            title,
            list,
            `<h2>${title}</h2>
              <div class="page__wrapper">
                <div class="page__inner">
                  <section class="page__section">
                    ${image}
                  </section>
                  <section class="page__section">
                    <span class="text">${text}</span>
                  </section>
                </div>
              </div>`,
            `<a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      var title = "create";
      var list = template.list(topics);
      var html = template.HTML(
        title,
        list,
        `
        <form action="/create_process" method="post">
          <div class="form__section">
            <span class="form__title">text<span>
            <input type="text" name="title" style="width: 400px;">
          </div>
          <div class="form__section">
            <span class="form__title">image<span>
              <textarea name="image" placeholder="image" style="width: 400px; height: 200px"></textarea>
          </div>
          <div class="form__section">
            <span class="form__title">text<span>
            <textarea name="text" placeholder="text" style="width: 400px; height: 200px"></textarea>
          </div>
          <div class="form__section">
            <input type="submit">
          </div>
        </form>
        `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      db.query(
        `
        INSERT INTO topic (title, image, text, created, author_id)
          VALUES (?, ?, ?, NOW(), ?)`,
        [post.title, post.image, post.text, 1],
        function (error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end();
        }
      );
    });
  } else if (pathname === "/update") {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (
        error2,
        topic
      ) {
        if (error2) {
          throw error2;
        }
        var list = template.list(topics);
        var html = template.HTML(
          topic[0].title,
          list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <div class="form__section"> 
              <span class="form__title">text<span>
              <input type="text" name="title" value="${topic[0].title}" style="width: 400px;">
            </div>
            <div class="form__section">
              <span class="form__title">image<span>
              <textarea name="image" placeholder="image" style="width: 400px; height: 200px">${topic[0].image}</textarea>
            </div>
            <div class="form__section">
              <span class="form__title">text<span>
              <textarea name="text" placeholder="text" style="width: 400px; height: 200px">${topic[0].text}</textarea>
            </div>
            <div class="form__section">
              <input type="submit">
            </div>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      db.query(
        `UPDATE topic SET title=?, image=?, text=?, author_id=1 WHERE id=?`,
        [post.title, post.image, post.text, post.id],
        function (error, result) {
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        }
      );
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      db.query("DELETE FROM topic WHERE id = ?", [post.id], function (
        error,
        result
      ) {
        if (error) {
          throw error;
        }
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(4000);
