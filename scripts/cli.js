#!/usr/bin/env node
import { spawnSync } from 'child_process'
import { cpSync, rmSync, existsSync, readdirSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(__dirname, '..')
const cwd = process.cwd()

// Files extracted into the user's project at build/dev time — removed afterwards
const EPHEMERAL = ['src', 'svelte.config.js', 'vite.config.ts']

function extract() {
  for (const item of EPHEMERAL) {
    cpSync(join(packageRoot, item), join(cwd, item), { recursive: true, force: true })
  }
}

function cleanup() {
  for (const item of EPHEMERAL) {
    rmSync(join(cwd, item), { recursive: true, force: true })
  }
}

function resolveBin(name) {
  for (const base of [cwd, packageRoot]) {
    const p = join(base, 'node_modules', '.bin', name)
    if (existsSync(p)) return p
  }
  return name
}

function run(bin, args = []) {
  const result = spawnSync(resolveBin(bin), args, { stdio: 'inherit', cwd })
  if (result.status !== 0 && result.status !== null) {
    throw new Error(`${bin} exited with code ${result.status}`)
  }
}

const [,, command] = process.argv

switch (command) {
  case 'build': {
    extract()
    try {
      run('svelte-kit', ['sync'])
      run('vite', ['build'])
      const pagefindResult = spawnSync(
        resolveBin('pagefind'),
        ['--site', 'build', '--glob', 'resource/**/*.html'],
        { stdio: 'inherit', cwd }
      )
      if (pagefindResult.status === 0) {
        cpSync(join(cwd, 'build', 'pagefind'), join(cwd, '.svelte-kit', 'output', 'client', 'pagefind'), { recursive: true, force: true })
      } else {
        console.log('No resource pages — search index skipped')
      }
    } finally {
      cleanup()
    }
    break
  }

  case 'dev': {
    extract()
    try {
      run('vite', ['dev'])
    } finally {
      cleanup()
    }
    break
  }

  case 'preview': {
    run('vite', ['preview', '--outDir', 'build'])
    break
  }

  case 'init': {
    const templateDir = join(packageRoot, 'starter-template')

    // npm strips leading dots from filenames when packing; restore them on copy
    const DOTFILE_MAP = { 'gitignore': '.gitignore' }

    function copyDir(src, dest) {
      mkdirSync(dest, { recursive: true })
      for (const entry of readdirSync(src, { withFileTypes: true })) {
        const srcPath = join(src, entry.name)
        const destName = DOTFILE_MAP[entry.name] ?? entry.name
        const destPath = join(dest, destName)
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath)
        } else if (entry.name === 'package.json' && existsSync(destPath)) {
          // Merge type:module and gorlab scripts into an existing package.json
          const existing = JSON.parse(readFileSync(destPath, 'utf8'))
          const template = JSON.parse(readFileSync(srcPath, 'utf8'))
          const patched = {
            ...existing,
            type: existing.type ?? template.type,
            scripts: { ...template.scripts, ...existing.scripts },
          }
          writeFileSync(destPath, JSON.stringify(patched, null, 2) + '\n')
          console.log(`Patched: ${relative(cwd, destPath)}`)
        } else if (existsSync(destPath)) {
          console.log(`Skipping existing file: ${relative(cwd, destPath)}`)
        } else {
          mkdirSync(dirname(destPath), { recursive: true })
          copyFileSync(srcPath, destPath)
          console.log(`Writing: ${relative(cwd, destPath)}`)
        }
      }
    }

    copyDir(templateDir, cwd)
    console.log('\nDone! Next steps:\n  npm install\n  npm run dev')
    break
  }

  default:
    console.error('Usage: gorlab <build|dev|preview|init>')
    process.exit(1)
}
