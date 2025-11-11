import { useMemo } from 'react'
import { getRegionMetadata, getVennRegionIds } from '../../utils/vennUtils.js'
import './RegionSelector.css'

function ensureSet(value) {
  if (!value) {
    return new Set()
  }

  if (value instanceof Set) {
    return value
  }

  return new Set(Array.isArray(value) ? value : [value])
}

function RegionSelector({ setCount = 2, selectedRegions, onToggleRegion, disabled = false }) {
  const selected = useMemo(() => ensureSet(selectedRegions), [selectedRegions])

  const regions = useMemo(() => {
    const metadata = new Map()
    for (const item of getRegionMetadata(setCount)) {
      metadata.set(item.id, item)
    }

    return getVennRegionIds(setCount)
      .map(regionId => metadata.get(regionId))
      .filter(Boolean)
  }, [setCount])

  if (regions.length === 0) {
    return null
  }

  return (
    <div className="region-selector" role="group" aria-label="Select Venn regions">
      {regions.map(region => {
        const isSelected = selected.has(region.id)
        return (
          <button
            key={region.id}
            type="button"
            className={[
              'region-selector__button',
              isSelected ? 'region-selector__button--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onToggleRegion?.(region.id)}
          >
            <span className="region-selector__label">{region.label}</span>
            {region.description && (
              <span className="region-selector__hint">{region.description}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default RegionSelector


