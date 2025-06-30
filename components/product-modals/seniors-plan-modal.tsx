import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Coverage options for seniors
const COVERAGE_TYPES = [
  { id: 'inpatient', label: 'Inpatient Cover', description: 'Hospitalization and treatment costs' },
  { id: 'outpatient', label: 'Outpatient Cover', description: 'Clinic visits and consultations' },
  { id: 'dental', label: 'Dental Care', description: 'Dental check-ups and procedures' },
  { id: 'optical', label: 'Optical Care', description: 'Eye tests and glasses/contacts' },
  { id: 'chronic', label: 'Chronic Conditions', description: 'Management of chronic illnesses' },
  { id: 'funeral', label: 'Funeral Expenses', description: 'Coverage for funeral costs' },
]

// Pre-existing conditions
const PRE_EXISTING_CONDITIONS = [
  "Hypertension",
  "Diabetes",
  "Arthritis",
  "Heart Disease",
  "Asthma",
  "Cancer",
  "Stroke",
  "Kidney Disease",
  "Other"
]

// Payment frequencies
const PAYMENT_FREQUENCIES = [
  "Monthly",
  "Quarterly",
  "Annually"
]

// Relationship types for dependents
const RELATIONSHIP_TYPES = [
  "Spouse",
  "Child",
  "Sibling",
  "Other Relative",
  "Caregiver"
]

