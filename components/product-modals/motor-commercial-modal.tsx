import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Sample vehicle types
const VEHICLE_TYPES = [
  "Pickup Truck",
  "Truck",
  "Van",
  "Bus",
  "Lorry",
  "Tanker",
  "Trailer",
  "Other"
]

// Sample body types
const BODY_TYPES = [
  "Flatbed",
  "Box",
  "Refrigerated",
  "Tanker",
  "Dump",
  "Crane",
  "Tipper",
  "Other"
]

// Sample usage types
const USAGE_TYPES = [
  "General Cartage",
  "Passenger Transport",
  "Goods Transport",
  "Construction",
  "Mining",
  "Agriculture",
  "Waste Management",
  "Other"
]

// Sample coverage types
const COVERAGE_TYPES = [
  { id: 'comprehensive', label: 'Comprehensive', description: 'Covers damage to your vehicle and third-party liabilities' },
  { id: 'thirdParty', label: 'Third Party Only', description: 'Covers third-party liabilities only' },
  { id: 'theft', label: 'Theft Only', description: 'Covers vehicle theft and attempted theft' },
  { id: 'fire', label: 'Fire & Theft', description: 'Covers fire damage and theft' },
  { id: 'passenger', label: 'Passenger Liability', description: 'Covers injuries to passengers' },
  { id: 'goods', label: 'Goods in Transit', description: 'Covers goods being transported' },
]

// Sample makes and models - in a real app, this would come from an API
const VEHICLE_MAKES = [
  "Toyota",
  "Isuzu",
  "Mitsubishi",
  "Nissan",
  "Mercedes-Benz",
  "MAN",
  "Scania",
  "Volvo",
  "Other"
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)

interface Vehicle {
  id: string
  registration: string
  make: string
  model: string
  year: string
  type: string
  value: string
}

