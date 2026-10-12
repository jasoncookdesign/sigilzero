// Google Tag Manager only loads on the production hostname, so local dev,
// CI end-to-end runs and preview hosts never send hits to GA or the Meta Pixel.
export const GTM_PRODUCTION_HOSTNAME = "sigilzero.com";

// Inline loader for <head>. It is the stock GTM snippet with a hostname check
// before the script is injected. window.dataLayer is always created so page
// code that pushes to it keeps working when GTM is not loaded.
export function gtmLoaderScript(containerId: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];
if(location.hostname!==${JSON.stringify(GTM_PRODUCTION_HOSTNAME)})return;
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(containerId)});`;
}
