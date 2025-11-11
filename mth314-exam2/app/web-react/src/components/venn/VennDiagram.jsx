import { useCallback, useId, useMemo } from 'react'
import { getRegionMetadata } from '../../utils/vennUtils.js'
import './VennDiagram.css'

const DIAGRAM_CONFIG = {
  2: {
    width: 280,
    height: 200,
    circles: {
      A: { cx: 120, cy: 105, r: 80 },
      B: { cx: 170, cy: 105, r: 80 },
    },
    labels: [
      { id: 'A', x: 80, y: 32 },
      { id: 'B', x: 210, y: 32 },
    ],
  },
  3: {
    width: 300,
    height: 230,
    circles: {
      A: { cx: 130, cy: 130, r: 82 },
      B: { cx: 180, cy: 130, r: 82 },
      C: { cx: 155, cy: 80, r: 82 },
    },
    labels: [
      { id: 'A', x: 70, y: 150 },
      { id: 'B', x: 230, y: 150 },
      { id: 'C', x: 150, y: 30 },
    ],
  },
}

const REGION_DEFINITIONS = {
  2: [
    { id: 'A_only', clipPaths: ['clip-A'], masks: ['mask-not-B'] },
    { id: 'B_only', clipPaths: ['clip-B'], masks: ['mask-not-A'] },
    { id: 'AB', clipPaths: ['clip-A'], masks: ['mask-only-B'] },
    { id: 'outside', clipPaths: [], masks: ['mask-outside'] },
  ],
  3: [
    { id: 'A_only', clipPaths: ['clip-A'], masks: ['mask-not-B', 'mask-not-C'] },
    { id: 'B_only', clipPaths: ['clip-B'], masks: ['mask-not-A', 'mask-not-C'] },
    { id: 'C_only', clipPaths: ['clip-C'], masks: ['mask-not-A', 'mask-not-B'] },
    { id: 'AB', clipPaths: ['clip-A'], masks: ['mask-only-B', 'mask-not-C'] },
    { id: 'AC', clipPaths: ['clip-A'], masks: ['mask-only-C', 'mask-not-B'] },
    { id: 'BC', clipPaths: ['clip-B'], masks: ['mask-only-C', 'mask-not-A'] },
    { id: 'ABC', clipPaths: ['clip-A'], masks: ['mask-only-B', 'mask-only-C'] },
    { id: 'outside', clipPaths: [], masks: ['mask-outside'] },
  ],
}

function ensureIdSet(values) {
  if (!values) {
    return new Set()
  }

  if (values instanceof Set) {
    return values
  }

  return new Set(Array.isArray(values) ? values : [values])
}

