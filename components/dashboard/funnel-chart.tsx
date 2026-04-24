'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FunnelChartProps {
  data: { stage: string; label: string; count: number; value: number; fill: string }[]
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { payload: { label: string; count: number; value: number } }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{d.label}</p>
      <p className="text-muted-foreground">{d.count} negócio{d.count !== 1 ? 's' : ''}</p>
      <p className="font-semibold">{formatBRL(d.value)}</p>
    </div>
  )
}

// SVG fill attributes don't resolve CSS custom properties via cascade — use a
// React component so Tailwind classes are applied through the CSS cascade.
interface XAxisTickProps {
  x?: number
  y?: number
  payload?: { value: string }
}

function CustomXAxisTick({ x = 0, y = 0, payload }: XAxisTickProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        dx={-4}
        textAnchor="end"
        fontSize={11}
        transform="rotate(-35)"
        className="fill-foreground/60"
      >
        {payload?.value}
      </text>
    </g>
  )
}

interface YAxisTickProps {
  x?: number
  y?: number
  payload?: { value: number }
}

function CustomYAxisTick({ x = 0, y = 0, payload }: YAxisTickProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fontSize={11}
        className="fill-foreground/60"
      >
        {payload?.value}
      </text>
    </g>
  )
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Negócios por Etapa</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 56 }}
            barSize={40}
          >
            <XAxis
              dataKey="label"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