interface MotorCommercialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function MotorCommercialModal({ open, onOpenChange, onSubmit }: MotorCommercialModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    kraPin: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    businessType: '',
    yearsInBusiness: '',
    hasFleet: 'No',
    fleetSize: '1',
    insuranceHistory: 'New',
    previousInsurer: '',
    claimsHistory: 'No',
    coverType: 'comprehensive',
    usageType: '',
    excess: '2.5',
    paymentPlan: 'Annually',
  })
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({ 
    registration: '',
    make: '',
    model: '',
    year: '',
    type: '',
    value: ''
  })
  
  const [models, setModels] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Simulate fetching models based on make
  useEffect(() => {
    if (newVehicle.make) {
      // In a real app, this would be an API call
      const mockModels = [
        `${newVehicle.make} Model 1`,
        `${newVehicle.make} Model 2`,
        `${newVehicle.make} Model 3`,
      ]
      setModels(mockModels)
      setNewVehicle(prev => ({ ...prev, model: '' }))
    } else {
      setModels([])
    }
  }, [newVehicle.make])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 'Yes' : 'No'
      }))
    } else if (type === 'number') {
      // Ensure numeric values are positive
      const numValue = parseFloat(value) || 0
      setFormData(prev => ({
        ...prev,
        [name]: Math.max(0, numValue).toString()
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addVehicle = () => {
    if (!newVehicle.registration || !newVehicle.make || !newVehicle.model || 
        !newVehicle.year || !newVehicle.type || !newVehicle.value) {
      setError('Please fill in all vehicle details')
      return
    }
    
    const value = parseFloat(newVehicle.value.replace(/[^0-9.]/g, ''))
    
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid vehicle value')
      return
    }
    
    setVehicles([
      ...vehicles,
      {
        ...newVehicle,
        id: Date.now().toString(),
        value: value.toString()
      }
    ])
    
    // Reset form
    setNewVehicle({
      registration: '',
      make: '',
      model: '',
      year: '',
      type: '',
      value: ''
    })
    setError('')
  }

  const removeVehicle = (id: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.companyName || !formData.contactPerson || !formData.phone || 
        !formData.email || !formData.businessType || !formData.coverType || 
        !formData.usageType) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }
    
    if (vehicles.length === 0) {
      setError('Please add at least one vehicle')
      setIsSubmitting(false)
      return
    }

    // Calculate total value of all vehicles
    const totalFleetValue = vehicles.reduce((sum, vehicle) => {
      return sum + parseFloat(vehicle.value)
    }, 0)

    // Prepare data for submission
    const submissionData = {
      ...formData,
      vehicles,
      totalFleetValue,
      fleetSize: vehicles.length.toString()
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      companyName: '',
      kraPin: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      businessType: '',
      yearsInBusiness: '',
      hasFleet: 'No',
      fleetSize: '1',
      insuranceHistory: 'New',
      previousInsurer: '',
      claimsHistory: 'No',
      coverType: 'comprehensive',
      usageType: '',
      excess: '2.5',
      paymentPlan: 'Annually',
    })
    
    setVehicles([])
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="Motor Commercial"
      description={PRODUCT_DETAILS["Motor Commercial"].description}
      image={PRODUCT_DETAILS["Motor Commercial"].image}
      note="Please provide accurate details about your commercial vehicles for an accurate quote."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kraPin">KRA PIN</Label>
              <Input
                id="kraPin"
                name="kraPin"
                value={formData.kraPin}
                onChange={handleChange}
                placeholder="e.g., A123456789B"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessType">Type of Business *</Label>
              <Input
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="e.g., Transport, Logistics, Construction"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearsInBusiness">Years in Business</Label>
              <Input
                id="yearsInBusiness"
                name="yearsInBusiness"
                type="number"
                min="0"
                value={formData.yearsInBusiness}
                onChange={handleChange}
                placeholder="Number of years"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Contact Person</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Full Name *</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Contact person's name"
                required
              />
            </div>
            
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City/Town</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City/Town"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Insurance Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverType">Type of Cover *</Label>
              <Select
                value={formData.coverType}
                onValueChange={(value) => handleSelectChange('coverType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cover type" />
                </SelectTrigger>
                <SelectContent>
                  {COVERAGE_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usageType">Vehicle Usage *</Label>
              <select
                id="usageType"
                name="usageType"
                value={formData.usageType}
                onChange={handleChange}
                aria-label="Select vehicle usage type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select usage type</option>
                {USAGE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceHistory">Insurance History</Label>
              <select
                id="insuranceHistory"
                name="insuranceHistory"
                value={formData.insuranceHistory}
                onChange={handleChange}
                aria-label="Select insurance history"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="New">New to Insurance</option>
                <option value="Renewal">Renewal</option>
                <option value="Switching">Switching Insurer</option>
              </select>
            </div>
            
            {formData.insuranceHistory !== 'New' && (
              <div className="space-y-2">
                <Label htmlFor="previousInsurer">Previous Insurer</Label>
                <Input
                  id="previousInsurer"
                  name="previousInsurer"
                  value={formData.previousInsurer}
                  onChange={handleChange}
                  placeholder="Previous insurance company"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="claimsHistory">Claims in Last 3 Years</Label>
              <select
                id="claimsHistory"
                name="claimsHistory"
                title="Claims history in the last 3 years"
                value={formData.claimsHistory}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="No">No Claims</option>
                <option value="1">1 Claim</option>
                <option value="2">2 Claims</option>
                <option value="3+">3+ Claims</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="excess">Voluntary Excess (% of claim)</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  id="excess"
                  name="excess"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.excess}
                  onChange={handleChange}
                  aria-label="Select voluntary excess percentage"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 text-sm font-medium">{formData.excess}%</span>
              </div>
              <p className="text-xs text-gray-500">Higher excess may lower your premium</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentPlan">Payment Plan</Label>
              <select
                id="paymentPlan"
                name="paymentPlan"
                value={formData.paymentPlan}
                onChange={handleChange}
                aria-label="Select payment plan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Annually">Annually (5% discount)</option>
                <option value="Semi-Annually">Semi-Annually</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly (3% admin fee)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Vehicle Details</h3>
            <div className="text-sm text-gray-600">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} added
            </div>
          </div>
          
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">Add Vehicle</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registration">Registration Number *</Label>
                <Input
                  id="registration"
                  name="registration"
                  value={newVehicle.registration}
                  onChange={handleVehicleChange}
                  placeholder="e.g., KAA 123A"
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <select
                  id="make"
                  name="make"
                  value={newVehicle.make}
                  onChange={handleVehicleChange}
                  aria-label="Select vehicle make"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select make</option>
                  {VEHICLE_MAKES.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <select
                  id="model"
                  name="model"
                  aria-label="Select vehicle model"
                  value={newVehicle.model}
                  onChange={handleVehicleChange}
                  disabled={!newVehicle.make}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select model</option>
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year of Manufacture *</Label>
                <select
                  id="year"
                  name="year"
                  value={newVehicle.year}
                  onChange={handleVehicleChange}
                  aria-label="Select year of manufacture"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select year</option>
                  {YEARS.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <select
                  id="type"
                  name="type"
                  value={newVehicle.type}
                  onChange={handleVehicleChange}
                  aria-label="Select vehicle type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select type</option>
                  {VEHICLE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">Current Market Value (KES) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                  <Input
                    id="value"
                    name="value"
                    type="text"
                    value={newVehicle.value}
                    onChange={handleVehicleChange}
                    placeholder="e.g., 2,500,000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addVehicle}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Add Vehicle
              </button>
            </div>
            
            {vehicles.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Vehicles to be Covered</h5>
                <div className="border rounded-md divide-y">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{vehicle.registration}</p>
                        <p className="text-sm text-gray-600">
                          {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          KES {parseFloat(vehicle.value).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVehicle(vehicle.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right font-medium">
                  Total Fleet Value: KES {vehicles.reduce((sum, v) => sum + parseFloat(v.value), 0).toLocaleString()}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
              <li>All vehicles must have valid inspection certificates.</li>
              <li>Commercial vehicles require a valid PSV license if used for passenger transport.</li>
              <li>Drivers must have valid driving licenses for the vehicle class.</li>
              <li>Additional discounts available for fleets of 5+ vehicles.</li>
            </ul>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </BaseProductModal>
  )
}
