
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com","https://extensions.shopifycdn.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.CgsWKOqO.js","/cdn/shopifycloud/checkout-web/assets/c1/app.DoYLVhEu.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor.CpgHsLpk.js","/cdn/shopifycloud/checkout-web/assets/c1/browser.BetxEPQK.js","/cdn/shopifycloud/checkout-web/assets/c1/phone-phoneCountryCode.CRIc1CaV.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayProgressIntercepts.x2QKWVCr.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon.C_9SDN8i.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shop-discount-offer.DLyhM8ss.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-alternativePaymentCurrency.C0YomgAx.js","/cdn/shopifycloud/checkout-web/assets/c1/extensibility-shared.-eQ0eqyC.js","/cdn/shopifycloud/checkout-web/assets/c1/shared-unactionable-errors.B75dOX66.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-PaymentSessionMutation.C56Lk227.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-ShopPayCheckoutSessionQuery.Beb0XviT.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-setAddressErrors.DMaqOO1w.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useHasOrdersFromMultipleShops.Cp_3BrEb.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon.C_eXYJRt.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.CbjepNAQ.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.DgmLTAwl.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useGeneralPaymentErrorMessage.26xs5rdq.js","/cdn/shopifycloud/checkout-web/assets/c1/CrossBorderConsolidation.CjP5PnXx.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayLogo.C37UY8ZJ.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useForceShopPayUrl.D8b2GOqj.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingGroupsSummaryLine.DjMBqBQg.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.BCBOT4_Z.js","/cdn/shopifycloud/checkout-web/assets/c1/ImpressionEventCapture.DcYBpp3Z.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks.B-R8QdH6.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField.DLCE4DWh.js","/cdn/shopifycloud/checkout-web/assets/c1/ProfilePreviewBar.Bc8gR72A.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUpdateCheckoutAddress.D2RlptLq.js","/cdn/shopifycloud/checkout-web/assets/c1/paypal-express-usePayPalPaymentErrorHandler.Bw1FTebS.js","/cdn/shopifycloud/checkout-web/assets/c1/RememberMeDescriptionText.9ld5UV-5.js","/cdn/shopifycloud/checkout-web/assets/c1/Section.j750jb9z.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer.D4_WfUSb.js","/cdn/shopifycloud/checkout-web/assets/c1/MobileOrderSummary.DW1IM842.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useOnePageFormSubmit.C9GCzfTt.js","/cdn/shopifycloud/checkout-web/assets/c1/SeparatePaymentsNotice.C3wt6fDF.js","/cdn/shopifycloud/checkout-web/assets/c1/FullScreenBackground.D9xX_4qp.js","/cdn/shopifycloud/checkout-web/assets/c1/FloatingPayButton.Dhmw2Btz.js","/cdn/shopifycloud/checkout-web/assets/c1/NoAddressLocation.DbcdRARE.js","/cdn/shopifycloud/checkout-web/assets/c1/Page.DOYmklqO.js","/cdn/shopifycloud/checkout-web/assets/c1/OffsitePaymentFailed.BQGQW7Cq.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-get-negotiation-input.o6Xxvjvr.js","/cdn/shopifycloud/checkout-web/assets/c1/NotFound.BxalLOUN.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-cash-constants.BAZuOsMV.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentErrorBanner.CeWCX7sJ.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList.j8oJ2a-H.js","/cdn/shopifycloud/checkout-web/assets/c1/DutyOptions.mg8J-3bS.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.Wqt-hXVU.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.BBGimjvq.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-shipping-options.8ictM6Cm.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodSelector.Bql9nD2A.js","/cdn/shopifycloud/checkout-web/assets/c1/SubscriptionPriceBreakdown.DWbwddRN.js","/cdn/shopifycloud/checkout-web/assets/c1/component-RuntimeExtension.DgT34Gsk.js","/cdn/shopifycloud/checkout-web/assets/c1/AnnouncementRuntimeExtensions.wIRFW7XI.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-rendering-extension-targets.DdhYK8gk.js","/cdn/shopifycloud/checkout-web/assets/c1/esm-browser-v4.BKrj-4V8.js","/cdn/shopifycloud/checkout-web/assets/c1/ExtensionsInner.CmeQQFGE.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.DQm2XSFQ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/phoneCountryCode.Bz45BrAn.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayProgressIntercepts.CO286Meg.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentSessionMutation.CEMlQpma.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useHasOrdersFromMultipleShops.o3WDCM8A.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.BVsfwQv1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useGeneralPaymentErrorMessage.uqpm88mq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/CrossBorderConsolidation.CRDql5Io.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalizationExtensionField.KuEoN8Dx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.D7YGkQiV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useOnePageFormSubmit.e2oQyPNV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/usePayPalPaymentErrorHandler.1xZZnAMV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/FloatingPayButton.QTSrLh5I.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ProfilePreviewBar.0LqF4awG.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.CU18S7Ap.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayLogo.BrcQzLuH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DutyOptions.LcqrKXE1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Page.BYM12A8B.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OffsitePaymentFailed.BxwwfmsJ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/FullScreenBackground.B_iZlQze.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.BSemv9tH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RuntimeExtension.DWkDBM73.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/AnnouncementRuntimeExtensions.qDifMJI9.css"];
      var fontPreconnectUrls = ["https://cdn.shopify.com"];
      var fontPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0269/8763/files/PFRegalTextPro-RegularA.woff?v=1699049005","https://cdn.shopify.com/s/files/1/0269/8763/files/PFRegalTextPro-RegularA.woff2?v=1699049005"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0269/8763/files/Holderness-Bourne-Logo-Navy_x320.png?v=1681938813"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  