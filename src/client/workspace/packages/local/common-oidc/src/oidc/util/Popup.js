Ext.define('Common.oidc.util.Popup', {
    alternateClassName: 'OidcPopup',

    statics: {
        /**
         * Populates a map of window features with a placement centered in front of
         * the current window. If no explicit width is given, a default value is
         * binned into [800, 720, 600, 480, 360] based on the current window's width.
         */
        center(features) {
            if (features.width == null)
                features.width = [800, 720, 600, 480].find(width => width <= window.outerWidth / 1.618) ?? 360;
            features.left ??= Math.max(0, Math.round(window.screenX + (window.outerWidth - features.width) / 2));
            if (features.height != null)
                features.top ??= Math.max(0, Math.round(window.screenY + (window.outerHeight - features.height) / 2));
            return features;
        },

        serialize(features) {
            return Object.entries(features)
                .filter(([, value]) => value != null)
                .map(([key, value]) => `${key}=${typeof value !== "boolean" ? value : value ? "yes" : "no"}`)
                .join(",");
        }
    }
});