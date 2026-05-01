import { useState, type ChangeEvent, type ReactNode } from 'react'
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react'
import { useContent } from '../store/contentStore'
import { useLanguage } from '../i18n/LanguageContext'
import type { Locale } from '../locales/types'
import type { LocalizedString, SiteContent, NewsItem, Service, Leader } from '../data/defaultContent'
import { defaultContent } from '../data/defaultContent'
import { cn } from '../lib/cn'

const locales: Locale[] = ['uz', 'ru', 'en']
const inputBase = 'w-full rounded-lg border border-slate-200 bg-white text-sm text-ink-900 px-3 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500'

function LangTabs(props: { active: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white overflow-hidden text-xs">
      {locales.map((l) => {
        const isActive = l === props.active
        const cls = cn('px-3 py-1.5 uppercase font-semibold', isActive ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-50')
        function handle(): void { props.onChange(l) }
        return (
          <button key={l} type="button" onClick={handle} className={cls}>{l}</button>
        )
      })}
    </div>
  )
}

function LocalizedInput(props: { label: string; value: LocalizedString; lang: Locale; onChange: (next: LocalizedString) => void; multiline?: boolean }) {
  function handle(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const next: LocalizedString = { uz: props.value.uz, ru: props.value.ru, en: props.value.en }
    next[props.lang] = e.target.value
    props.onChange(next)
  }
  const v = props.value[props.lang]
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{props.label}</span>
      {props.multiline ? (
        <textarea rows={4} value={v} onChange={handle} className={inputBase} />
      ) : (
        <input type="text" value={v} onChange={handle} className={inputBase} />
      )}
    </label>
  )
}

function Card(props: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-900">{props.title}</h3>
        {props.actions ? <div className="flex items-center gap-2">{props.actions}</div> : null}
      </div>
      {props.children}
    </section>
  )
}

function cloneContent(c: SiteContent): SiteContent {
  return JSON.parse(JSON.stringify(c)) as SiteContent
}

