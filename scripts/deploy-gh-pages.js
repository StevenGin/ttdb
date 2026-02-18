#!/usr/bin/env node
/**
 * Deploy TTDB static site to GitHub Pages (gh-pages branch).
 *
 * Usage:
 *   npm run deploy
 *
 * This script assumes `npm run build:static` has already been run
 * (or it will run it automatically).
 *
 * Requirements:
 *   - git configured with push access to origin
 *   - GitHub Pages enabled on the gh-pages branch
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, cpSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist-static')

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts })
}

function runCapture(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim()
}

async function deploy() {
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║  TTDB — GitHub Pages Deployment          ║')
  console.log('╚══════════════════════════════════════════╝\n')

  // 1. Build static site
  console.log('Step 1/4: Building static site...')
  run('npm run build:static')

  if (!existsSync(DIST)) {
    console.error('Build output not found at dist-static/. Aborting.')
    process.exit(1)
  }

  // 2. Add .nojekyll to prevent GitHub Pages from ignoring _ files
  writeFileSync(join(DIST, '.nojekyll'), '')

  // 3. Get current branch
  const currentBranch = runCapture('git rev-parse --abbrev-ref HEAD')
  console.log(`\nStep 2/4: Current branch: ${currentBranch}`)

  // 4. Push dist-static to gh-pages branch using git subtree push or worktree
  console.log('\nStep 3/4: Deploying to gh-pages branch...')

  try {
    // Check if gh-pages branch exists remotely
    const remoteBranches = runCapture('git ls-remote --heads origin gh-pages')
    const ghPagesExists = remoteBranches.includes('gh-pages')

    if (ghPagesExists) {
      // Use git subtree push
      run('git add -f dist-static/')
      run('git stash')
      try {
        run('git subtree push --prefix dist-static origin gh-pages')
      } catch {
        // Fallback: force push using orphan
        run('git stash pop || true')
        deployViaOrphan()
        return
      }
      run('git stash pop || true')
    } else {
      deployViaOrphan()
      return
    }
  } catch {
    deployViaOrphan()
    return
  }

  console.log('\n✓ Step 4/4: Deployment complete!')
  printSuccess()
}

function deployViaOrphan() {
  console.log('Using orphan branch strategy...')
  const ROOT_PATH = ROOT

  // Create a temp directory for the orphan branch
  const tmpDir = join(ROOT, '.tmp-gh-pages')
  if (existsSync(tmpDir)) {
    execSync(`rm -rf "${tmpDir}"`, { stdio: 'inherit' })
  }

  mkdirSync(tmpDir)
  execSync('git init', { cwd: tmpDir, stdio: 'inherit' })
  execSync(`git remote add origin ${runCapture('git remote get-url origin')}`, { cwd: tmpDir, stdio: 'inherit' })

  // Copy dist-static contents to tmp dir
  cpSync(DIST, tmpDir, { recursive: true })

  // Create initial commit
  execSync('git add -A', { cwd: tmpDir, stdio: 'inherit' })
  execSync('git commit -m "Deploy TTDB static site to GitHub Pages"', { cwd: tmpDir, stdio: 'inherit' })

  // Force push to gh-pages
  execSync('git push -f origin HEAD:gh-pages', { cwd: tmpDir, stdio: 'inherit' })

  // Cleanup
  execSync(`rm -rf "${tmpDir}"`, { stdio: 'inherit' })

  console.log('\n✓ Deployment complete!')
  printSuccess()
}

function printSuccess() {
  try {
    const repoUrl = runCapture('git remote get-url origin')
      .replace('git@github.com:', 'https://github.com/')
      .replace('.git', '')

    const parts = repoUrl.split('/')
    const username = parts[parts.length - 2]
    const repo = parts[parts.length - 1]

    console.log('\n╔══════════════════════════════════════════╗')
    console.log('║  Your site will be live at:              ║')
    console.log(`║  https://${username}.github.io/${repo}/`)
    console.log('║  (May take a minute to update)           ║')
    console.log('╚══════════════════════════════════════════╝\n')
  } catch {
    console.log('\n✓ Deployment complete! Check your GitHub Pages URL.\n')
  }
}

deploy().catch(err => {
  console.error('\n✗ Deployment failed:', err.message)
  console.error('\nManual steps:')
  console.error('  1. npm run build:static')
  console.error('  2. Deploy dist-static/ to your gh-pages branch')
  process.exit(1)
})