function VennDiagram({
  setCount = 2,
  selectedRegions,
  highlightRegions,
  onRegionToggle,
  disabled = false,
  showLabels = true,
  className = '',
}) {
  const diagramId = useId().replace(/:/g, '_')
  const config = DIAGRAM_CONFIG[setCount] ?? DIAGRAM_CONFIG[2]
  const regionDefs = REGION_DEFINITIONS[setCount] ?? REGION_DEFINITIONS[2]
  const metadata = useMemo(() => {
    const lookup = new Map()
    for (const entry of getRegionMetadata(setCount)) {
      lookup.set(entry.id, entry)
    }
    return lookup
  }, [setCount])

  const selected = useMemo(() => ensureIdSet(selectedRegions), [selectedRegions])
  const highlighted = useMemo(() => ensureIdSet(highlightRegions), [highlightRegions])

  const handleToggle = useCallback(
    regionId => {
      if (disabled || !onRegionToggle) {
        return
      }
      onRegionToggle(regionId)
    },
    [disabled, onRegionToggle],
  )

  const handleKeyDown = useCallback(
    (event, regionId) => {
      if (disabled) {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onRegionToggle?.(regionId)
      }
    },
    [disabled, onRegionToggle],
  )

  return (
    <div className={`venn-diagram ${className}`.trim()}>
      <svg
        className="venn-diagram__svg"
        viewBox={`0 0 ${config.width} ${config.height}`}
        role="img"
        aria-label={`${setCount}-set Venn diagram`}
      >
        <defs>
          {Object.entries(config.circles).map(([key, { cx, cy, r }]) => (
            <clipPath
              id={`${diagramId}-clip-${key}`}
              key={`${diagramId}-clip-${key}`}
              clipPathUnits="userSpaceOnUse"
            >
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          ))}

          {Object.entries(config.circles).map(([key, { cx, cy, r }]) => (
            <mask
              id={`${diagramId}-mask-only-${key}`}
              maskUnits="userSpaceOnUse"
              key={`${diagramId}-mask-only-${key}`}
            >
              <rect width={config.width} height={config.height} fill="black" />
              <circle cx={cx} cy={cy} r={r} fill="white" />
            </mask>
          ))}

          {Object.entries(config.circles).map(([key, { cx, cy, r }]) => (
            <mask
              id={`${diagramId}-mask-not-${key}`}
              maskUnits="userSpaceOnUse"
              key={`${diagramId}-mask-not-${key}`}
            >
              <rect width={config.width} height={config.height} fill="white" />
              <circle cx={cx} cy={cy} r={r} fill="black" />
            </mask>
          ))}

          {setCount === 3 && (
            <>
              <mask id={`${diagramId}-mask-only-BC`} maskUnits="userSpaceOnUse">
                <rect width={config.width} height={config.height} fill="black" />
                <g clipPath={`url(#${diagramId}-clip-C)`}>
                  <circle
                    cx={config.circles.B.cx}
                    cy={config.circles.B.cy}
                    r={config.circles.B.r}
                    fill="white"
                  />
                </g>
              </mask>
              <mask id={`${diagramId}-mask-only-AC`} maskUnits="userSpaceOnUse">
                <rect width={config.width} height={config.height} fill="black" />
                <g clipPath={`url(#${diagramId}-clip-C)`}>
                  <circle
                    cx={config.circles.A.cx}
                    cy={config.circles.A.cy}
                    r={config.circles.A.r}
                    fill="white"
                  />
                </g>
              </mask>
              <mask id={`${diagramId}-mask-only-AB`} maskUnits="userSpaceOnUse">
                <rect width={config.width} height={config.height} fill="black" />
                <g clipPath={`url(#${diagramId}-clip-B)`}>
                  <circle
                    cx={config.circles.A.cx}
                    cy={config.circles.A.cy}
                    r={config.circles.A.r}
                    fill="white"
                  />
                </g>
              </mask>
            </>
          )}

          <mask id={`${diagramId}-mask-outside`} maskUnits="userSpaceOnUse">
            <rect width={config.width} height={config.height} fill="white" />
            {Object.values(config.circles).map(({ cx, cy, r }) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="black" />
            ))}
          </mask>
        </defs>

        <g className="venn-diagram__outlines">
          {Object.entries(config.circles).map(([key, { cx, cy, r }]) => (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={r}
              className={`venn-diagram__outline venn-diagram__outline--${key}`}
              aria-hidden="true"
            />
          ))}
        </g>

        <g className="venn-diagram__regions">
          {regionDefs.map(definition => {
            const regionId = definition.id
            const meta = metadata.get(regionId)
            const title = meta?.label ?? regionId
            const isSelected = selected.has(regionId)
            const isHighlight = highlighted.has(regionId)

            let shape = (
              <rect
                x={0}
                y={0}
                width={config.width}
                height={config.height}
                className={[
                  'venn-diagram__region-shape',
                  isSelected ? 'venn-diagram__region-shape--selected' : '',
                  isHighlight ? 'venn-diagram__region-shape--highlight' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )

            if (definition.clipPaths && definition.clipPaths.length > 0) {
              shape = definition.clipPaths.reduceRight(
                (child, clipId) => (
                  <g key={`${regionId}-${clipId}`} clipPath={`url(#${diagramId}-${clipId})`}>
                    {child}
                  </g>
                ),
                shape,
              )
            }

            if (definition.masks && definition.masks.length > 0) {
              shape = definition.masks.reduceRight(
                (child, maskId) => (
                  <g key={`${regionId}-${maskId}`} mask={`url(#${diagramId}-${maskId})`}>
                    {child}
                  </g>
                ),
                shape,
              )
            }

            return (
              <g
                key={regionId}
                className={[
                  'venn-diagram__region',
                  disabled ? 'venn-diagram__region--disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-pressed={isSelected}
                aria-label={title}
                onClick={() => handleToggle(regionId)}
                onKeyDown={event => handleKeyDown(event, regionId)}
              >
                <title>{title}</title>
                {shape}
              </g>
            )
          })}
        </g>

        {showLabels && (
          <g className="venn-diagram__labels" aria-hidden="true">
            {config.labels.map(label => (
              <text key={label.id} x={label.x} y={label.y} className="venn-diagram__label">
                {label.id}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

export default VennDiagram