export function AdminEditors() {
  const { content, setContent, reset } = useContent()
  const { t } = useLanguage()
  const [draft, setDraft] = useState<SiteContent>(() => cloneContent(content))
  const [lang, setLang] = useState<Locale>('uz')
  const [savedAt, setSavedAt] = useState<string>('')

  function commit(next: SiteContent): void { setDraft(next) }
  function save(): void {
    setContent(cloneContent(draft))
    setSavedAt(new Date().toLocaleTimeString())
  }
  function resetAll(): void {
    reset()
    setDraft(cloneContent(defaultContent))
  }
  function setHeroTitle(v: LocalizedString): void { const n = cloneContent(draft); n.hero.title = v; commit(n) }
  function setHeroSubtitle(v: LocalizedString): void { const n = cloneContent(draft); n.hero.subtitle = v; commit(n) }
  function setAboutBody(v: LocalizedString): void { const n = cloneContent(draft); n.about.body = v; commit(n) }
  function setFooterDesc(v: LocalizedString): void { const n = cloneContent(draft); n.footer.description = v; commit(n) }

  function updateService(idx: number, key: 'title' | 'text', v: LocalizedString): void {
    const n = cloneContent(draft)
    n.services[idx][key] = v
    commit(n)
  }
  function addService(): void {
    const n = cloneContent(draft)
    const empty: LocalizedString = { uz: '', ru: '', en: '' }
    const item: Service = { id: 'svc-' + Date.now(), icon: 'Cloud', title: empty, text: empty }
    n.services.push(item)
    commit(n)
  }
  function removeService(idx: number): void {
    const n = cloneContent(draft)
    n.services.splice(idx, 1)
    commit(n)
  }

  function updateLeader(idx: number, patch: Partial<Leader>): void {
    const n = cloneContent(draft)
    n.leaders[idx] = Object.assign({}, n.leaders[idx], patch)
    commit(n)
  }

  function updateNews(idx: number, patch: Partial<NewsItem>): void {
    const n = cloneContent(draft)
    n.news[idx] = Object.assign({}, n.news[idx], patch)
    commit(n)
  }
  function addNews(): void {
    const n = cloneContent(draft)
    const empty: LocalizedString = { uz: '', ru: '', en: '' }
    const item: NewsItem = { id: 'news-' + Date.now(), date: new Date().toISOString().slice(0, 10), title: empty, summary: empty, tag: empty }
    n.news.unshift(item)
    commit(n)
  }
  function removeNews(idx: number): void {
    const n = cloneContent(draft)
    n.news.splice(idx, 1)
    commit(n)
  }

  function updateContact(field: 'address' | 'phone' | 'email' | 'website', value: string): void {
    const n = cloneContent(draft)
    n.contact[field] = value
    commit(n)
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <LangTabs active={lang} onChange={setLang} />
        <div className="flex items-center gap-2">
          {savedAt ? <span className="text-xs text-slate-500">{t('admin.savedAt', 'Saved at')} {savedAt}</span> : null}
          <button type="button" onClick={resetAll} className="btn-secondary"><RefreshCw size={16} /><span>{t('admin.reset', 'Reset')}</span></button>
          <button type="button" onClick={save} className="btn-primary"><Save size={16} /><span>{t('admin.save', 'Save')}</span></button>
        </div>
      </div>

      <Card title={t('admin.section.hero', 'Hero')}>
        <LocalizedInput label={t('admin.field.title', 'Title')} value={draft.hero.title} lang={lang} onChange={setHeroTitle} />
        <LocalizedInput label={t('admin.field.subtitle', 'Subtitle')} value={draft.hero.subtitle} lang={lang} onChange={setHeroSubtitle} multiline />
      </Card>

      <Card title={t('admin.section.about', 'About')}>
        <LocalizedInput label={t('admin.field.body', 'Body')} value={draft.about.body} lang={lang} onChange={setAboutBody} multiline />
      </Card>

      <Card
        title={t('admin.section.services', 'Services')}
        actions={<button type="button" onClick={addService} className="btn-secondary"><Plus size={14} /><span>{t('admin.add', 'Add')}</span></button>}
      >
        <div className="grid gap-4">
          {draft.services.map((s, i) => {
            function setTitle(v: LocalizedString): void { updateService(i, 'title', v) }
            function setText(v: LocalizedString): void { updateService(i, 'text', v) }
            function remove(): void { removeService(i) }
            return (
              <div key={s.id} className="rounded-xl border border-slate-100 p-4 grid gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500">{s.icon}</span>
                  <button type="button" onClick={remove} className="text-red-600 text-xs inline-flex items-center gap-1"><Trash2 size={14} /><span>{t('admin.remove', 'Remove')}</span></button>
                </div>
                <LocalizedInput label={t('admin.field.title', 'Title')} value={s.title} lang={lang} onChange={setTitle} />
                <LocalizedInput label={t('admin.field.text', 'Text')} value={s.text} lang={lang} onChange={setText} multiline />
              </div>
            )
          })}
        </div>
      </Card>

      <Card title={t('admin.section.leaders', 'Leadership')}>
        <div className="grid gap-4">
          {draft.leaders.map((p, i) => {
            function setPosition(v: LocalizedString): void { updateLeader(i, { position: v }) }
            function setDesc(v: LocalizedString): void { updateLeader(i, { description: v }) }
            function setName(e: ChangeEvent<HTMLInputElement>): void { updateLeader(i, { name: e.target.value }) }
            function setPhone(e: ChangeEvent<HTMLInputElement>): void { updateLeader(i, { phone: e.target.value }) }
            function setEmail(e: ChangeEvent<HTMLInputElement>): void { updateLeader(i, { email: e.target.value }) }
            return (
              <div key={p.id} className="rounded-xl border border-slate-100 p-4 grid gap-3">
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.name', 'Name')}</span>
                  <input type="text" value={p.name} onChange={setName} className={inputBase} />
                </label>
                <LocalizedInput label={t('admin.field.position', 'Position')} value={p.position} lang={lang} onChange={setPosition} />
                <LocalizedInput label={t('admin.field.bio', 'Description')} value={p.description} lang={lang} onChange={setDesc} multiline />
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.phone', 'Phone')}</span>
                    <input type="text" value={p.phone} onChange={setPhone} className={inputBase} />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.email', 'Email')}</span>
                    <input type="text" value={p.email} onChange={setEmail} className={inputBase} />
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card title={t('admin.section.contact', 'Contact')}>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.address', 'Address')}</span>
            <input type="text" value={draft.contact.address} onChange={(e) => updateContact('address', e.target.value)} className={inputBase} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.phone', 'Phone')}</span>
            <input type="text" value={draft.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} className={inputBase} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.email', 'Email')}</span>
            <input type="text" value={draft.contact.email} onChange={(e) => updateContact('email', e.target.value)} className={inputBase} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t('admin.field.website', 'Website')}</span>
            <input type="text" value={draft.contact.website} onChange={(e) => updateContact('website', e.target.value)} className={inputBase} />
          </label>
        </div>
      </Card>

      <Card
        title={t('admin.section.news', 'News')}
        actions={<button type="button" onClick={addNews} className="btn-secondary"><Plus size={14} /><span>{t('admin.add', 'Add')}</span></button>}
      >
        <div className="grid gap-4">
          {draft.news.map((n, i) => {
            function setTitle(v: LocalizedString): void { updateNews(i, { title: v }) }
            function setSummary(v: LocalizedString): void { updateNews(i, { summary: v }) }
            function setTag(v: LocalizedString): void { updateNews(i, { tag: v }) }
            function setDate(e: ChangeEvent<HTMLInputElement>): void { updateNews(i, { date: e.target.value }) }
            function remove(): void { removeNews(i) }
            return (
              <div key={n.id} className="rounded-xl border border-slate-100 p-4 grid gap-3">
                <div className="flex items-center justify-between">
                  <input type="date" value={n.date} onChange={setDate} className="text-xs rounded-lg border border-slate-200 px-2 py-1" />
                  <button type="button" onClick={remove} className="text-red-600 text-xs inline-flex items-center gap-1"><Trash2 size={14} /><span>{t('admin.remove', 'Remove')}</span></button>
                </div>
                <LocalizedInput label={t('admin.field.title', 'Title')} value={n.title} lang={lang} onChange={setTitle} />
                <LocalizedInput label={t('admin.field.summary', 'Summary')} value={n.summary} lang={lang} onChange={setSummary} multiline />
                <LocalizedInput label={t('admin.field.tag', 'Tag')} value={n.tag} lang={lang} onChange={setTag} />
              </div>
            )
          })}
        </div>
      </Card>

      <Card title={t('admin.section.footer', 'Footer')}>
        <LocalizedInput label={t('admin.field.description', 'Description')} value={draft.footer.description} lang={lang} onChange={setFooterDesc} multiline />
      </Card>
    </div>
  )
}
