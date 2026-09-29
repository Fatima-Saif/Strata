import * as React from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, DollarSign, Activity } from "lucide-react"

export default function ShowcasePage() {
  return (
    <div className="container mx-auto py-10 space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Component Showcase</h1>
          <p className="text-muted-foreground mt-2 text-lg">Verify theme configuration and core primitives.</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Primitives: StatCard & AnimatedCounter</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={45231.89}
            prefix="$"
            trend="up"
            trendValue="+20.1%"
            icon={<DollarSign className="h-4 w-4" />}
            sparklineData={[{value:10}, {value:20}, {value:15}, {value:40}]}
            gradient
          />
          <StatCard
            title="Active Users"
            value={2350}
            trend="up"
            trendValue="+180.1%"
            icon={<Users className="h-4 w-4" />}
            sparklineData={[{value:100}, {value:120}, {value:90}, {value:150}]}
          />
          <StatCard
            title="Active Now"
            value={12.4}
            suffix="K"
            trend="down"
            trendValue="-4%"
            icon={<Activity className="h-4 w-4" />}
          />
          <StatCard
            title="Loading Example"
            value={0}
            isLoading={true}
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Shadcn UI Base Components</h2>
        <div className="grid gap-8 md:grid-cols-2">
          
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>All variant styles</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forms & Inputs</CardTitle>
              <CardDescription>Controls and states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <label htmlFor="airplane-mode" className="text-sm font-medium">Airplane Mode</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Accept terms and conditions
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  )
}
