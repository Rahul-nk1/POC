import React from "react"

import { id } from "@discovery/prelude/lib/data/function"
import "@discovery/common-tve/lib/base.css"
import "../assets/brand-index.css"

/**
 * Note: Unless explicitly imported somewhere, the Nix build will break when resolving React dependencies.
 * However if we explcitly import React somewhere in the components library, the build will resolve the
 * dependency using this import.
 */

import { startApp } from "@discovery/client-core"
import "../assets/brand-index.css"

import { DEVELOPMENT_MODE, SENTRY_DSN } from "@discovery/common-tve/lib/env"

/* The player expects this to exist*/
// TODO: check if we can remove this
window.__ = id

/**
 * For local development, make it `true` to see what compponent
 * is getting rerendered for what reason
 */
const enableWhyDidYouRender = false
const instrument =
  DEVELOPMENT_MODE && enableWhyDidYouRender
    ? import("@welldone-software/why-did-you-render").then(({ default: wdyr }) => {
        wdyr(React, {
          trackAllPureComponents: true
        })
      })
    : Promise.resolve()

const mainTemplateEngine = () => import("./template-engine").then((x) => x.main)

const main = () => instrument.then(mainTemplateEngine)

startApp(main, {
  sentry: { dsn: SENTRY_DSN, tracing: DEVELOPMENT_MODE === false },
  environment: DEVELOPMENT_MODE ? "test" : "prod"
})

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => registrations.forEach((registration) => registration.unregister()))
}
