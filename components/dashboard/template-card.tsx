import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/motion';

export interface TemplateCardProps {
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  downloads: string;
  onPreview: () => void;
  onUse: () => void;
}

export function TemplateCard({ title, description, category, icon, downloads, onPreview, onUse }: TemplateCardProps) {
  return (
    <motion.div variants={slideUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="flex flex-col h-full overflow-hidden group">
        <div className="h-40 bg-muted/50 border-b border-border flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
          <div className="relative z-10 text-primary opacity-80 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <Badge className="absolute top-3 right-3 z-10" variant="default">Free</Badge>
          <Badge className="absolute top-3 left-3 z-10" variant="outline">{category}</Badge>
        </div>
        <CardHeader className="flex-1 pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <Download className="h-3 w-3" />
            {downloads} installs
          </div>
        </CardContent>
        <CardFooter className="gap-2 pt-0">
          <Button variant="outline" className="w-full flex-1" onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button className="w-full flex-1" onClick={onUse}>
            Use
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
