const en = require('../messages/en.json')
const tl = require('../messages/tl.json')

let exitCode = 0

function check(ns, key, msg) {
  const path = `${ns}.${key}`
  const enVal = key.split('.').reduce((o, k) => o?.[k], en[ns])
  const tlVal = key.split('.').reduce((o, k) => o?.[k], tl[ns])
  if (enVal === undefined) {
    console.error(`  ❌ [en] MISSING: ${path}`)
    exitCode = 1
  }
  if (tlVal === undefined) {
    console.error(`  ❌ [tl] MISSING: ${path}`)
    exitCode = 1
  }
}

const formFields = {
  common: ['fieldName', 'fieldEmail', 'fieldWebsite', 'fieldMessage', 'fieldMessageOptional', 'fieldMessagePlaceholder',
    'validationRequired', 'validationInvalidEmail', 'validationInvalidUrl'],
  contact: ['badge', 'heading', 'description', 'business', 'projectType', 'select', 'selectOther', 'specifyLabel', 'specifyPlaceholder',
    'budget', 'timeline', 'priority', 'source', 'goal', 'message', 'cta', 'ctaSending', 'thanks', 'thanksDesc', 'browseProjects',
    'responseTitle1', 'responseDesc1', 'responseTitle2', 'responseDesc2', 'responseTitle3', 'responseDesc3',
    'errorProjectType', 'errorBudget', 'errorTimeline', 'errorPriority', 'errorSource', 'errorOther', 'errorSubmit',
    'placeholderGoal', 'placeholderMessage',
    'skeletonBadge', 'skeletonHeading'],
  contactPage: ['heading', 'description', 'fitBadge', 'fitDesc', 'fit1', 'fit2', 'fit3', 'fit4',
    'step1', 'step2', 'step3',
    'model1', 'model1Desc', 'model2', 'model2Desc', 'model3', 'model3Desc',
    'model4', 'model4Desc', 'model5', 'model5Desc', 'model6', 'model6Desc',
    'ctaDirect', 'ctaEmail', 'howItWorks', 'howCollaborationWorks', 'faq',
    'heroHeading', 'faq1Question', 'faq1Answer', 'faq2Question', 'faq2Answer',
    'faq3Question', 'faq3Answer', 'faq4Question', 'faq4Answer', 'faq5Question', 'faq5Answer'],
}

console.log('\nFunnel QA Report\n')

for (const [ns, keys] of Object.entries(formFields)) {
  for (const key of keys) {
    check(ns, key, `Missing ${ns}.${key}`)
  }
}

const sourceKeys = ['google', 'linkedin', 'github', 'twitter', 'portfolio', 'referral', 'other']
for (const key of sourceKeys) {
  check('contact', `sources.${key}`)
}

for (const arr of ['budgetRanges', 'timelines', 'priorities']) {
  const enArr = en.contact?.[arr]
  const tlArr = tl.contact?.[arr]
  if (!Array.isArray(enArr)) {
    console.error(`  ❌ [en] contact.${arr} is not an array`)
    exitCode = 1
  }
  if (!Array.isArray(tlArr)) {
    console.error(`  ❌ [tl] contact.${arr} is not an array`)
    exitCode = 1
  }
  if (Array.isArray(enArr) && Array.isArray(tlArr) && enArr.length !== tlArr.length) {
    console.error(`  ❌ contact.${arr} length mismatch: en=${enArr.length}, tl=${tlArr.length}`)
    exitCode = 1
  }
}

const enSources = en.contact?.sources
const tlSources = tl.contact?.sources
if (enSources && tlSources) {
  const enKeys = Object.keys(enSources)
  const tlKeys = Object.keys(tlSources)
  if (JSON.stringify(enKeys.sort()) !== JSON.stringify(tlKeys.sort())) {
    console.error(`  ❌ contact.sources key mismatch: en=[${enKeys}], tl=[${tlKeys}]`)
    exitCode = 1
  }
}

if (exitCode === 0) {
  console.log('  ✅ All form labels, validation messages, CTAs, and structure present in both locales.\n')
} else {
  console.log()
}

process.exit(exitCode)
