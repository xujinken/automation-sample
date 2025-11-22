// Simple automated task runner: fetch sample data, process and log results
// Dependencies
const axios = require('axios')
const cron = require('node-cron')
const fs = require('fs')
const path = require('path')

// Ensure a daily rolling log directory exists
const LOG_DIR = path.join(__dirname, 'logs')
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })

// Build today's log file path (YYYY-MM-DD.log)
const logFilePath = () => {
  const d = new Date()
  const f = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.log`
  return path.join(LOG_DIR, f)
}

// Append a structured log line to file and stdout
const log = (level, msg) => {
  const line = `${new Date().toISOString()} [${level}] ${msg}\n`
  try {
    fs.appendFileSync(logFilePath(), line)
  } catch (e) {} // swallow file logging errors to keep process running
  process.stdout.write(line)
}

// Fetch JSON data, normalize titles, compute summary stats
const fetchAndProcess = async () => {
  log('run', 'start')
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts', { timeout: 10000 })
    const data = Array.isArray(res.data) ? res.data : []
    const cleaned = data.map(p => ({ id: p.id, title: String(p.title || '').trim(), wordCount: String(p.body || '').split(/\s+/).filter(Boolean).length }))
    const wId = 4, wTitle = 42, wWords = 7
    const line = (id, title, words) => `| ${String(id).padStart(wId)} | ${String(title).slice(0, wTitle).padEnd(wTitle)} | ${String(words).padStart(wWords)} |`
    const header = `| ${'ID'.padStart(wId)} | ${'Title'.padEnd(wTitle)} | ${'Words'.padStart(wWords)} |`
    const sep = `+-${'-'.repeat(wId)}-+-${'-'.repeat(wTitle)}-+-${'-'.repeat(wWords)}-+`
    const view = cleaned.slice(0, 5)
    const table = [sep, header, sep, ...view.map(r => line(r.id, r.title, r.wordCount)), sep].join('\n')
    process.stdout.write(table + '\n')
    const count = cleaned.length
    const avgWords = count ? Math.round(cleaned.reduce((s, c) => s + c.wordCount, 0) / count) : 0
    const topTitles = cleaned.slice(0, 3).map(c => c.title)
    log('ok', `items=${count} avgWords=${avgWords} top=${JSON.stringify(topTitles)}`)
  } catch (err) {
    const msg = err && err.message ? err.message : String(err)
    log('error', msg)
  }
}

// Cron schedule from env or default every 5 minutes
const schedule = process.env.CRON_SCHEDULE || '*/5 * * * *'
log('init', `schedule=${JSON.stringify(schedule)}`)
// Register cron job
cron.schedule(schedule, () => fetchAndProcess(), { scheduled: true })
// Run once at startup
fetchAndProcess()

// Graceful shutdown on SIGINT/SIGTERM
process.on('SIGINT', () => {
  log('exit', 'SIGINT')
  process.exit(0)
})
process.on('SIGTERM', () => {
  log('exit', 'SIGTERM')
  process.exit(0)
})