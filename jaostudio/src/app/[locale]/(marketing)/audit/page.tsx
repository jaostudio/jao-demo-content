'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { track, EVENTS } from '@/lib/analytics'
import { useTranslations } from 'next-intl'

type FormState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export default function AuditPage() {
  const t = useTranslations('audit')
  const ct = useTranslations('common')
  const [formState, setFormState] = useState<FormState>({ status: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const successRef = useRef<HTMLHeadingElement>(null)
  const interacted = useRef(false)

  function handleFirstInteraction() {
    if (interacted.current) return
    interacted.current = true
    track(EVENTS.AUDIT_FORM_STARTED, { source: 'audit_page' })
  }

  const validate = useCallback((form: HTMLFormElement) => {
    const data = new FormData(form)
    const newErrors: Record<string, string> = {}

    const name = data.get('name') as string
    const email = data.get('email') as string
    const website = data.get('website') as string

    if (!name?.trim()) newErrors.name = ct('validationRequired')
    if (!email?.trim()) newErrors.email = ct('validationRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = ct('validationInvalidEmail')
    if (!website?.trim()) newErrors.website = ct('validationRequired')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [ct])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    handleFirstInteraction()
    if (!validate(form)) {
      track(EVENTS.AUDIT_VALIDATION_FAILED, { step: 'client_validation' })
      return
    }

    setFormState({ status: 'loading' })
    const data = new FormData(form)
    const startTime = performance.now()

    data.append('project_type', 'Website Audit')
    data.append('budget', 'TBD')
    data.append('timeline', 'TBD')
    data.append('priority', 'Conversions')
    data.append('source', 'Audit Page')

    data.append('_type', 'audit')

    try {
      const payload = Object.fromEntries(data.entries())
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Form submission failed')
      track(EVENTS.AUDIT_SUBMITTED, {
        status: 'success',
        latency_ms: Math.round(performance.now() - startTime),
      })
      setFormState({ status: 'success' })
    } catch {
      const latencyMs = Math.round(performance.now() - startTime)
      track(EVENTS.AUDIT_SUBMITTED, {
        status: 'error',
        latency_ms: latencyMs,
        error_type: 'network',
      })
      setFormState({ status: 'error', message: t('errorMessage') })
    }
  }

  useEffect(() => {
    if (formState.status === 'success' && successRef.current) {
      successRef.current.focus()
    }
  }, [formState.status])

  if (formState.status === 'success') {
    return (
      <Section className="pt-32 md:pt-40">
        <Container className="mx-auto max-w-xl text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-subtle">
              <span className="text-2xl text-accent">✓</span>
            </div>
            <h1 ref={successRef} tabIndex={-1} className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('successHeading')}
            </h1>
            <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('successDesc')}
            </p>
            <Button href="/" variant="secondary">
              {t('successCta')}
            </Button>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <Container className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-section)] font-[var(--weight-medium)] leading-[var(--leading-display-alt)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h1>
            <p className="max-w-xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </div>
        </Container>
      </Section>

      <Container className="pb-32 md:pb-40">
        <div className="mx-auto max-w-2xl">
          <div className="mb-16 grid gap-6 md:grid-cols-2">
            {[
              { title: t('feature1Title'), desc: t('feature1Desc') },
              { title: t('feature2Title'), desc: t('feature2Desc') },
              { title: t('feature3Title'), desc: t('feature3Desc') },
              { title: t('feature4Title'), desc: t('feature4Desc') },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-5"
              >
                <p className="text-[var(--text-body)] font-medium text-text-primary">{item.title}</p>
                <p className="mt-1 text-[var(--text-meta)] leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} onFocus={handleFirstInteraction} className="flex flex-col gap-6">
            <input type="hidden" name="_gotcha" aria-hidden="true" />

            <div className="grid gap-6 md:grid-cols-2">
              <Field label={ct('fieldName')} name="name" required error={errors.name} />
              <Field label={ct('fieldEmail')} name="email" type="email" required error={errors.email} />
            </div>

            <Field label={ct('fieldWebsite')} name="website" type="url" required error={errors.website} />

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-medium text-text-secondary">
                {ct('fieldMessage')} <span className="text-text-tertiary">{ct('fieldMessageOptional')}</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-border-active"
                placeholder={ct('fieldMessagePlaceholder')}
              />
            </div>

            {formState.status === 'error' && (
              <p role="alert" aria-live="polite" className="rounded-xl border border-accent-warm/30 bg-accent-warm-soft px-4 py-3 text-sm text-accent-warm">
                {formState.message}
              </p>
            )}
            <Button type="submit" size="lg" className="self-start" trackingLabel="audit_submit" loading={formState.status === 'loading'}>
              {formState.status === 'loading' ? t('ctaSending') : t('ctaRequest')}
            </Button>
          </form>
        </div>
      </Container>
    </>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2">
              <label htmlFor={name} className="text-xs font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
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
