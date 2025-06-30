import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Sample cargo types - in a real app, this would come from an API
const CARGO_TYPES = [
  "General Cargo",
  "Perishable Goods",
  "Hazardous Materials",
  "Oversized Cargo",
  "Refrigerated Cargo",
  "Vehicles",
  "Liquids",
  "Live Animals"
]

// Sample transportation modes
const TRANSPORT_MODES = [
  "Sea Freight",
  "Air Freight",
  "Road Freight",
  "Rail Freight",
  "Multimodal"
]

interface MarineCargoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function MarineCargoModal({ open, onOpenChange, onSubmit }: MarineCargoModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    cargoType: '',
    transportMode: '',
    origin: '',
    destination: '',
    value: '',
    cargoDescription: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.companyName || !formData.contactPerson || !formData.phone || 
        !formData.email || !formData.cargoType || !formData.transportMode || 
        !formData.origin || !formData.destination || !formData.value) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    const value = parseFloat(formData.value.replace(/[^0-9.]/g, ''))
    
    if (isNaN(value)) {
      setError('Please enter a valid cargo value')
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      value: value
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      cargoType: '',
      transportMode: '',
      origin: '',
      destination: '',
      value: '',
      cargoDescription: ''
    })
    
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="Marine Cargo Policy"
      description={PRODUCT_DETAILS["Marine Cargo Policy"].description}
      image={PRODUCT_DETAILS["Marine Cargo Policy"].image}
      note="Please provide accurate details about your cargo for an accurate quote."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +254 700 000000"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cargoType">Type of Cargo *</Label>
            <Select
              value={formData.cargoType}
              onValueChange={(value) => handleSelectChange('cargoType', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cargo type" />
              </SelectTrigger>
              <SelectContent>
                {CARGO_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transportMode">Transport Mode *</Label>
            <Select
              value={formData.transportMode}
              onValueChange={(value) => handleSelectChange('transportMode', value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin *</Label>
            <Input
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="e.g., Mombasa, Kenya"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Durban, South Africa"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="value">Cargo Value (KES) *</Label>
          <Input
            id="value"
            name="value"
            type="text"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g., 1,000,000"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cargoDescription">Cargo Description</Label>
          <textarea
            id="cargoDescription"
            name="cargoDescription"
            value={formData.cargoDescription}
            onChange={handleChange}
            placeholder="Brief description of the cargo (weight, dimensions, special requirements, etc.)"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </BaseProductModal>
  )
}
