import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PRODUCTS } from "@/constants/products"
import { PRODUCT_DETAILS } from "@/constants/product-details"
import Image from "next/image"

interface ProductSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProduct: (product: string) => void
}

export function ProductSelectionModal({ open, onOpenChange, onSelectProduct }: ProductSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <style jsx global>{`
        /* Custom scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <DialogContent className="max-w-6xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-6">Select a product to get started</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
          {PRODUCTS.map((product) => (
            <Card 
              key={product} 
              className="flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50 cursor-pointer group"
              onClick={() => onSelectProduct(product)}
            >
              <CardHeader className="pb-2">
                <div className="h-40 bg-white rounded-md mb-4 flex items-center justify-center p-4 border border-white group-hover:border-amber-100 transition-colors duration-300">
                  <Image 
                    src={PRODUCT_DETAILS[product as keyof typeof PRODUCT_DETAILS]?.image || "/placeholder.svg"} 
                    alt={product}
                    width={120}
                    height={120}
                    className="object-contain h-full w-auto group-hover:scale-105 transition-transform duration-300"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto'
                    }}
                  />
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-amber-700 transition-colors duration-300">
                  {product}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2 group-hover:text-amber-800/80 transition-colors duration-300">
                  {PRODUCT_DETAILS[product as keyof typeof PRODUCT_DETAILS]?.description || "No description available"}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
