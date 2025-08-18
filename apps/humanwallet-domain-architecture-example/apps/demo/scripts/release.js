// scripts/release.js
import inquirer from "inquirer"
import { execSync } from "child_process"
import fs from "fs"

const encoding = "utf-8"

function checkGitStatus() {
  // Check for pending changes
  const status = execSync("git status --porcelain", { encoding }).toString()
  if (status !== "") {
    throw new Error("There are pending changes. Commit or stash them before continuing.")
  }

  // Check current branch
  const currentBranch = execSync("git branch --show-current", { encoding }).toString().trim()
  if (currentBranch !== "develop") {
    throw new Error(`You must be on develop branch. Current branch: ${currentBranch}`)
  }

  // Update and check if we're up to date
  console.log("Updating branch...")
  execSync("git remote update", { stdio: "inherit", encoding })

  const localCommit = execSync("git rev-parse HEAD", { encoding }).toString().trim()
  const remoteCommit = execSync("git rev-parse @{u}", { encoding }).toString().trim()

  if (localCommit !== remoteCommit) {
    throw new Error("You're not up to date with remote. Pull changes before continuing.")
  }
}

async function main() {
  try {
    // Check git status before starting
    checkGitStatus()

    const { version: currentVersion } = JSON.parse(fs.readFileSync("package.json", encoding))

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "bumpType",
        message: `Current version: ${currentVersion}\nWhat type of change is this?`,
        choices: [
          { name: "major - Breaking changes", value: "major" },
          { name: "minor - New features (backwards compatible)", value: "minor" },
          { name: "patch - Bug fixes", value: "patch" },
        ],
      },
      {
        type: "editor",
        name: "changes",
        message:
          "Describe the changes:\n\nVI Commands:\ni -> start writing\nESC -> exit writing mode\n:wq -> save and quit\n:q! -> quit without saving\n\nPress Enter to open editor...",
        postfix: "md",
        validate: (text) => {
          if (!text || text.trim().length === 0) {
            return "Changelog cannot be empty. Use Ctrl+C to cancel"
          }
          return true
        },
      },
    ])

    // Extra validation just in case
    if (!answers.changes || answers.changes.trim().length === 0) {
      console.error("\n❌ Error: Changelog cannot be empty")
      process.exit(1)
    }

    // Calculate new version
    const [major, minor, patch] = currentVersion.split(".").map(Number)
    let newVersion
    switch (answers.bumpType) {
      case "major":
        newVersion = `${major + 1}.0.0`
        break
      case "minor":
        newVersion = `${major}.${minor + 1}.0`
        break
      case "patch":
        newVersion = `${major}.${minor}.${patch + 1}`
        break
    }

    // Update package.json
    const pkg = JSON.parse(fs.readFileSync("package.json", encoding))
    pkg.version = newVersion
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n", encoding)

    // Update CHANGELOG.md
    const date = new Date()
    const formattedDate = `${date.toISOString().split("T")[0]} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`
    const changelogEntry = `\n## [${newVersion}] - ${formattedDate}\n\n${answers.changes}\n`
    const changelog = fs.readFileSync("CHANGELOG.md", encoding)
    fs.writeFileSync("CHANGELOG.md", changelog.replace(/^/, changelogEntry), encoding)

    // Git commands
    execSync("git add package.json CHANGELOG.md", { stdio: "inherit", encoding })
    execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: "inherit", encoding })
    execSync(`git tag -a v${newVersion} -m "${answers.changes}"`, { stdio: "inherit", encoding })
    execSync("git push && git push --tags", { stdio: "inherit", encoding })

    console.log(`\n✅ Version ${newVersion} released successfully`)
  } catch (error) {
    console.error("\n❌ Error:", error.message)
    process.exit(1)
  }
}

main()