interface SeniorsPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function SeniorsPlanModal({ open, onOpenChange, onSubmit }: SeniorsPlanModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    nhifNumber: '',
    preExistingConditions: [] as string[],
    otherCondition: '',
    hasDependents: 'No',
    coverType: 'Individual',
    paymentFrequency: 'Annually',
  })
  
  const [dependents, setDependents] = useState<Array<{
    id: string
    name: string
    relationship: string
    dob: string
    idNumber: string
  }>>([])
  
  const [newDependent, setNewDependent] = useState({
    name: '',
    relationship: '',
    dob: '',
    idNumber: ''
  })
  
  const [selectedCoverage, setSelectedCoverage] = useState<Record<string, boolean>>(
    COVERAGE_TYPES.reduce((acc, type) => ({
      ...acc,
      [type.id]: false
    }), {})
  )
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'preExistingConditions') {
        setFormData(prev => ({
          ...prev,
          preExistingConditions: checked
            ? [...prev.preExistingConditions, value]
            : prev.preExistingConditions.filter(item => item !== value)
        }))
      }
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

  const handleDependentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewDependent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addDependent = () => {
    if (!newDependent.name || !newDependent.relationship || !newDependent.dob || !newDependent.idNumber) {
      setError('Please fill in all dependent details')
      return
    }
    
    // Validate date of birth
    const dob = new Date(newDependent.dob)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    if (age < 60) {
      setError('Dependents must be 60 years or older')
      return
    }
    
    setDependents([
      ...dependents,
      {
        ...newDependent,
        id: Date.now().toString()
      }
    ])
    
    // Reset form
    setNewDependent({
      name: '',
      relationship: '',
      dob: '',
      idNumber: ''
    })
    setError('')
  }

  const removeDependent = (id: string) => {
    setDependents(dependents.filter(dep => dep.id !== id))
  }

  const toggleCoverage = (id: string) => {
    setSelectedCoverage(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.fullName || !formData.idNumber || !formData.dateOfBirth || 
        !formData.gender || !formData.phone || !formData.address) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }
    
    // Validate age (must be 60+)
    const dob = new Date(formData.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    if (age < 60) {
      setError('Primary applicant must be 60 years or older')
      setIsSubmitting(false)
      return
    }
    
    // Validate at least one coverage selected
    const selectedCoverages = Object.entries(selectedCoverage)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id)
    
    if (selectedCoverages.length === 0) {
      setError('Please select at least one coverage option')
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      dependents,
      coverages: selectedCoverages,
      totalDependents: dependents.length
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      fullName: '',
      idNumber: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      nhifNumber: '',
      preExistingConditions: [],
      otherCondition: '',
      hasDependents: 'No',
      coverType: 'Individual',
      paymentFrequency: 'Annually',
    })
    
    setDependents([])
    setSelectedCoverage(
      COVERAGE_TYPES.reduce((acc, type) => ({
        ...acc,
        [type.id]: false
      }), {})
    )
    
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="CIC Seniors Plan"
      description={PRODUCT_DETAILS["CIC Seniors Plan"].description}
      image={PRODUCT_DETAILS["CIC Seniors Plan"].image}
      note="Please provide accurate information to help us customize the best coverage for your needs."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Personal Information</h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                name="gender"
                title="Select your gender"
                value={formData.gender}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                title="Select your marital status"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              required
            />
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
            
            <div className="space-y-2">
              <Label htmlFor="nhifNumber">NHIF Number (if any)</Label>
              <Input
                id="nhifNumber"
                name="nhifNumber"
                value={formData.nhifNumber}
                onChange={handleChange}
                placeholder="NHIF membership number"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Health Information</h3>
          
          <div className="space-y-2">
            <Label>Do you have any pre-existing medical conditions? *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {PRE_EXISTING_CONDITIONS.map(condition => (
                <label key={condition} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="preExistingConditions"
                    value={condition}
                    checked={formData.preExistingConditions.includes(condition)}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{condition}</span>
                </label>
              ))}
            </div>
            
            {formData.preExistingConditions.includes('Other') && (
              <div className="mt-2">
                <Label htmlFor="otherCondition">Please specify:</Label>
                <Input
                  id="otherCondition"
                  name="otherCondition"
                  value={formData.otherCondition}
                  onChange={handleChange}
                  placeholder="Specify other condition"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Coverage Options</h3>
          <p className="text-sm text-gray-600">Select the types of coverage you need:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COVERAGE_TYPES.map(type => (
              <div 
                key={type.id}
                onClick={() => toggleCoverage(type.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCoverage[type.id] 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`coverage-${type.id}`}
                    checked={selectedCoverage[type.id]}
                    onChange={() => toggleCoverage(type.id)}
                    className="h-5 w-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <label 
                      htmlFor={`coverage-${type.id}`}
                      className="font-medium text-gray-900 cursor-pointer"
                    >
                      {type.label}
                    </label>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Dependents</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Any dependents to include?</span>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="hasDependents"
                    value="Yes"
                    checked={formData.hasDependents === 'Yes'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="hasDependents"
                    value="No"
                    checked={formData.hasDependents === 'No'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
          
          {formData.hasDependents === 'Yes' && (
            <div className="space-y-4 border rounded-lg p-4">
              <h4 className="font-medium">Add Dependents (60+ years)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dependentName">Full Name</Label>
                  <Input
                    id="dependentName"
                    name="name"
                    value={newDependent.name}
                    onChange={handleDependentChange}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dependentRelationship">Relationship</Label>
                  <select
                    id="dependentRelationship"
                    name="relationship"
                    title="Select dependent's relationship to you"
                    value={newDependent.relationship}
                    onChange={handleDependentChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select relationship</option>
                    {RELATIONSHIP_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dependentDob">Date of Birth</Label>
                  <Input
                    id="dependentDob"
                    name="dob"
                    type="date"
                    value={newDependent.dob}
                    onChange={handleDependentChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dependentIdNumber">ID/Passport</Label>
                  <Input
                    id="dependentIdNumber"
                    name="idNumber"
                    value={newDependent.idNumber}
                    onChange={handleDependentChange}
                    placeholder="ID/Passport number"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addDependent}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Add Dependent
                </button>
              </div>
              
              {dependents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Dependents to be covered:</p>
                  <div className="border rounded-md divide-y">
                    {dependents.map(dep => (
                      <div key={dep.id} className="flex justify-between items-center p-3">
                        <div>
                          <p className="font-medium">{dep.name}</p>
                          <p className="text-sm text-gray-600">
                            {dep.relationship} • {dep.dob} • {dep.idNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDependent(dep.id)}
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
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Plan Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverType">Cover Type</Label>
              <Select
                value={formData.coverType}
                onValueChange={(value) => handleSelectChange('coverType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cover type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">Payment Frequency</Label>
              <Select
                value={formData.paymentFrequency}
                onValueChange={(value) => handleSelectChange('paymentFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment frequency" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_FREQUENCIES.map(freq => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
              <li>All applicants must be 60 years or older.</li>
              <li>Pre-existing conditions may be subject to waiting periods.</li>
              <li>Premium rates are based on age and selected coverage options.</li>
              <li>Dependents must be 60 years or older to be included in the plan.</li>
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
