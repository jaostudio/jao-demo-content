'use client'

import { useTranslations } from 'next-intl'
import { Suspense, useState, useRef, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { Disclosure } from '@/components/ui/disclosure'
import { track, EVENTS } from '@/lib/analytics'
import { PROJECT_TYPES, PROJECT_TYPE_LABELS, PROJECT_TYPE_GROUPS, isOtherProjectType } from '@/lib/project-types'

type FormState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }

function ContactForm() {
  const [formState, setFormState] = useState<FormState>({ status: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedProjectType, setSelectedProjectType] = useState<string>('')
  const [customProjectType, setCustomProjectType] = useState('')
  const interacted = useRef(false)
  const successRef = useRef<HTMLHeadingElement>(null)
  const searchParams = useSearchParams()
  const initialProjectType = searchParams.get('projectType') || ''

  const matchedType = PROJECT_TYPES.find(
    (t) => t === initialProjectType || PROJECT_TYPE_LABELS[t]?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === initialProjectType,
  )

  const source = searchParams.get('source') || ''
  const t = useTranslations('contact')
  const ct = useTranslations('common')

  function handleFirstInteraction() {
    if (interacted.current) return
    interacted.current = true
    track(EVENTS.CONTACT_FORM_STARTED, {})
  }

  const validate = useCallback((form: HTMLFormElement) => {
    const data = new FormData(form)
    const newErrors: Record<string, string> = {}

    const name = data.get('name') as string
    const email = data.get('email') as string
    const projectType = data.get('project_type') as string
    const projectTypeOther = data.get('project_type_other') as string
    const budget = data.get('budget') as string
    const timeline = data.get('timeline') as string
    const priority = data.get('priority') as string
    const source = data.get('source') as string

    if (!name?.trim()) newErrors.name = ct('validationRequired')
    if (!email?.trim()) newErrors.email = ct('validationRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = ct('validationInvalidEmail')
    if (!projectType) newErrors.project_type = t('errorProjectType')
    if (isOtherProjectType(projectType) && !projectTypeOther?.trim()) newErrors.project_type_other = t('errorOther')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [t, ct])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!validate(form)) {
      track(EVENTS.CONTACT_FORM_VALIDATION_ERROR, {})
      return
    }

    setFormState({ status: 'loading' })
    const data = new FormData(form)
    const startTime = performance.now()

    try {
      const res = await fetch('https://formspree.io/f/mlggbzan', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Form submission failed')
      track(EVENTS.CONTACT_FORM_SUBMITTED, {
        status: 'success',
        latency_ms: Math.round(performance.now() - startTime),
      })
      setFormState({ status: 'success' })
    } catch {
      const latencyMs = Math.round(performance.now() - startTime)
      track(EVENTS.CONTACT_FORM_SUBMITTED, { status: 'error', latency_ms: latencyMs })
      track(EVENTS.CONTACT_FORM_FAILED, { latency_ms: latencyMs })
      setFormState({ status: 'error', message: t('errorSubmit') })
    }
  }

  useEffect(() => {
    if (formState.status === 'success' && successRef.current) {
      successRef.current.focus()
    }
  }, [formState.status])

  if (formState.status === 'success') {
    return (
      <Section id="contact" className="">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-subtle">
              <span className="text-2xl text-text-primary">✓</span>
            </div>
            <h2 ref={successRef} tabIndex={-1} className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('thanks')}
            </h2>
            <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('thanksDesc')}
            </p>
            <Button href="/projects" variant="secondary">
              {t('browseProjects')}
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section id="contact" className="">
      <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex flex-col gap-5 md:gap-9 items-center text-center md:mb-12"
          >
            <Badge variant="accent">{t('badge')}</Badge>
            <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h2>
            <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} onFocus={handleFirstInteraction} className="flex flex-col gap-3 md:gap-6">
            <input type="hidden" name="_gotcha" aria-hidden="true" />
            {source && <input type="hidden" name="source_override" value={source} />}

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <Field label={ct('fieldName')} name="name" required error={errors.name} />
              <Field label={ct('fieldEmail')} name="email" type="email" required error={errors.email} />
            </div>

            <div className="hidden md:block">
              <Field label={t('business')} name="business" />
              <Field label={ct('fieldWebsite')} name="website" placeholder="https://" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="project_type" className="text-xs font-medium text-text-secondary">
                {t('projectType')} <span className="ml-1 text-text-primary">*</span>
              </label>
              <select
                id="project_type"
                name="project_type"
                required
                defaultValue={matchedType || ''}
                onChange={(e) => setSelectedProjectType(e.target.value)}
                aria-invalid={!!errors.project_type}
                aria-describedby={errors.project_type ? 'project_type-error' : undefined}
                className={`w-full rounded-xl border bg-bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-border-active ${
                  errors.project_type ? 'border-accent-warm' : 'border-border'
                }`}
              >
                <option value="" className="bg-bg-surface">{t('select')}</option>
                {PROJECT_TYPE_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label} className="bg-bg-surface">
                    {group.values.map((val) => (
                      <option key={val} value={val} className="bg-bg-surface">
                        {PROJECT_TYPE_LABELS[val]}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="other" className="bg-bg-surface">{t('selectOther')}</option>
              </select>
              {errors.project_type && (
                <p id="project_type-error" role="alert" className="text-xs text-accent-warm">{errors.project_type}</p>
              )}
            </div>

            {isOtherProjectType(selectedProjectType) && (
              <div className="flex flex-col gap-2">
                <label htmlFor="project_type_other" className="text-xs font-medium text-text-secondary">
                  {t('specifyLabel')} <span className="ml-1 text-text-primary">*</span>
                </label>
                <input
                  id="project_type_other"
                  name="project_type_other"
                  type="text"
                  required
                  value={customProjectType}
                  onChange={(e) => setCustomProjectType(e.target.value)}
                  placeholder={t('specifyPlaceholder')}
                  aria-invalid={!!errors.project_type_other}
                  aria-describedby={errors.project_type_other ? 'project_type_other-error' : undefined}
                  className={`w-full rounded-xl border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-border-active ${
                    errors.project_type_other ? 'border-accent-warm' : 'border-border'
                  }`}
                />
                {errors.project_type_other && (
                  <p id="project_type_other-error" role="alert" className="text-xs text-accent-warm">{errors.project_type_other}</p>
                )}
              </div>
            )}

            <Disclosure title={t('addMoreDetails') || 'Add more details'}>
              <div className="flex flex-col gap-4 pt-2">
                <SelectField label={t('budget')} name="budget" options={t.raw('budgetRanges') as string[]} placeholder={t('select')} error={errors.budget} />
                <SelectField label={t('timeline')} name="timeline" options={t.raw('timelines') as string[]} placeholder={t('select')} error={errors.timeline} />
                <SelectField label={t('priority')} name="priority" options={t.raw('priorities') as string[]} placeholder={t('select')} error={errors.priority} />
                <SelectField label={t('source')} name="source" options={Object.values(t.raw('sources') as Record<string, string>)} placeholder={t('select')} error={errors.source} />
                <div className="flex flex-col gap-2">
                  <label htmlFor="business-goal" className="text-xs font-medium text-text-secondary">{t('goal')}</label>
                  <textarea
                    id="business-goal"
                    name="business_goal"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-border-active"
                    placeholder={t('placeholderGoal')}
                  />
                </div>
              </div>
            </Disclosure>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-medium text-text-secondary">{ct('fieldMessage')}</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-border-active"
                placeholder={ct('fieldMessagePlaceholder')}
              />
            </div>

            {formState.status === 'error' && (
              <p role="alert" aria-live="polite" className="rounded-xl border border-accent-warm/30 bg-accent-warm-soft px-4 py-3 text-sm text-accent-warm">
                {formState.message}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full md:self-start" trackingLabel="contact_send_inquiry" loading={formState.status === 'loading'}>            
              {formState.status === 'loading' ? t('ctaSending') : t('cta')}
            </Button>
          </form>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.15 }}
              className="mt-6 grid gap-3 border-t border-border-subtle pt-8 md:grid-cols-3 md:mt-8"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 text-xs text-accent-warm">✓</span>
                  <div>
                    <p className="text-xs font-medium text-text-primary">{t(`responseTitle${i}`)}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{t(`responseDesc${i}`)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
        </div>
    </Section>
  )
}

export function ContactSection() {
  return (
    <Suspense fallback={<ContactFormSkeleton />}>
      <ContactForm />
    </Suspense>
  )
}

function ContactFormSkeleton() {
  const t = useTranslations('contact')
  return (
    <Section id="contact" className="">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 flex flex-col gap-4">
          <Badge variant="accent">{t('skeletonBadge')}</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('skeletonHeading')}
          </h2>
        </div>
      </div>
    </Section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  error,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-border-active ${
          error ? 'border-accent-warm' : 'border-border'
        }`}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-accent-warm">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
  required = false,
  defaultValue,
  placeholder = 'Select...',
  error,
}: {
  label: string
  name: string
  options: string[]
  required?: boolean
  defaultValue?: string
  placeholder?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-text-primary">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue || ''}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-border-active ${
          error ? 'border-accent-warm' : 'border-border'
        }`}
      >
        <option value="" className="bg-bg-surface">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-bg-surface">
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-accent-warm">
          {error}
        </p>
      )}
    </div>
  )
}
