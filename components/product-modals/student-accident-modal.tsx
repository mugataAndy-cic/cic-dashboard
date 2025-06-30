import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BaseProductModal } from "@/components/base-product-modal"
import { PRODUCT_DETAILS } from "@/constants/product-details"

// Sample institutions - in a real app, this would come from an API
const INSTITUTIONS = [
  "University of Nairobi",
  "Kenyatta University",
  "Strathmore University",
  "United States International University",
  "Jomo Kenyatta University",
  "Technical University of Kenya",
  "Mount Kenya University",
  "Other"
]

// Coverage options
const COVERAGE_OPTIONS = [
  { id: 'medical', label: 'Medical Expenses', defaultCovered: true },
  { id: 'permanent', label: 'Permanent Disability', defaultCovered: true },
  { id: 'death', label: 'Accidental Death', defaultCovered: true },
  { id: 'funeral', label: 'Funeral Expenses', defaultCovered: false },
  { id: 'education', label: 'Education Benefit', defaultCovered: false },
  { id: 'bursary', label: 'Bursary Benefit', defaultCovered: false },
]

// Relationship to student
const RELATIONSHIP_TYPES = [
  "Parent",
  "Guardian",
  "Relative",
  "Self",
  "Other"
]

interface StudentAccidentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function StudentAccidentModal({ open, onOpenChange, onSubmit }: StudentAccidentModalProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    institution: '',
    admissionNumber: '',
    course: '',
    yearOfStudy: '',
    parentName: '',
    relationship: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    city: '',
    postalCode: ''
  })
  
  const [coverage, setCoverage] = useState<Record<string, boolean>>(
    COVERAGE_OPTIONS.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.defaultCovered
    }), {})
  )
  
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

  const toggleCoverage = (id: string) => {
    setCoverage(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    // Validate form
    if (!formData.studentName || !formData.dateOfBirth || !formData.gender || 
        !formData.institution || !formData.parentName || !formData.parentPhone || 
        !formData.relationship) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Calculate age from date of birth
    const birthDate = new Date(formData.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    if (age < 5 || age > 30) {
      setError('Student age must be between 5 and 30 years')
      setIsSubmitting(false)
      return
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      age,
      coverage,
      selectedCoverage: Object.entries(coverage)
        .filter(([_, isCovered]) => isCovered)
        .map(([id]) => id)
    }

    // Call the parent's onSubmit handler
    onSubmit(submissionData)
    
    // Reset form
    setFormData({
      studentName: '',
      idNumber: '',
      dateOfBirth: '',
      gender: '',
      institution: '',
      admissionNumber: '',
      course: '',
      yearOfStudy: '',
      parentName: '',
      relationship: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      city: '',
      postalCode: ''
    })
    
    setCoverage(
      COVERAGE_OPTIONS.reduce((acc, option) => ({
        ...acc,
        [option.id]: option.defaultCovered
      }), {})
    )
    
    setIsSubmitting(false)
  }

  return (
    <BaseProductModal
      open={open}
      product="Student/Personal Accident Cover"
      description={PRODUCT_DETAILS["Student/Personal Accident Cover"].description}
      image={PRODUCT_DETAILS["Student/Personal Accident Cover"].image}
      note="Please provide accurate details for accurate coverage and premium calculation."
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Student Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Full Name *</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Student's full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID/Passport/Birth Certificate</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="ID/Passport/Birth Certificate No."
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
                required
                max={new Date().toISOString().split('T')[0]}
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
              <Label htmlFor="institution">Institution *</Label>
              <Select
                value={formData.institution}
                onValueChange={(value) => handleSelectChange('institution', value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTIONS.map((institution) => (
                    <SelectItem key={institution} value={institution}>{institution}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.institution === 'Other' && (
                <Input
                  id="otherInstitution"
                  name="institutionOther"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="Specify institution"
                  className="mt-2"
                />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="admissionNumber">Admission/Registration Number</Label>
              <Input
                id="admissionNumber"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                placeholder="Student admission/registration number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="course">Course of Study</Label>
              <Input
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., Bachelor of Commerce"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yearOfStudy">Year of Study</Label>
            <select
              id="yearOfStudy"
              name="yearOfStudy"
              title="Select your current year of study"
              value={formData.yearOfStudy}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select year of study</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
              <option value="6">6th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Parent/Guardian Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Full Name *</Label>
              <Input
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Parent/guardian's full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Student *</Label>
              <select
                id="relationship"
                name="relationship"
                title="Select your relationship to the student"
                value={formData.relationship}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select relationship</option>
                {RELATIONSHIP_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Phone Number *</Label>
              <Input
                id="parentPhone"
                name="parentPhone"
                type="tel"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="e.g. +254 700 000000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Email Address</Label>
              <Input
                id="parentEmail"
                name="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Coverage Options</h3>
          <p className="text-sm text-gray-600">Select the types of coverage you need:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COVERAGE_OPTIONS.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`coverage-${option.id}`}
                  checked={coverage[option.id]}
                  onChange={() => toggleCoverage(option.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`coverage-${option.id}`} className="text-sm font-medium">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Contact Address</h3>
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
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    </BaseProductModal>
  )
}
