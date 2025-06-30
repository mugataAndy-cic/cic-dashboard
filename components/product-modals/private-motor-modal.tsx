import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Sample vehicle data - in a real app, this would come from an API
const VEHICLE_MAKES = [
  "Toyota",
  "Nissan",
  "Mitsubishi",
  "Subaru",
  "Mazda",
  "Honda",
  "Suzuki",
  "Isuzu",
  "Mercedes",
  "BMW"
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)

interface PrivateMotorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function PrivateMotorModal({ open, onOpenChange, onSubmit }: PrivateMotorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    make: '',
    model: '',
    year: '',
    value: ''
  })
  const [models, setModels] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // In a real app, this would fetch models from an API based on the selected make
  useEffect(() => {
    if (formData.make) {
      // Simulate API call to get models
      const mockModels = [
        `${formData.make} Model 1`,
        `${formData.make} Model 2`,
        `${formData.make} Model 3`,
      ]
      setModels(mockModels)
      setFormData(prev => ({ ...prev, model: '' })) // Reset model when make changes
    } else {
      setModels([])
    }
  }, [formData.make])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.name || !formData.phone || !formData.email || 
        !formData.make || !formData.model || !formData.year || !formData.value) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    const value = parseFloat(formData.value.replace(/[^0-9.]/g, ''))
    const minValue = 500000 // Minimum value for comprehensive cover
    
    if (isNaN(value) || value < minValue) {
      setError(`Minimum value for comprehensive cover is KES ${minValue.toLocaleString()}`)
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      value: value,
      product: 'Private Motor Insurance'
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      make: '',
      model: '',
      year: '',
      value: ''
    })
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="Private Motor Insurance"
      description={PRODUCT_DETAILS["Private Motor Insurance"].description}
      image={PRODUCT_DETAILS["Private Motor Insurance"].image}
      note="N/B: This product does not cover vehicles used for hire and reward."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 0712345678"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="make">Vehicle Make *</Label>
          <Select
            value={formData.make}
            onValueChange={(value) => handleSelectChange('make', value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_MAKES.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="model">Vehicle Model *</Label>
          <Select
            value={formData.model}
            onValueChange={(value) => handleSelectChange('model', value)}
            disabled={!formData.make}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder={formData.make ? "Select model" : "Select make first"} />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="year">Year of Manufacture *</Label>
          <Select
            value={formData.year}
            onValueChange={(value) => handleSelectChange('year', value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="value">Vehicle Value *</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Kes</span>
            <Input
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="e.g. 1,500,000"
              className="pl-12"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum value for comprehensive cover is Kes 500,000
          </p>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}
      </div>
    </BaseProductModal>
  )
}
