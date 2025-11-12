import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Check, X, Eye, EyeOff } from 'lucide-react'
import { solveLinearCongruence } from '@/utils/numberTheory'

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

function Row({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}

export default function LinearCongruenceModule({ practice }) {
  const [a, setA] = useState(14)
  const [b, setB] = useState(30)
  const [m, setM] = useState(100)
  const [show, setShow] = useState(practice)
  const res = useMemo(() => solveLinearCongruence(a, b, m), [a, b, m])

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <SectionHeader title="Linear Congruence Solver" hint="Solve ax ≡ b (mod m)" />

        <Row>
          <div className="space-y-2">
            <Label>a</Label>
            <Input
              type="number"
              value={a}
              onChange={e => setA(parseInt(e.target.value || '0'))}
            />
          </div>
          <div className="space-y-2">
            <Label>b</Label>
            <Input
              type="number"
              value={b}
              onChange={e => setB(parseInt(e.target.value || '0'))}
            />
          </div>
          <div className="space-y-2">
            <Label>m</Label>
            <Input
              type="number"
              value={m}
              onChange={e => setM(parseInt(e.target.value || '0'))}
            />
          </div>
          <div className="space-y-2 flex items-end">
            <Button variant="outline" onClick={() => setShow(s => !s)} className="w-full">
              {show ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {show ? 'Hide Steps' : 'Show Steps'}
            </Button>
          </div>
        </Row>

        <div className="rounded-md border p-3 bg-muted/30">
          {res.solvable ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4" />
                <span className="font-medium">Solvable.</span>
              </div>
              <div className="text-sm">
                One solution:{' '}
                <span className="font-mono">
                  x ≡ {res.x0} (mod {res.m1})
                </span>
              </div>
              <div className="text-sm">
                All solutions:{' '}
                <span className="font-mono">
                  x ≡ {res.x0} + {res.m1}t
                </span>
                , t∈ℤ
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <X className="w-4 h-4" />
              <span className="font-medium">No solution.</span>
            </div>
          )}

          {show && (
            <ol className="mt-3 list-decimal list-inside text-sm space-y-1">
              {res.steps.map((s, i) => (
                <li key={i} className="font-mono">
                  {s}
                </li>
              ))}
            </ol>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

