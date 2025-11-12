import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Eye, EyeOff } from 'lucide-react'
import { egcd, lcm } from '@/utils/numberTheory'

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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function genPairs(n = 5) {
  const pairs = []
  for (let i = 0; i < n; i++) {
    const a = randomInt(24, 500)
    const b = randomInt(24, 500)
    pairs.push([a, b])
  }
  return pairs
}

export default function GcdLcmModule({ practice }) {
  const [pairs, setPairs] = useState(genPairs())
  const [show, setShow] = useState(practice)

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <SectionHeader title="gcd/lcm Mixed Set" hint="With EA steps" />

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPairs(genPairs())}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Set
          </Button>
          <Button variant="outline" onClick={() => setShow(s => !s)}>
            {show ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {show ? 'Hide Steps' : 'Show Steps'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {pairs.map(([a, b], idx) => {
            const ea = egcd(a, b)
            const L = lcm(a, b)
            return (
              <div key={idx} className="rounded-md border p-3 bg-muted/20">
                <div className="font-medium">
                  Pair {idx + 1}: <span className="font-mono">({a}, {b})</span>
                </div>
                <div className="text-sm mt-1">
                  gcd: <span className="font-mono">{ea.gcd}</span> &nbsp;|&nbsp; lcm:{' '}
                  <span className="font-mono">{L.lcm}</span>
                </div>
                {show && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm">
                      Show EA/Bézout & lcm steps
                    </summary>
                    <ol className="text-sm list-decimal list-inside mt-2 space-y-1 font-mono">
                      {ea.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                      {L.steps.map((s, i) => (
                        <li key={`l${i}`}>{s}</li>
                      ))}
                    </ol>
                  </details>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

