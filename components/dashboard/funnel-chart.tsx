'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchFunnelData } from '@/lib/api/charts';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';

// ApexCharts needs to be loaded client-side only
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function FunnelChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['funnel-chart'],
    queryFn: fetchFunnelData,
    staleTime: 60 * 1000,
  });

  const { theme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-1 lg:col-span-2 border-destructive/50">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription className="text-destructive">Failed to load funnel data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // Primary brand color to generic gradient
  const primaryColor = isDark ? '#a78bfa' : '#6366f1'; 

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'var(--font-sans)',
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: false
        }
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (!config) return;
          const stage = data[config.dataPointIndex].stage;
          toast({
            title: `Navigating to ${stage}`,
            description: "This would open a filtered users view in a real app.",
          });
        }
      }
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        barHeight: '80%',
        isFunnel: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opt: any) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val.toLocaleString();
      },
      dropShadow: { enabled: true, top: 1, left: 1, blur: 1, opacity: 0.5 },
      style: {
        fontSize: '13px',
        fontWeight: 'bold',
      }
    },
    xaxis: {
      categories: data.map(d => d.stage),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false }
    },
    colors: [primaryColor],
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [isDark ? '#8b5cf6' : '#4f46e5'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val: number, { dataPointIndex }: any) => {
          if (dataPointIndex === 0) return val.toLocaleString();
          const prevVal = data[dataPointIndex - 1].count;
          const dropoff = ((val / prevVal) * 100).toFixed(1);
          return `${val.toLocaleString()} (${dropoff}% of previous stage)`;
        }
      }
    },
    grid: { show: false },
  };

  const series = [{
    name: 'Users',
    data: data.map(d => d.count)
  }];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>User journey from visitor to enterprise</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {/* @ts-ignore - ReactApexChart types can be finicky */}
          <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
