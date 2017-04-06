// Absolute imports
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom/server'
import serialize from 'serialize-javascript'
import Helmet from 'react-helmet'
import config from 'config'

// Relative imports
import styles from '../containers/App/App.styles'

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default function Html(props) {

  const { assets, component, store } = props
  const content = component ? ReactDOM.renderToString(component) : ''
  const head = Helmet.rewind()

  /* eslint-disable max-len */
  /* eslint-disable global-require */

  return (
    <html lang='en'>
      <head>

        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <link rel='icon' type='image/png' sizes='32x32' href='https://abroadwith.imgix.net/app/favicon/favicon_v2.png' />

        <link href='https://fonts.googleapis.com/css?family=Heebo:500|Karla:400,700' rel='stylesheet' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        {/* Production styles */}
        {Object.keys(assets.styles).map((style, key) =>
          <link href={assets.styles[style]} key={key} media='screen, projection'
            rel='stylesheet' type='text/css' charSet='UTF-8'
          />
        )}

        {/* Development styles */}
        {Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/App/App.styles')._style }} /> : null}

      </head>

      <body style={styles.app}>

        {/* This is the actual app root node */}
        <div id='content' dangerouslySetInnerHTML={{ __html: content }} />

        {/* Non-critical styles */}
        <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css' />

        {/* Several important data objects are hydrated into the window object */}

        {/* Redux store */}
        <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} />

        {/* Runtime environment config */}
        <script dangerouslySetInnerHTML={{ __html: `window.__config=${serialize(config)};` }} />

        {/* Google Maps API */}
        <script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ&libraries=places' />

        {/* Main JavaScript assets */}
        <script src={assets.javascript.vendor} charSet='UTF-8' />
        <script src={assets.javascript.main} async defer charSet='UTF-8' />

        {/* Analytics scripts, production only */}
        {process.env.NODE_ENV === 'production' &&
          <span>

            {/* Google Analytics */}
            <script dangerouslySetInnerHTML={{ __html: '(function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script","https://www.google-analytics.com/analytics.js","ga");ga("create","UA-74192229-1","auto");ga("send","pageview")' }} />

            {/* Facebook Pixel */}
            <script dangerouslySetInnerHTML={{ __html: '!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js"); fbq("init", "759092950923015"); fbq("track", "PageView");' }} />

            {/* Hubspot Tracking */}
            <script dangerouslySetInnerHTML={{ __html: '!function(e,t,a,n){if(!e.getElementById(a)){var s=e.createElement(t),c=e.getElementsByTagName(t)[0];s.id=a,s.src="//js.hs-analytics.net/analytics/"+Math.ceil(new Date/n)*n+"/2343190.js",c.parentNode.insertBefore(s,c)}}(document,"script","hs-analytics",3e5);' }} />

            {/* Crazy Egg */}
            <script dangerouslySetInnerHTML={{ __html: 'setTimeout(function(){var a=document.createElement("script");var b=document.getElementsByTagName("script")[0];a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0058/7685.js?"+Math.floor(new Date().getTime()/3600000);a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);' }} />

          </span>
        }

      </body>

    </html>
  )
}

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
}
