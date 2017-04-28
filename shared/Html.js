import React from 'react';

function Html (props) {
  const {
    title,
    description,
    styleElements,
    scriptElements,
    children
  } = props;

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="application-name" content={title} />
        <meta name="description" content={description} />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#222222" />
        <meta name="msapplication-TileColor" content="#222222" />

        <meta property="fb:app_id" content="" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://url.com" />
        <meta property="og:image" content="link to image" />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />

        <link rel="apple-touch-icon" href="" />
        <link rel="manifest" href="/manifest.json" />
        { styleElements }
      </head>
      <body>
        <div
          id="app"
          dangerouslySetInnerHTML={{ __html: children }}
          >
        </div>
        { scriptElements }
      </body>

    </html>
  )
}

export default Html;
