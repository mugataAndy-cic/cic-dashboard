import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"

const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Other"
]

const PLAN_TYPES = [
  { id: "basic", name: "Basic Plan", coverage: "Inpatient only" },
  { id: "standard", name: "Standard Plan", coverage: "Inpatient + Outpatient" },
  { id: "premium", name: "Premium Plan", coverage: "Full coverage + Dental & Optical" }
]

interface FamilyMember {
  id: string
  name: string
  relationship: string
  dateOfBirth: string
  planType: string
}

interface FamilyMedisureFormProps {
  formData: any
  onFormChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  productDetails: {
    minValue: number
  }
}

export const FamilyMedisureForm: React.FC<FamilyMedisureFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [newMember, setNewMember] = useState<Omit<FamilyMember, 'id'>>({ 
    name: '', 
    relationship: '',
    dateOfBirth: '',
    planType: ''
  })

  // Unified change handler for form inputs and textareas
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  // Handler for select changes (kept for compatibility with some components)
  const handleSelectChange = (name: string, value: string) => {
    onFormChange(name, value)
  }

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewMember(prev => ({
        ...prev,
        dateOfBirth: format(date, 'yyyy-MM-dd')
      }))
    }
  }

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.dateOfBirth || !newMember.planType) {
      alert('Please fill in all member details')
      return
    }

    const member: FamilyMember = {
      ...newMember,
      id: Date.now().toString()
    }

    setFamilyMembers([...familyMembers, member])
    onFormChange('familyMembers', [...familyMembers, member])
    
    // Reset form
    setNewMember({ 
      name: '', 
      relationship: '',
      dateOfBirth: '',
      planType: ''
    })
  }

  const handleRemoveMember = (id: string) => {
    const updatedMembers = familyMembers.filter(member => member.id !== id)
    setFamilyMembers(updatedMembers)
    onFormChange('familyMembers', updatedMembers)
  }

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

        {/* Family Members List */}
        {familyMembers.length > 0 && (
          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Family Members</h3>
            <div className="space-y-2">
              {familyMembers.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">
                      {member.relationship} • {member.dateOfBirth} • {PLAN_TYPES.find(p => p.id === member.planType)?.name || member.planType}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
          
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add Family Member</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="memberName">Full Name *</Label>
                <Input
                  id="memberName"
                  name="name"
                  value={newMember.name}
                  onChange={handleNewMemberChange}
                  placeholder="Member's full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="relationship">Relationship *</Label>
                <Select
                  value={newMember.relationship}
                  onValueChange={(value) => setNewMember({...newMember, relationship: value})}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map((relation) => (
                      <SelectItem key={relation} value={relation.toLowerCase()}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newMember.dateOfBirth ? (
                        format(new Date(newMember.dateOfBirth), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMember.dateOfBirth ? new Date(newMember.dateOfBirth) : undefined}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="planType">Plan Type *</Label>
                <Select
                  value={newMember.planType}
                  onValueChange={(value) => setNewMember({...newMember, planType: value})}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_TYPES.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.coverage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMember}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Coverage Details</h4>
            <div className="space-y-2">
              {PLAN_TYPES.map((plan) => (
                <div key={plan.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`plan-${plan.id}`}
                      name="selectedPlans"
                      type="checkbox"
                      aria-label={`Select ${plan.name} plan`}
                      title={plan.name}
                      checked={formData.selectedPlans?.includes(plan.id) || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        const currentPlans = Array.isArray(formData.selectedPlans) 
                          ? [...formData.selectedPlans] 
                          : []
                        
                        if (isChecked) {
                          onFormChange('selectedPlans', [...currentPlans, plan.id])
                        } else {
                          onFormChange('selectedPlans', currentPlans.filter(id => id !== plan.id))
                        }
                      }}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-1"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label htmlFor={`plan-${plan.id}`} className="font-medium">
                      {plan.name}
                    </Label>
                    <p className="text-gray-500">{plan.coverage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  aria-label="I confirm that all information provided is accurate and I agree to the terms and conditions"
                  title="I confirm that all information provided is accurate and I agree to the terms and conditions"
                  checked={formData.termsAccepted || false}
                  onChange={(e) => onFormChange('termsAccepted', e.target.checked)}
                  className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-0.5"
                />
              </div>
              <div className="ml-3 text-sm">
                <Label htmlFor="terms" className="font-medium">
                  I confirm that all information provided is accurate and I agree to the terms and conditions *
                </Label>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 mt-8">
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 py-6 text-base font-medium shadow-md shiny-button"
              disabled={isSubmitting}
              onClick={onSubmit}
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

export default FamilyMedisureForm
