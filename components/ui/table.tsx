"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { motion } from "framer-motion"
import { staggerContainer, slideUp } from "@/lib/motion"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ 
  className, 
  animated = false,
  ...props 
}: React.ComponentProps<"tbody"> & { animated?: boolean }) {
  const Comp = animated ? motion.tbody : "tbody"
  const motionProps = animated ? {
    variants: staggerContainer,
    initial: "hidden",
    animate: "show"
  } : {}

  return (
    <Comp
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...(motionProps as any)}
      {...(props as any)}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ 
  className, 
  animated = false,
  index = 0,
  ...props 
}: React.ComponentProps<"tr"> & { animated?: boolean, index?: number }) {
  const Comp = animated ? motion.tr : "tr"
  // Cap stagger animation at 15 rows to prevent performance lag on large tables
  const motionProps = animated ? {
    variants: slideUp,
    custom: index, // useful if doing manual stagger based on custom prop
    // if index is over 15, we could disable the animation by overriding variants
    ...(index > 15 ? { variants: {}, initial: "show", animate: "show" } : {})
  } : {}

  return (
    <Comp
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...(motionProps as any)}
      {...(props as any)}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
