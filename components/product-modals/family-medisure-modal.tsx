import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Sample plan types
const PLAN_TYPES = [
  "Inpatient Only",
  "Inpatient + Outpatient",
  "Comprehensive"
]

// Sample relationship types
const RELATIONSHIP_TYPES = [
  "Principal Member",
  "Spouse",
  "Child",
  "Parent",
  "Other Dependent"
]

// Sample hospitals - in a real app, this would come from an API
const HOSPITALS = [
  "Nairobi Hospital",
  "Aga Khan University Hospital",
  "MP Shah Hospital",
  "Kenyatta National Hospital",
  "Mater Hospital",
  "Avenue Hospital",
  "Metropolitan Hospital"
]

interface FamilyMember {
  id: string
  name: string
  relationship: string
  dob: string
}

interface FamilyMedisureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function FamilyMedisureModal({ open, onOpenChange, onSubmit }: FamilyMedisureModalProps) {
  const [formData, setFormData] = useState({
    principalName: '',
    idNumber: '',
    phone: '',
    email: '',
    planType: '',
    hospitalPreference: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id'>>({ 
    name: '', 
    relationship: '', 
    dob: '' 
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addFamilyMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.dob) {
      setError('Please fill in all family member details')
      return
    }
    
    setFamilyMembers([
      ...familyMembers,
      {
        ...newMember,
        id: Date.now().toString()
      }
    ])
    
    // Reset new member form
    setNewMember({ name: '', relationship: '', dob: '' })
    setError('')
  }

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.principalName || !formData.idNumber || !formData.phone || 
        !formData.email || !formData.planType || !formData.hospitalPreference) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      familyMembers
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      principalName: '',
      idNumber: '',
      phone: '',
      email: '',
      planType: '',
      hospitalPreference: '',
      address: '',
      city: '',
      postalCode: ''
    })
    setFamilyMembers([])
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="Family Medisure"
      description={PRODUCT_DETAILS["Family Medisure"].description}
      image={PRODUCT_DETAILS["Family Medisure"].image}
      note="Please provide accurate details for all family members to be covered under this plan."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Principal Member Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principalName">Full Name *</Label>
              <Input
                id="principalName"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                placeholder="Principal member's full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID/Passport Number *</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="National ID or Passport number"
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
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Coverage Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planType">Plan Type *</Label>
              <Select
                value={formData.planType}
                onValueChange={(value) => handleSelectChange('planType', value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hospitalPreference">Preferred Hospital *</Label>
              <Select
                value={formData.hospitalPreference}
                onValueChange={(value) => handleSelectChange('hospitalPreference', value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select preferred hospital" />
                </SelectTrigger>
                <SelectContent>
                  {HOSPITALS.map((hospital) => (
                    <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Add Family Members</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Name</Label>
              <Input
                id="memberName"
                name="name"
                value={newMember.name}
                onChange={handleMemberChange}
                placeholder="Full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <select
                id="relationship"
                name="relationship"
                value={newMember.relationship}
                onChange={handleMemberChange}
                aria-label="Select relationship to primary member"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select relationship</option>
                {RELATIONSHIP_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memberDob">Date of Birth</Label>
              <Input
                id="memberDob"
                name="dob"
                type="date"
                value={newMember.dob}
                onChange={handleMemberChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addFamilyMember}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add Family Member
            </button>
          </div>
          
          {familyMembers.length > 0 && (
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Family Members to be Covered</h4>
              <div className="space-y-2">
                {familyMembers.map(member => (
                  <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{member.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({member.relationship})</span>
                      <div className="text-sm text-gray-500">DOB: {member.dob}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFamilyMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Address Details</h3>
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
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
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </BaseProductModal>
  )
}
