import React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const COVERAGE_OPTIONS = [
  { id: 'hospitalization', label: 'Hospitalization' },
  { id: 'outpatient', label: 'Outpatient Services' },
  { id: 'dental', label: 'Dental Care' },
  { id: 'optical', label: 'Optical Care' },
  { id: 'chronic', label: 'Chronic Conditions' },
  { id: 'funeral', label: 'Funeral Expenses' },
]

interface SeniorsPlanFormProps {
  formData: any
  onFormChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  productDetails: {
    minValue: number
  }
}

export const SeniorsPlanForm: React.FC<SeniorsPlanFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}) => {
  // Unified change handler for form inputs and textareas
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  // Handler for select changes (kept for compatibility with some components)
  const handleSelectChange = (name: string, value: string) => {
    onFormChange(name, value)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onFormChange('dateOfBirth', format(date, 'yyyy-MM-dd'))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    const currentConditions = Array.isArray(formData.preExistingConditions) 
      ? [...formData.preExistingConditions] 
      : []
    
    if (checked) {
      onFormChange('preExistingConditions', [...currentConditions, name])
    } else {
      onFormChange('preExistingConditions', currentConditions.filter(condition => condition !== name))
    }
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
        
        <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Personal Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="idNumber">ID Number *</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={formData.idNumber || ''}
              onChange={handleInputChange}
              placeholder="Enter ID number"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label>Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfBirth ? (
                    format(new Date(formData.dateOfBirth), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender || ''}
              onValueChange={(value) => handleSelectChange('gender', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="maritalStatus">Marital Status *</Label>
            <Select
              value={formData.maritalStatus || ''}
              onValueChange={(value) => handleSelectChange('maritalStatus', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            placeholder="Enter your address"
            className="mt-1"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              placeholder="Enter city"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={handleInputChange}
              placeholder="Enter postal code"
              className="mt-1"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Coverage Options *</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {COVERAGE_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`coverage-${option.id}`}
                  name={option.id}
                  aria-label={`Select ${option.label}`}
                  title={option.label}
                  checked={Array.isArray(formData.coverageOptions) && formData.coverageOptions.includes(option.id)}
                  onChange={(e) => {
                    const isChecked = e.target.checked
                    const currentOptions = Array.isArray(formData.coverageOptions) 
                      ? [...formData.coverageOptions] 
                      : []
                    
                    if (isChecked) {
                      onFormChange('coverageOptions', [...currentOptions, option.id])
                    } else {
                      onFormChange('coverageOptions', currentOptions.filter((opt: string) => opt !== option.id))
                    }
                  }}
                  className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                <Label htmlFor={`coverage-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
          <Textarea
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory || ''}
            onChange={(e) => onFormChange(e.target.name, e.target.value)}
            placeholder="Please provide any relevant medical history"
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                aria-label="I agree to the terms and conditions"
                title="I agree to the terms and conditions"
                className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <Label htmlFor="terms" className="font-medium">
                I agree to the terms and conditions and confirm that all information provided is accurate *
              </Label>
            </div>
          </div>
        </div>
        </div>
        
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 mt-8">
          <Button 
            type="submit" 
            className="w-full mt-2 bg-white border-gray-300 focus:border-red-400 focus:ring-red-300 rounded-md shadow-sm transition duration-150 ease-in-out shiny-button"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
