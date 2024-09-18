import fg from "fast-glob"
import { run } from "npm-check-updates"

/**
 * Update and then log updated dependencies.
 *
 * @param {import("npm-check-updates").RunOptions} runOptions
 */
const updateAndLog = async (runOptions) => {
  const upgraded = await run(runOptions)
  console.log(
    `Upgraded dependencies for ${runOptions.packageFile ?? "./package.json"}:`,
    upgraded,
  )
}

const packageJsonList = await fg("**/package.json", {
  ignore: ["examples/**", "**/node_modules/**"],
})

const excludePackages = [
  "eslint",
  "eslint-config-prettier",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
]

/**
 * @type {Promise<any>[]}
 */
const updatePromise = []

for (const packageFile of packageJsonList) {
  updatePromise.push(
    updateAndLog({
      packageFile,
      upgrade: true,
      filter(packageName) {
        return !excludePackages.includes(packageName)
      },
      target(dependencyName) {
        if (dependencyName === "typescript") {
          return "@next"
        }
        return "latest"
      },
    }),
  )
}

await Promise.all(updatePromise)
