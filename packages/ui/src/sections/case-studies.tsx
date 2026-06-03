import type { CaseStudyData } from '@jaostudio/engine/types'

export function CaseStudiesSection({ data }: { data: CaseStudyData }) {
  return (
    <section className="bg-neutral-50 px-4 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">{data.headline}</h2>
        <div className="mt-12 grid gap-8">
          {data.studies.map((study) => (
            <div
              key={study.title}
              className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-950"
            >
              <h3 className="text-xl font-semibold">{study.title}</h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Challenge</p>
                  <p className="mt-1 text-sm">{study.challenge}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Solution</p>
                  <p className="mt-1 text-sm">{study.solution}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Outcome</p>
                  <p className="mt-1 text-sm">{study.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
