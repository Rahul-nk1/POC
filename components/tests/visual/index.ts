//@ts-ignore
import { getAutomaticScenarios } from "@discovery/client-core/visual-tests/getScenarios"
// put custom scenarios in `tests/visual/`
import { customScenarios } from "./customScenarios"

const backstop = require("backstopjs")

const cosmos = require("react-cosmos/dist/webServer")

// required by cosmos
require("regenerator-runtime/runtime")

const mode = process.argv.slice(2)[0]
const isDocker = process.argv.includes("--docker")

// don't run cosmos if option present
const noCosmos = process.argv.includes("--no-cosmos")

const isLinux = process.platform == "linux"
const hostnameCosmos = isDocker && !isLinux ? "host.docker.internal" : "localhost"

const encodeFixture = (component: string, fixture: string, name: string) =>
  encodeURIComponent(
    JSON.stringify({
      path: `components/${component}/__fixtures__/${fixture}`,
      name: name
    })
  )

type Scenario = {
  label: string
  component: string
  fixture: string
  name?: string
}

/**
 * Creates test scenario
 * @param {string} label      a unique string that identifies scenario
 * @param {string} component  path to a component as set up in Cosmos
 * @param {string} fixture    reference to a fixture as set up in Cosmos
 * @param {string?} name      the name if a fixture exposes multiple variations
 */
const scenario = ({ label, component, fixture, name = null }: Scenario) => ({
  label: `${label}_${fixture}`,
  readyEvent: "COSMOS DONE",
  url: `http://${hostnameCosmos}:5000/_renderer.html?_fixtureId=${encodeFixture(
    component,
    fixture,
    name
  )}`
})

//leaving in place for future excluded components
const exculdeComponent = []
let automaticScenarios = getAutomaticScenarios()
automaticScenarios = automaticScenarios.filter((x) => !exculdeComponent.includes(x.component))
console.log(automaticScenarios)
//@ts-ignore
automaticScenarios = automaticScenarios.map(scenario)

/*
 * @param modifyFunc   modify backstop js options
 * @param scenarioList additional test cases
 */

export type BackstopConfig = {
  docker: boolean
  config: {
    dockerCommandTemplate: string
    id: string
    viewports: Array<{ label: string; width: number; height: number }>
    scenarios: Array<{ label: string; readyEvent: string; url: string }>
    paths?: {
      engine_scripts?: string
      bitmaps_reference?: string
      bitmaps_test?: string
      html_report?: string
      json_report?: string
      ci_report?: string
    }
    asyncCaptureLimit: number
    asyncCompareLimit: number
    engine: string
    engineOptions: any
    report: Array<string>
    ci: {
      format: string
      testSuiteName: string
    }
    [k: string]: any
  }
}

// TODO: Replace this with core once the issue is resolved.
// import { run } from "@discovery/client-core/visual-tests";
export async function run(
  scenarioList: Array<Scenario>,
  modifyFunc: (a: BackstopConfig) => BackstopConfig = (a: BackstopConfig) => a
) {
  if (mode == "test" && !noCosmos) await cosmos.startWebServer()

  return backstop(
    mode,
    modifyFunc({
      docker: isDocker,
      config: {
        dockerCommandTemplate:
          'docker run --network="host" --rm -it --mount type=bind,source="{cwd}",target=/src backstopjs/backstopjs:{version} {backstopCommand} {args}',
        id: "eurosport",
        viewports: [
          {
            label: "small",
            width: 320,
            height: 480
          },
          {
            label: "medium",
            width: 480,
            height: 960
          },
          {
            label: "large",
            width: 700,
            height: 1920
          },
          {
            label: "xlarge",
            width: 1024,
            height: 1920
          },
          {
            label: "xxlarge",
            width: 1366,
            height: 1920
          }
        ],
        //@ts-ignore
        scenarios: scenarioList.map(scenario).concat(automaticScenarios),
        paths: {
          engine_scripts: "tests/visual/backstop_data/engine_scripts",
          bitmaps_reference: "tests/visual/backstop_data/bitmaps_reference",
          bitmaps_test: "tests/visual/backstop_data/bitmaps_test",
          html_report: "tests/visual/backstop_data/html_report",
          ci_report: "tests/visual/backstop_data/ci_report"
        },
        asyncCaptureLimit: 5,
        asyncCompareLimit: 50,
        engine: "puppeteer",
        engineOptions: {
          args: ["--no-sandbox"]
        },
        report: ["CI"],
        ci: {
          format: "junit",
          testSuiteName: "backstopJS"
        }
      }
    })
  )
}

run(customScenarios, (options) => {
  options.config.id = "tve"
  return options
})
  .then((info) => {
    console.log(info)
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
