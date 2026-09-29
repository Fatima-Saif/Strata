'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchCountryDistributionData } from '@/lib/api/charts';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function CountryMap() {
  const [metric, setMetric] = React.useState<'revenue' | 'users'>('revenue');
  const [tooltipContent, setTooltipContent] = React.useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['country-map', metric],
    queryFn: () => fetchCountryDistributionData(metric),
    staleTime: 60 * 1000,
  });

  const maxValue = React.useMemo(() => {
    if (!data) return 0;
    return Math.max(...data.map(d => d.value));
  }, [data]);

  const colorScale = scaleLinear<string>()
    .domain([0, maxValue])
    .range(["hsl(var(--primary) / 0.1)", "hsl(var(--primary) / 1.0)"]);

  const formatValue = (val: number) => {
    if (metric === 'revenue') {
      return `$${(val / 1000).toFixed(1)}k`;
    }
    return val.toLocaleString();
  };

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    if (!data) return;
    const countryData = data.find(d => d.id === geo.id);
    if (countryData) {
      setTooltipContent(countryData);
      setTooltipPos({ x: event.clientX, y: event.clientY });
    } else {
      setTooltipContent({ name: geo.properties.name, value: 0, growth: 0 });
      setTooltipPos({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <Card className="col-span-1 lg:col-span-2 relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Global Distribution</CardTitle>
          <CardDescription>Activity by geographic region</CardDescription>
        </div>
        <Select value={metric} onValueChange={(val) => setMetric(val as 'revenue' | 'users')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="users">Active Users</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="p-0 flex items-center justify-center min-h-[350px]">
        {isLoading ? (
          <Skeleton className="w-[90%] h-[300px] rounded-lg" />
        ) : isError ? (
          <p className="text-muted-foreground">Failed to load map data.</p>
        ) : (
          <div className="w-full h-full pb-4">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }} width={800} height={450}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = data?.find((s) => s.id === geo.id);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(e) => handleMouseEnter(geo, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: {
                            fill: d ? colorScale(d.value) : "var(--muted)",
                            stroke: "var(--background)",
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "all 250ms",
                          },
                          hover: {
                            fill: d ? "hsl(var(--primary) / 0.8)" : "hsl(var(--muted-foreground) / 0.5)",
                            stroke: "var(--background)",
                            strokeWidth: 1,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "hsl(var(--primary) / 0.9)",
                            outline: "none",
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        )}
      </CardContent>

      {/* Floating Tooltip outside standard flow */}
      {tooltipContent && (
        <div 
          className="fixed z-50 pointer-events-none bg-background border rounded-lg shadow-lg p-3 text-sm min-w-[150px]"
          style={{ 
            left: `${tooltipPos.x + 15}px`, 
            top: `${tooltipPos.y + 15}px`,
            // Prevent falling off right edge
            transform: tooltipPos.x > window.innerWidth - 200 ? 'translateX(-110%)' : 'none'
          }}
        >
          <p className="font-bold mb-2 pb-2 border-b">{tooltipContent.name}</p>
          <div className="flex justify-between items-center gap-4 mb-1">
            <span className="text-muted-foreground capitalize">{metric}:</span>
            <span className="font-mono font-medium">{formatValue(tooltipContent.value)}</span>
          </div>
          {tooltipContent.value > 0 && (
            <div className="flex justify-between items-center gap-4">
              <span className="text-muted-foreground">Growth:</span>
              <span className={`font-mono font-medium ${tooltipContent.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                {tooltipContent.growth > 0 ? '+' : ''}{tooltipContent.growth.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
