import React from 'react';

function Html (props) {
  const {
    title,
    description,
    styles,
    scripts,
    vendorDll,
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

        <meta property="fb:app_id" content="" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://url.com" />
        <meta property="og:image" content="link to image" />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />

        <link rel="apple-touch-icon" href="" />
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
        {
          vendorDll &&
            <script type="text/javascript" src={vendorDll}></script>
        }
        {
          scripts &&
          <script type="text/javascript" src={scripts}></script>
        }
        <script type="application/ld+json">
        {`
          {
            "@context": "http://schema.org",
            "@type": "Organization",
            "url": "http://www.your-company-site.com",
            "logo": "http://www.example.com/logo.png",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+1-401-555-1212",
              "contactType": "customer service"
            }]
          }
        `}
        </script>
      </body>

    </html>
  )
}

export default Html;
