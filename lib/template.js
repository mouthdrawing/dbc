module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>drawing container - ${title}</title>
      <meta charset="utf-8">
      <style>
        html,
        body {
          margin: 0;
          padding: 0;
        }

        .page__wrapper {
          width: 1262.835px;
          height: 892.914px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cover__container,
        .page__inner {
          width: 1092.756px;
          height: 722.835px;
          display: flex;
        }

        .cover__container {
          display: flex;
          flex-direction: column;
        }

        .book__title,
        .book__author {
          margin-left: 100px;
        }

        .book__title {
          margin-top: 150px;
          margin-bottom: 200px;
          font-size: 2.5em;
        }

        .page__inner {
          justify-content: space-between;
        }

        .page__section {
          width: 503.85825px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <h1><a href="/">drawing container</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (topics) {
    var list = "<ul>";
    var i = 0;
    while (i < topics.length) {
      list =
        list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + "</ul>";
    return list;
  },
  page: function (topics) {
    var page = "<div class='book__container'>";
    var i = 0;
    while (i < topics.length) {
      page =
        page +
        `
        <div class='page__wrapper'>
          <div class='page__inner'>
            <section class='page__section'>
              ${topics[i].image}
            </section>
            <section class="page__section">
              ${topics[i].text}
            </section>
          </div>
        </div>`;
      i = i + 1;
    }
    page = page + "</div>";
    return page;
  },
};
