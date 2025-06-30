import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Sample sports types
const SPORTS_TYPES = [
  "Golf",
  "Tennis",
  "Cricket",
  "Rugby",
  "Football",
  "Athletics",
  "Swimming",
  "Other"
]

// Coverage types
const COVERAGE_TYPES = [
  "Equipment Only",
  "Public Liability",
  "Personal Accident",
  "Comprehensive"
]

// Equipment types
const EQUIPMENT_TYPES = [
  "Golf Clubs",
  "Golf Cart",
  "Tennis Racquets",
  "Cricket Kit",
  "Rugby Gear",
  "Football Kit",
  "Sports Bags",
  "Other Equipment"
]

interface EquipmentItem {
  id: string
  type: string
  description: string
  value: string
}

interface GolfersSportsmanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function GolfersSportsmanModal({ open, onOpenChange, onSubmit }: GolfersSportsmanModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    sportType: '',
    coverageType: '',
    clubAssociation: '',
    membershipNumber: '',
    competitionParticipation: 'No'
  })
  
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [newEquipment, setNewEquipment] = useState<Omit<EquipmentItem, 'id'>>({ 
    type: '', 
    description: '', 
    value: '' 
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewEquipment(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addEquipment = () => {
    if (!newEquipment.type || !newEquipment.description || !newEquipment.value) {
      setError('Please fill in all equipment details')
      return
    }
    
    const value = parseFloat(newEquipment.value.replace(/[^0-9.]/g, ''))
    
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid equipment value')
      return
    }
    
    setEquipment([
      ...equipment,
      {
        ...newEquipment,
        id: Date.now().toString(),
        value: value.toString()
      }
    ])
    
    // Reset new equipment form
    setNewEquipment({ type: '', description: '', value: '' })
    setError('')
  }

  const removeEquipment = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.email || 
        !formData.sportType || !formData.coverageType) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Calculate total equipment value
    const totalEquipmentValue = equipment.reduce((sum, item) => {
      return sum + parseFloat(item.value)
    }, 0)

    // Prepare data for submission
    const submissionData = {
      ...formData,
      equipment,
      totalEquipmentValue
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      fullName: '',
      idNumber: '',
      phone: '',
      email: '',
      sportType: '',
      coverageType: '',
      clubAssociation: '',
      membershipNumber: '',
      competitionParticipation: 'No'
    })
    setEquipment([])
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="Golfers/Sportsman Insurance"
      description={PRODUCT_DETAILS["Golfers/Sportsman Insurance"].description}
      image={PRODUCT_DETAILS["Golfers/Sportsman Insurance"].image}
      note="Please provide accurate details about your sports equipment and coverage needs."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID/Passport Number</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="National ID or Passport number"
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
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Sports & Coverage Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sportType">Sport Type *</Label>
              <Select
                value={formData.sportType}
                onValueChange={(value) => handleSelectChange('sportType', value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sport type" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverageType">Coverage Type *</Label>
              <Select
                value={formData.coverageType}
                onValueChange={(value) => handleSelectChange('coverageType', value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  {COVERAGE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clubAssociation">Club/Association</Label>
              <Input
                id="clubAssociation"
                name="clubAssociation"
                value={formData.clubAssociation}
                onChange={handleChange}
                placeholder="e.g., Muthaiga Golf Club"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipNumber">Membership Number</Label>
              <Input
                id="membershipNumber"
                name="membershipNumber"
                value={formData.membershipNumber}
                onChange={handleChange}
                placeholder="Club membership number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Do you participate in competitions?</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="competitionParticipation"
                  value="Yes"
                  checked={formData.competitionParticipation === 'Yes'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="competitionParticipation"
                  value="No"
                  checked={formData.competitionParticipation === 'No'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Equipment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentType">Equipment Type</Label>
              <select
                id="equipmentType"
                name="type"
                value={newEquipment.type}
                onChange={handleEquipmentChange}
                aria-label="Select equipment type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select equipment type</option>
                {EQUIPMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentDescription">Description</Label>
              <Input
                id="equipmentDescription"
                name="description"
                value={newEquipment.description}
                onChange={handleEquipmentChange}
                placeholder="Brand, model, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentValue">Value (KES)</Label>
              <Input
                id="equipmentValue"
                name="value"
                type="text"
                value={newEquipment.value}
                onChange={handleEquipmentChange}
                placeholder="e.g., 50,000"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addEquipment}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add Equipment
            </button>
          </div>
          
          {equipment.length > 0 && (
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Equipment to be Covered</h4>
              <div className="space-y-2">
                {equipment.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{item.type}</span>
                      <div className="text-sm text-gray-600">{item.description}</div>
                      <div className="text-sm text-gray-500">KES {parseFloat(item.value).toLocaleString()}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEquipment(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right font-medium">
                Total Equipment Value: KES {equipment.reduce((sum, item) => sum + parseFloat(item.value), 0).toLocaleString()}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </BaseProductModal>
  )
}
