import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      style={{ 
        padding: '20px', 
        marginTop: '10px', 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
      className={cn(
        "bg-card text-card-foreground rounded-2xl border-2 shadow-sm hover:shadow-md transition-shadow min-h-[180px]",
        className
      )}
      {...props} 
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-row items-start justify-between p-0 m-0", className)}
      {...props} />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold p-0 m-0", className)}
      {...props} />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div 
      data-slot="card-content" 
      className={cn("p-0 m-0", className)} 
      {...props} 
    />
  );
}

export { Card, CardHeader, CardTitle, CardContent }