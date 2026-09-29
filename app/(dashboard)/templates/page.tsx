'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PageTransition } from '@/components/ui/page-transition';
import { TemplateCard } from '@/components/dashboard/template-card';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileText, LayoutDashboard, Component, Briefcase, FileBarChart, MonitorSmartphone } from 'lucide-react';
import { toast } from 'sonner';

const templates = [
  {
    id: 1,
    title: 'SaaS Admin Dashboard',
    description: 'A complete boilerplate for a SaaS application including billing and user management.',
    category: 'Dashboard',
    icon: <LayoutDashboard className="w-12 h-12" />,
    downloads: '14.2k',
  },
  {
    id: 2,
    title: 'E-commerce Storefront',
    description: 'Beautiful store components with cart, product grid, and checkout flows.',
    category: 'Store',
    icon: <MonitorSmartphone className="w-12 h-12" />,
    downloads: '8.5k',
  },
  {
    id: 3,
    title: 'Professional Invoice',
    description: 'Clean, printable invoice template with auto-calculating totals and tax fields.',
    category: 'Finance',
    icon: <FileText className="w-12 h-12" />,
    downloads: '22.1k',
  },
  {
    id: 4,
    title: 'Kanban Project Board',
    description: 'Drag and drop project management board with custom columns and tags.',
    category: 'Projects',
    icon: <Briefcase className="w-12 h-12" />,
    downloads: '5.6k',
  },
  {
    id: 5,
    title: 'Annual Revenue Report',
    description: 'Data-rich report layout optimized for PDF generation and executive summaries.',
    category: 'Reports',
    icon: <FileBarChart className="w-12 h-12" />,
    downloads: '11.3k',
  },
  {
    id: 6,
    title: 'Shadcn UI Blocks',
    description: 'A massive collection of pre-built UI sections (Hero, Features, Pricing, etc).',
    category: 'UI Kit',
    icon: <Component className="w-12 h-12" />,
    downloads: '45.8k',
  }
];

const categories = ['All', 'Dashboard', 'UI Kit', 'Finance', 'Projects', 'Reports', 'Store'];

export default function TemplatesPage() {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase()) || 
                          template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUse = (title: string) => {
    toast.success(`Template "${title}" installed successfully!`, {
      description: "It has been added to your workspace.",
    });
  };

  const handlePreview = (title: string) => {
    toast.info(`Previewing "${title}"`, {
      description: "Opening live preview in a new window...",
    });
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Free Templates Library" 
          description="Browse and install high-quality templates for your workspace."
        />

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
            <Filter className="h-4 w-4 text-muted-foreground mr-1 hidden sm:block" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id}
                title={template.title}
                description={template.description}
                category={template.category}
                icon={template.icon}
                downloads={template.downloads}
                onPreview={() => handlePreview(template.title)}
                onUse={() => handleUse(template.title)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No templates found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                We couldn't find any templates matching "{search}" in the {activeCategory} category.
              </p>
            </div>
            <Button variant="outline" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
