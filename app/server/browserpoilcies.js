/**
 * Created by chenhao on 15/11/6.
 */

// Font Awesome
BrowserPolicy.content.allowOriginForAll('maxcdn.bootstrapcdn.com');

// Stripe
BrowserPolicy.content.allowOriginForAll('*.stripe.com');
BrowserPolicy.framing.restrictToOrigin('checkout.stripe.com');

// Mapbox
BrowserPolicy.content.allowOriginForAll('*.mapbox.com');

// Amazon S3
BrowserPolicy.content.allowOriginForAll('s3.amazonaws.com');