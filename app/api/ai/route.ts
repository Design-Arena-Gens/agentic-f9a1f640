import { NextResponse } from 'next/server'

export const runtime = 'edge'

function fallbackCoach(messages: { role: string, content: string }[]): string {
  const last = messages.filter(m=>m.role==='user').slice(-1)[0]?.content ?? ''
  const suggestions = [
    'Pick one vital task and protect a 60?90m focus block for it.',
    'Batch shallow tasks into one 30m window to reduce context switching.',
    'Walk 10 minutes after meals; hydrate and set a hard stop for the day.',
    'Keep habits tiny and consistent; done > perfect.'
  ]
  const prompt = last.toLowerCase()
  const plan: string[] = []
  if (/(overwhelm|overwhelmed|stress|stressed)/.test(prompt)) plan.push('Use a 3-3-3 plan: 3 big tasks, 3 medium, 3 small. Start with one big.')
  if (/(sleep|tired|fatigue)/.test(prompt)) plan.push('Prioritize sleep: target 7?9h; dim lights 1h before bed; no screens in bed.')
  if (/(exercise|workout|move|steps)/.test(prompt)) plan.push('Schedule a 20?30m brisk walk or light workout at a fixed time.')
  if (/(diet|food|nutrition|eat)/.test(prompt)) plan.push('Anchor meals: protein + fiber each meal; prepare snacks to avoid impulse eating.')
  if (!plan.length) plan.push('Clarify outcomes, not activities. What must be true by EOD? Write it down.')

  return [
    'Here\'s a simple plan to make today effective:',
    '',
    '- Focus: choose 1 high-impact objective and ship a concrete outcome.',
    `- Blocks: 90m deep work ? break ? 60m deep work.`,
    '- Maintenance: 10m walk after lunch; 2L water total; 5m tidy wrap-up.',
    '- Review: Write 3 lines on what worked and what to adjust tomorrow.',
    '',
    ...plan,
    '',
    'If you share your top 3 tasks and how you\'re feeling (1?5), I can tailor this further.'
  ].join('\n')
}

export async function POST(req: Request){
  const { messages } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey){
    return NextResponse.json({ reply: fallbackCoach(messages ?? []) })
  }
  try{
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are an expert productivity and health coach. Give concise, actionable, safe guidance. Avoid medical advice; suggest seeing a professional for clinical issues.'},
          ...messages
        ],
      })
    })
    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content ?? fallbackCoach(messages ?? [])
    return NextResponse.json({ reply })
  }catch{
    return NextResponse.json({ reply: fallbackCoach(messages ?? []) })
  }
}
