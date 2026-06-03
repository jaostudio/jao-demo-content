fetch('https://portfolio-v1-pi-coral.vercel.app/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jameson Test',
    email: 'jameson.olitoquit@gmail.com',
    business: 'Self',
    project_type: 'web-development',
    budget: '$1,000 \u2013 $3,000',
    timeline: '2\u20134 weeks',
    priority: 'Conversions',
    source: 'Portfolio Review',
    message: 'Testing email delivery \u2014 please ignore.',
    _gotcha: '',
  }),
})
  .then((r) => r.text().then((b) => console.log(r.status, b)))
  .catch((e) => console.error(e))
