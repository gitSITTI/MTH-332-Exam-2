import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Check, X, Eye, EyeOff } from 'lucide-react'

function SectionHeader({ title, hint }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {hint && <Badge variant="secondary">{hint}</Badge>}
      </div>
      <Separator className="mt-2" />
    </div>
  )
}

const INDUCTION_ITEMS = [
  {
    id: 'sum-n',
    title: 'Sum of first n integers',
    statement: '∑_{j=1}^{n} j = n(n+1)/2',
    basePrompt: 'Evaluate both sides at n=1.',
    baseAnswer: '1',
    hintBase: 'LHS: ∑_{j=1}^{1} j = 1; RHS: 1·2/2 = 1',
    ihPrompt: 'Assume P(n): ∑_{j=1}^{n} j = n(n+1)/2.',
    isPrompt: 'Add (n+1) to both sides and simplify the RHS to (n+1)(n+2)/2.',
    targetRHS: '(n+1)(n+2)/2',
  },
  {
    id: 'pow-two',
    title: "2^n ≥ n+1 for n≥1",
    statement: '2^n ≥ n+1 (n≥1)',
    basePrompt: 'Check n=1.',
    baseAnswer: '2 ≥ 2',
    hintBase: '2^1 = 2 and 1+1 = 2',
    ihPrompt: 'Assume 2^n ≥ n+1.',
    isPrompt: 'Show 2^{n+1} = 2·2^n ≥ 2(n+1) ≥ (n+1)+1.',
    targetRHS: '2(n+1) ≥ (n+2)',
  },
  {
    id: 'div-3',
    title: '3 | (n^3 − n)',
    statement: 'For all n∈ℕ, 3 divides n^3 − n',
    basePrompt: 'Check n=1.',
    baseAnswer: '0',
    hintBase: '1^3 − 1 = 0',
    ihPrompt: 'Assume 3 | (n^3 − n).',
    isPrompt:
      'Consider (n+1)^3 − (n+1) − (n^3 − n) and factor to show multiple of 3.',
    targetRHS: '3n(n+1)',
  },
]

export default function InductionModule({ practice }) {
  const [reveal, setReveal] = useState(practice)
  const [answers, setAnswers] = useState({})

  const setBase = (id, v) =>
    setAnswers(p => ({ ...p, [id]: { ...(p[id] || { rhs: '' }), base: v } }))
  const setRHS = (id, v) =>
    setAnswers(p => ({ ...p, [id]: { ...(p[id] || { base: '' }), rhs: v } }))

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <SectionHeader title="Induction Fill‑ins" hint="Base case, IH, Inductive Step" />

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setReveal(r => !r)}>
            {reveal ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {reveal ? 'Hide Keys' : 'Show Keys'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {INDUCTION_ITEMS.map(it => {
            const a = answers[it.id] || { base: '', rhs: '' }
            const baseOk =
              it.baseAnswer.replace(/\s+/g, '') === a.base?.replace(/\s+/g, '')
            const rhsOk =
              it.targetRHS.replace(/\s+/g, '') === a.rhs?.replace(/\s+/g, '')

            return (
              <div key={it.id} className="rounded-md border p-3 bg-muted/20 space-y-2">
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm">
                  Statement: <span className="font-mono">{it.statement}</span>
                </div>
                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Base Case</div>
                  <div className="text-xs text-muted-foreground">{it.basePrompt}</div>
                  <Input
                    placeholder="Your base evaluation"
                    value={a.base}
                    onChange={e => setBase(it.id, e.target.value)}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    {baseOk ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {baseOk ? 'Looks good' : 'Not matched yet'}
                  </div>
                  {reveal && (
                    <div className="text-xs font-mono bg-muted/40 p-2 rounded">
                      Expected: {it.baseAnswer} <br />
                      Hint: {it.hintBase}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Inductive Step</div>
                  <div className="text-xs">IH: {it.ihPrompt}</div>
                  <div className="text-xs">Goal: {it.isPrompt}</div>
                  <Label htmlFor={`rhs-${it.id}`}>Final RHS form</Label>
                  <Input
                    id={`rhs-${it.id}`}
                    placeholder={it.targetRHS}
                    value={a.rhs}
                    onChange={e => setRHS(it.id, e.target.value)}
                  />
                  <div className="flex items-center gap-2 text-sm">
                    {rhsOk ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {rhsOk ? 'Target matches' : 'Target not matched'}
                  </div>
                  {reveal && (
                    <div className="text-xs font-mono bg-muted/40 p-2 rounded">
                      Key target: {it.targetRHS}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

