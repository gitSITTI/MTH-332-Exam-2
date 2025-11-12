import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { X, Eye, EyeOff, ListChecks } from 'lucide-react'
import { crt2 } from '@/utils/numberTheory'

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

export default function CrtModule({ practice }) {
  const [a, setA] = useState(3)
  const [m, setM] = useState(5)
  const [b, setB] = useState(4)
  const [k, setK] = useState(7)
  const [show, setShow] = useState(practice)
  const res = useMemo(() => crt2(a, m, b, k), [a, m, b, k])

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <SectionHeader title="CRT (2 congruences)" hint="Requires gcd(m,k)=1" />

        <Row>
          <div className="space-y-2">
            <Label>a (x ≡ a mod m)</Label>
            <Input
              type="number"
              value={a}
              onChange={e => setA(parseInt(e.target.value || '0'))}
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
          <div className="space-y-2">
            <Label>b (x ≡ b mod k)</Label>
            <Input
              type="number"
              value={b}
              onChange={e => setB(parseInt(e.target.value || '0'))}
            />
          </div>
          <div className="space-y-2">
            <Label>k</Label>
            <Input
              type="number"
              value={k}
              onChange={e => setK(parseInt(e.target.value || '0'))}
            />
          </div>
        </Row>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShow(s => !s)}>
            {show ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {show ? 'Hide Steps' : 'Show Steps'}
          </Button>
        </div>

        <div className="rounded-md border p-3 bg-muted/30">
          {res.ok ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                <span className="font-medium">Solution</span>
              </div>
              <div className="text-sm font-mono">
                x ≡ {res.x} (mod {m * k})
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <X className="w-4 h-4" />
              <span className="font-medium">Moduli not coprime or inverse missing.</span>
            </div>
          )}

          {show && (
            <ol className="mt-3 list-decimal list-inside text-sm space-y-1 font-mono">
              {res.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

