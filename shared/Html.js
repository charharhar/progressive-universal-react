import React, { Component } from 'react';

export default class Html extends Component {
  render() {
    const {
      title,
      description,
      styles,
      scripts,
      vendorDll,
      children
    } = this.props;

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta property="fb:app_id" content="" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content="https://url.com" />
          <meta property="og:image" content="link to image" />
          <meta property="og:type" content="website" />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
          <meta property="og:site_name" content={title} />

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
              <script src={vendorDll}></script>
          }
          <script src={scripts}></script>
          <script type="application/ld+json">
          {
            JSON.stringify({
              "@context": "http://schema.org",
              "@type": "Organization",
              "name": title,
              "url": "https://www.url.com",
              "image": {
                "@type": "ImageObject",
                "url": "url img",
                "width": 260,
                "height": 120
              },
              "author": {
                "@type": "Organization",
                "name": title,
                "logo": {
                  "@type": "ImageObject",
                  "url": "logo",
                  "width": 260,
                  "height": 120
                }
              }
            })
          }
          </script>
        </body>

      </html>
    )
  }
}
