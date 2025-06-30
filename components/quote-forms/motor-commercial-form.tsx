import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

const VEHICLE_TYPES = [
  "Pickup",
  "Truck",
  "Van",
  "Bus",
  "Tanker",
  "Trailer",
  "Other"
]

const USAGE_TYPES = [
  "General Cartage",
  "Staff Bus",
  "School Bus",
  "Tourist Vehicle",
  "Car Hire",
  "Taxi",
  "Other"
]

const COVER_TYPES = [
  { id: "comprehensive", name: "Comprehensive" },
  { id: "third_party", name: "Third Party Only" },
  { id: "third_party_fire_theft", name: "Third Party, Fire & Theft" }
]

interface Vehicle {
  id: string
  registration: string
  make: string
  model: string
  year: string
  value: string
  type: string
  usage: string
}

interface MotorCommercialFormProps {
  formData: any
  onFormChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  productDetails: {
    minValue: number
  }
}

export const MotorCommercialForm: React.FC<MotorCommercialFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const [vehicles, setVehicles] = useState<Vehicle[]>(formData.vehicles || [])
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    registration: '',
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    value: '',
    type: '',
    usage: ''
  })
  const [showAddVehicle, setShowAddVehicle] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddVehicle = () => {
    if (!newVehicle.registration || !newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.value || !newVehicle.type || !newVehicle.usage) {
      alert('Please fill in all vehicle details')
      return
    }

    const vehicle: Vehicle = {
      ...newVehicle,
      id: Date.now().toString()
    }

    const updatedVehicles = [...vehicles, vehicle]
    setVehicles(updatedVehicles)
    onFormChange('vehicles', updatedVehicles)
    
    // Reset form
    setNewVehicle({
      registration: '',
      make: '',
      model: '',
      year: new Date().getFullYear().toString(),
      value: '',
      type: '',
      usage: ''
    })
    setShowAddVehicle(false)
  }

  const handleRemoveVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id)
    setVehicles(updatedVehicles)
    onFormChange('vehicles', updatedVehicles)
  }

  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i
  )

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      {/* Custom scrollbar styling */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      
      <div className="form-scroll-container space-y-6">
        {/* Base Form Fields */}
        <div className="space-y-1">
          <Label htmlFor="base-name" className="text-gray-700 font-medium">Full Name *</Label>
          <Input
            id="base-name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="mt-1"
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="base-phone" className="text-gray-700 font-medium">Phone Number *</Label>
          <Input
            id="base-phone"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleInputChange}
            placeholder="e.g. 0712345678"
            className="mt-1"
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="base-email" className="text-gray-700 font-medium">Email Address *</Label>
          <Input
            id="base-email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="mt-1"
            required
          />
        </div>
        
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Business Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName || ''}
              onChange={handleChange}
              placeholder="Your business name"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={formData.businessType || ''}
              onValueChange={(value) => onFormChange('businessType', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="ltd">Limited Company</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="kraPin">KRA PIN *</Label>
            <Input
              id="kraPin"
              name="kraPin"
              value={formData.kraPin || ''}
              onChange={handleChange}
              placeholder="e.g. A123456789X"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="businessAddress">Business Address *</Label>
            <Input
              id="businessAddress"
              name="businessAddress"
              value={formData.businessAddress || ''}
              onChange={handleChange}
              placeholder="Physical address of your business"
              className="mt-1"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Vehicle Fleet</h3>
            <Button
              type="button"
              size="sm"
              onClick={() => setShowAddVehicle(!showAddVehicle)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddVehicle ? 'Cancel' : 'Add Vehicle'}
            </Button>
          </div>
          
          {showAddVehicle && (
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h4 className="font-medium mb-4">Add New Vehicle</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registration">Registration Number *</Label>
                  <Input
                    id="registration"
                    name="registration"
                    value={newVehicle.registration}
                    onChange={handleVehicleChange}
                    placeholder="e.g. KAA 123A"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    name="make"
                    value={newVehicle.make}
                    onChange={handleVehicleChange}
                    placeholder="e.g. Toyota"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    name="model"
                    value={newVehicle.model}
                    onChange={handleVehicleChange}
                    placeholder="e.g. Hiace"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Select
                    value={newVehicle.year}
                    onValueChange={(value) => setNewVehicle({...newVehicle, year: value})}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Vehicle Type *</Label>
                  <Select
                    value={newVehicle.type}
                    onValueChange={(value) => setNewVehicle({...newVehicle, type: value})}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((type) => (
                        <SelectItem key={type.toLowerCase()} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="usage">Usage Type *</Label>
                  <Select
                    value={newVehicle.usage}
                    onValueChange={(value) => setNewVehicle({...newVehicle, usage: value})}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select usage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {USAGE_TYPES.map((usage) => (
                        <SelectItem key={usage.toLowerCase().replace(/\s+/g, '_')} value={usage.toLowerCase().replace(/\s+/g, '_')}>
                          {usage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="value">Vehicle Value (KES) *</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Kes</span>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={newVehicle.value}
                      onChange={handleVehicleChange}
                      placeholder="e.g. 2,500,000"
                      className="pl-12"
                      min={0}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddVehicle}
                    className="w-full"
                  >
                    Add to Fleet
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {vehicles.length > 0 ? (
            <div className="space-y-2">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{vehicle.registration}</p>
                    <p className="text-sm text-gray-600">
                      {vehicle.make} {vehicle.model} • {vehicle.type} • {vehicle.year}
                    </p>
                    <p className="text-sm text-gray-600">
                      KES {parseInt(vehicle.value).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No vehicles added to the fleet yet</p>
              <p className="text-sm text-gray-400 mt-1">Click 'Add Vehicle' to get started</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Coverage Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverType">Type of Cover *</Label>
              <Select
                value={formData.coverType || ''}
                onValueChange={(value) => onFormChange('coverType', value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select cover type" />
                </SelectTrigger>
                <SelectContent>
                  {COVER_TYPES.map((cover) => (
                    <SelectItem key={cover.id} value={cover.id}>
                      {cover.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="excess">Excess Amount (KES)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Kes</span>
                  <Input
                    id="excess"
                    name="excess"
                    type="number"
                    value={formData.excess || ''}
                    onChange={handleChange}
                    placeholder="e.g. 10,000"
                    className="pl-12"
                    min={0}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  The amount you'll pay in case of a claim (optional)
                </p>
              </div>
              
              <div>
                <Label htmlFor="ncd">No Claims Discount (NCD)</Label>
                <Select
                  value={formData.ncd || ''}
                  onValueChange={(value) => onFormChange('ncd', value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select NCD percentage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% - No Discount</SelectItem>
                    <SelectItem value="10">10% - 1 Year Claim Free</SelectItem>
                    <SelectItem value="20">20% - 2 Years Claim Free</SelectItem>
                    <SelectItem value="30">30% - 3 Years Claim Free</SelectItem>
                    <SelectItem value="40">40% - 4+ Years Claim Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo || ''}
                onChange={handleChange}
                placeholder="Any other information about your fleet or coverage needs..."
                className="w-full mt-2 bg-white border-gray-300 focus:border-red-400 focus:ring-red-300 rounded-md shadow-sm transition duration-150 ease-in-out p-2 border rounded-md min-h-[80px] text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="motor-commercial-terms"
                name="terms"
                type="checkbox"
                required
                aria-label="I confirm that all information provided is accurate and I agree to the terms and conditions"
                title="I confirm that all information provided is accurate and I agree to the terms and conditions"
                checked={formData.termsAccepted || false}
                onChange={(e) => onFormChange('termsAccepted', e.target.checked)}
                className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <Label htmlFor="terms" className="font-medium">
                I confirm that all information provided is accurate and I agree to the terms and conditions *
              </Label>
              <p className="text-gray-500 mt-1">
                By checking this box, you acknowledge that providing false information may result in claim denial.
              </p>
            </div>
          </div>
        </div>
        </div>
        
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 mt-8">
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 py-6 text-base font-medium shadow-md shiny-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Get Quote'}
          </Button>
        </div>
      </div>
    </div>
  )
}
