
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { PrivateMotorForm } from "./quote-forms/private-motor-form"
import { SeniorsPlanForm } from "./quote-forms/seniors-plan-form"
import { FamilyMedisureForm } from "./quote-forms/family-medisure-form"
import { GolfersSportsmanForm } from "./quote-forms/golfers-sportsman-form"
import { MotorCommercialForm } from "./quote-forms/motor-commercial-form"
import { StudentAccidentForm } from "./quote-forms/student-accident-form"
import { MarineCargoForm } from "./quote-forms/marine-cargo-form"
import { PRODUCT_DETAILS } from "@/constants/product-details"

interface QuoteRequestModalProps {
  open: boolean
  product: string
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

type FormData = {
  // Base form fields
  name: string
  phone: string
  email: string
  
  // Common fields
  termsAccepted?: boolean
  
  // Allow additional fields for different forms
  [key: string]: any
}

export function QuoteRequestModal({ open, product, onOpenChange, onSubmit }: QuoteRequestModalProps) {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    phone: '',
    email: ''
    // Additional fields will be added by specific form components
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Get product details from shared constants
  const productInfo = PRODUCT_DETAILS[product as keyof typeof PRODUCT_DETAILS] || {
    description: "Product details not available.",
    image: "/placeholder.svg"
  }

  // Map of products to their form components
  const productFormComponents = {
    "CIC Seniors Plan": {
      formComponent: SeniorsPlanForm,
      note: "Available for individuals aged 50 years and above.",
      minValue: 25000
    },
    "Family Medisure": {
      formComponent: FamilyMedisureForm,
      note: "Covers up to 6 family members under one plan.",
      minValue: 15000
    },
    "Golfers/Sportsman Insurance": {
      formComponent: GolfersSportsmanForm,
      note: "Covers equipment, personal accident, and liability for various sports activities.",
      minValue: 10000
    },
    "Motor Commercial": {
      formComponent: MotorCommercialForm,
      note: "Special rates available for fleet policies with 5+ vehicles.",
      minValue: 1000000
    },
    "Student/Personal Accident Cover": {
      formComponent: StudentAccidentForm,
      note: "Valid 24/7, worldwide coverage for students in educational institutions.",
      minValue: 2000
    },
    "Private Motor Insurance": {
      formComponent: PrivateMotorForm,
      note: "N/B: This product does not cover vehicles used for hire and reward.",
      minValue: 500000
    },
    "Marine Cargo Policy": {
      formComponent: MarineCargoForm,
      note: "Coverage includes all risks of physical loss or damage from external causes.",
      minValue: 50000
    }
  }[product as keyof typeof PRODUCT_DETAILS] || {
    formComponent: null,
    note: "",
    minValue: 0
  }

  // Combine shared product info with form-specific details
  const productDetails = {
    ...productInfo,
    ...productFormComponents
  }

  const handleFormChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Basic validation - specific validation should be handled in the form components
      if (!formData.name || !formData.phone || !formData.email) {
        throw new Error('Please fill in all required fields')
      }
      
      // Check if terms were accepted (if required by the form)
      if (formData.termsAccepted === false) {
        throw new Error('Please accept the terms and conditions')
      }

      // In a real app, this would submit to an API
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Prepare the submission data
      const submissionData = {
        ...formData,
        product: product,
        timestamp: new Date().toISOString()
      }
      
      // Call the parent's onSubmit handler
      onSubmit(submissionData)
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get the appropriate form component for the product
  const FormComponent = productDetails.formComponent || (() => (
    <div className="p-4 text-center text-gray-600">
      No form available for this product.
    </div>
  ))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Get Your Quote Now</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            {'formComponent' in productDetails ? (
              <form onSubmit={handleSubmit}>
                <FormComponent 
                  formData={formData}
                  onFormChange={handleFormChange}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  productDetails={productDetails}
                />
              </form>
            ) : (
              <div className="p-4 text-center text-gray-600">
                No form available for this product.
              </div>
            )}
          </div>
          
          {/* Right Column - Product Info */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Quoting For</h3>
              <h2 className="text-2xl font-bold text-gray-800">{product}</h2>
            </div>
            
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-6">
              <Image
                src={productDetails.image}
                alt={product}
                width={160}
                height={160}
                className="object-contain p-4"
              />
            </div>
            
            <p className="text-gray-600 mb-4">
              {productDetails.description}
            </p>
            
            {productDetails.note && (
              <p className="text-sm text-red-600 mt-4 p-3 bg-red-50 rounded-md">
                {productDetails.note}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
