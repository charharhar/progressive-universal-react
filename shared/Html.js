import React from 'react';

function Html (props) {
  const {
    title,
    description,
    styles,
    scripts,
    vendorDll,
    jsonLd,
    inlineScript,
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
        {
          styles &&
            <link
              rel="stylesheet"
              type="text/css"
              href={styles}
            />
        }
      </head>
      <body>
        <div
          id="app"
          dangerouslySetInnerHTML={{ __html: children }}
          >
        </div>
        { vendorDll && <script type="text/javascript" src={vendorDll}></script> }
        { scripts && <script type="text/javascript" src={scripts}></script> }
        { jsonLd && jsonLd }
        { inlineScript && inlineScript }
      </body>

    </html>
  )
}

export default Html;
