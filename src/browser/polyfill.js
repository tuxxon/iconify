/**
 * This file is part of the simple-svg package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 * @license MIT
 */

/**
 * Observer polyfill loader
 */
(function(local, config, global) {
    "use strict";

    /**
     * Add to init queue
     */
    local.initQueue.push(function() {
        var loading = {
            observer: false,
            classList: false
        };

        var queued = {
            observer: false,
            classList: false
        };

        /**
         * Load script
         *
         * @param {string} url
         * @returns {boolean} True if script has been added to head
         */
        function load(url) {
            var element;

            if (!url.length) {
                // Assume some other functions will load polyfill
                return true;
            }

            if (!document.head) {
                // local.domready should be equal false. if its true, something went wrong
                return local.domready;
            }

            element = document.createElement('script');
            element.setAttribute('src', url);
            element.setAttribute('type', 'text/javascript');
            document.head.appendChild(element);

            return true;
        }

        /**
         * Test if classList is supported
         *
         * @returns {boolean}
         */
        function testClassList() {
            if (!('classList' in document.createElement('div'))) {
                if (!queued.classList) {
                    queued.classList = load(config._classListPolyfill)
                }
                return false;
            }
            return true;
        }


        /**
         * Test is MutationObserver is supported
         *
         * @returns {boolean}
         */
        function testObserver() {
            if (!global.MutationObserver || !global.WeakMap) {
                if (!queued.observer) {
                    queued.observer = load(config._webComponentsPolyfill);
                }
            }
            return true;
        }

        loading.classList = !testClassList();
        loading.observer = !testObserver();

        if (loading.classList || loading.observer) {
            local.initTimeout(function() {
                return !((loading.observer && !testObserver()) || (loading.classList && !testClassList()));
            });
            return false;
        }
        return true;
    });

})(local, local.config, global);
