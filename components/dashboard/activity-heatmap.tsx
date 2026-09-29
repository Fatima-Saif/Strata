'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityHeatmapData, HeatmapDataPoint } from '@/lib/api/charts';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ActivityHeatmap() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity-heatmap'],
    queryFn: fetchActivityHeatmapData,
    staleTime: 60 * 1000,
  });

  const svgRef = React.useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  const [hoveredCell, setHoveredCell] = React.useState<HeatmapDataPoint | null>(null);

  React.useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 800;
    const height = 150;
    const cellSize = 13;
    const cellMargin = 3;
    
    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('font-family', 'var(--font-sans)');

    // Map themes to CSS variables, these should be static strings so D3 can apply them
    const colorScales = [
      'var(--muted)', // 0
      'hsl(var(--primary) / 0.3)', // 1
      'hsl(var(--primary) / 0.5)', // 2
      'hsl(var(--primary) / 0.8)', // 3
      'hsl(var(--primary) / 1.0)', // 4
    ];

    const timeWeek = d3.timeSunday;
    const countDay = (d: Date) => d.getDay();
    const formatDay = (d: Date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
    const formatMonth = d3.timeFormat('%b');

    // Group by week
    const weeks = d3.groups(data, (d: HeatmapDataPoint) => timeWeek(d.date));
    
    // Create main group
    const g = svg.append('g').attr('transform', 'translate(30, 20)');

    // Day labels
    const days = [1, 3, 5]; // Mon, Wed, Fri
    g.append('g')
      .selectAll('text')
      .data(days)
      .join('text')
      .attr('transform', (d: number) => `translate(-15, ${(d + 0.5) * (cellSize + cellMargin)})`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'var(--muted-foreground)')
      .text((d: number) => formatDay(new Date(2000, 0, 2 + d))); // Fixed reference date to get day names

    // Months labels
    // Find week indexes where month changes
    const monthChanges: { month: Date, index: number }[] = [];
    let currentMonth = -1;
    weeks.forEach(([weekDate], i) => {
      if (weekDate.getMonth() !== currentMonth) {
        monthChanges.push({ month: weekDate, index: i });
        currentMonth = weekDate.getMonth();
      }
    });

    g.append('g')
      .selectAll('text')
      .data(monthChanges)
      .join('text')
      .attr('x', (d: { month: Date, index: number }) => d.index * (cellSize + cellMargin))
      .attr('y', -5)
      .attr('font-size', '10px')
      .attr('fill', 'var(--muted-foreground)')
      .text((d: { month: Date, index: number }) => formatMonth(d.month));

    // Draw cells
    g.append('g')
      .selectAll('g')
      .data(weeks)
      .join('g')
      .attr('transform', (d: [Date, HeatmapDataPoint[]], i: number) => `translate(${i * (cellSize + cellMargin)}, 0)`)
      .selectAll('rect')
      .data((d: [Date, HeatmapDataPoint[]]) => d[1])
      .join('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('y', (d: HeatmapDataPoint) => countDay(d.date) * (cellSize + cellMargin))
      .attr('rx', 2)
      .attr('fill', (d: HeatmapDataPoint) => colorScales[d.level])
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')
      .on('mouseenter', function(event: any, d: HeatmapDataPoint) {
        d3.select(this).style('opacity', 0.7);
        setHoveredCell(d);
      })
      .on('mouseleave', function() {
        d3.select(this).style('opacity', 1);
        setHoveredCell(null);
      });

  }, [data, theme]);

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[150px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-4 border-destructive/50">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription className="text-destructive">Failed to load activity data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[150px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const colorScales = [
    'var(--muted)',
    'hsl(var(--primary) / 0.3)',
    'hsl(var(--primary) / 0.5)',
    'hsl(var(--primary) / 0.8)',
    'hsl(var(--primary) / 1.0)',
  ];

  return (
    <Card className="col-span-1 lg:col-span-4 relative overflow-visible">
      <CardHeader>
        <CardTitle>User Activity Heatmap</CardTitle>
        <CardDescription>Daily platform engagement over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-6 relative">
        <div className="min-w-[750px] relative h-[150px]">
          <TooltipProvider delay={0}>
            <Tooltip open={!!hoveredCell}>
              <TooltipTrigger className="absolute inset-0 z-0 border-none outline-none focus:outline-none">
                <svg ref={svgRef} className="w-full h-full" />
              </TooltipTrigger>
              {hoveredCell && (
                <TooltipContent 
                  className="z-50 pointer-events-none"
                  // This relies on radix mouse following or just fixed center, 
                  // but since we trigger manually, it might just stick to the container.
                  // For a true mouse-following tooltip, we'd use a fixed div with mouse coords.
                  // But we'll let Radix handle it by centering it on the chart. 
                >
                  <p className="font-semibold text-center mb-1">
                    {hoveredCell.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Logins:</span>
                      <span className="font-mono">{hoveredCell.login}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Sessions:</span>
                      <span className="font-mono">{hoveredCell.session}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Purchases:</span>
                      <span className="font-mono">{hoveredCell.purchase}</span>
                    </div>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground min-w-[750px]">
          <span>Less</span>
          <div className="flex gap-1">
            {colorScales.map((color, i) => (
              <div key={i} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: color, border: i === 0 ? '1px solid var(--border)' : 'none' }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
