import fs from 'fs'
import path from 'path'

const DATA_DIR = path.resolve('./lib/database/data/groups')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function filePath(id) {
  return path.join(DATA_DIR, `${id.replace(/[@.]/g, '_')}.json`)
}

const defaults = {
  welcome: false,
  goodbye: false,
  antidelete: false,
  antilink: false,
  nsfw: false,
  onlyadmin: false,
  disabledCmds: [],
  disabledCategories: [],
  warns: {},
  warnLimit: 3,
}

function load(id) {
  const fp = filePath(id)
  if (!fs.existsSync(fp)) return null
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')) } catch { return null }
}

function wrap(id, data) {
  return {
    ...data,
    id,
    save() {
      const fp = filePath(id)
      const plain = { ...this }
      delete plain.save
      delete plain.updateOne
      fs.writeFileSync(fp, JSON.stringify(plain, null, 2))
    }
  }
}

const GroupDb = {
  async findOrCreate(id) {
    const existing = load(id)
    if (existing) return wrap(id, existing)
    const fresh = { ...defaults, id }
    fs.writeFileSync(filePath(id), JSON.stringify(fresh, null, 2))
    return wrap(id, fresh)
  },
  async updateOne(id, update) {
    const doc = await GroupDb.findOrCreate(id)
    Object.assign(doc, update)
    doc.save()
    return doc
  }
}

export default GroupDb
