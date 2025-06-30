import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle as CardTitleBase } from "@/components/ui/card"
import Image from "next/image"
import { ReactNode } from "react"
import { MotionWrapper } from "./motion-wrapper"

interface BaseProductModalProps {
  open: boolean
  product: string
  description: string
  image: string
  note?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  children: ReactNode
  isSubmitting?: boolean
}

export function BaseProductModal({
  open,
  product,
  description,
  image,
  note,
  onOpenChange,
  onSubmit,
  children,
  isSubmitting = false
}: BaseProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Get Your {product} Quote</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MotionWrapper>
          {/* Left Column - Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Get Quote'}
            </Button>
          </form>
          </MotionWrapper>
          
          {/* Right Column - Product Info */}
          <MotionWrapper>
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Quoting For</h3>
              <h2 className="text-2xl font-bold text-gray-800">{product}</h2>
            </div>
            
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-6">
              <Image
                src={image}
                alt={product}
                width={160}
                height={160}
                className="object-contain p-4"
              />
            </div>
            
            <p className="text-gray-600 mb-4">
              {description}
            </p>
            
            {note && (
              <p className="text-sm text-red-600 mt-4 p-3 bg-red-50 rounded-md">
                {note}
              </p>
            )}
          </div>
          </MotionWrapper>
        </div>
      </DialogContent>
    </Dialog>
  )
}
