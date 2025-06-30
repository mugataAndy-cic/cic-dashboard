import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const SPORTS = [
  "Golf",
  "Tennis",
  "Football",
  "Rugby",
  "Cricket",
  "Hockey",
  "Basketball",
  "Athletics",
  "Swimming",
  "Other"
]

const COVERAGE_TYPES = [
  { id: "equipment", label: "Sports Equipment" },
  { id: "liability", label: "Public Liability" },
  { id: "personal_accident", label: "Personal Accident" },
  { id: "travel", label: "Sports Travel" },
  { id: "event", label: "Event Cancellation" }
]

const FREQUENCY_OPTIONS = [
  { value: "occasional", label: "Occasional (1-2 times per month)" },
  { value: "regular", label: "Regular (1-2 times per week)" },
  { value: "frequent", label: "Frequent (3+ times per week)" },
  { value: "competitive", label: "Competitive (Amateur/Professional)" }
]

interface GolfersSportsmanFormProps {
  formData: any
  onFormChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  productDetails: {
    minValue: number
  }
}

export const GolfersSportsmanForm: React.FC<GolfersSportsmanFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    onFormChange(name, value)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    const currentCoverage = Array.isArray(formData.coverageTypes) 
      ? [...formData.coverageTypes] 
      : []
    
    if (checked) {
      onFormChange('coverageTypes', [...currentCoverage, name])
    } else {
      onFormChange('coverageTypes', currentCoverage.filter(type => type !== name))
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
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Sports Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sport">Primary Sport *</Label>
            <Select
              value={formData.sport || ''}
              onValueChange={(value) => handleSelectChange('sport', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select your sport" />
              </SelectTrigger>
              <SelectContent>
                {SPORTS.map((sport) => (
                  <SelectItem key={sport.toLowerCase()} value={sport.toLowerCase()}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.sport === 'other' && (
              <Input
                id="otherSport"
                name="otherSport"
                value={formData.otherSport || ''}
                onChange={handleInputChange}
                placeholder="Please specify"
                className="w-full mt-2 bg-white border-gray-300 focus:border-red-400 focus:ring-red-300 rounded-md shadow-sm transition duration-150 ease-in-out"
                required={formData.sport === 'other'}
              />
            )}
          </div>
          
          <div>
            <Label htmlFor="playingLevel">Playing Level *</Label>
            <Select
              value={formData.playingLevel || ''}
              onValueChange={(value) => handleSelectChange('playingLevel', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="semi_pro">Semi-Professional</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="playingFrequency">Playing Frequency *</Label>
            <Select
              value={formData.playingFrequency || ''}
              onValueChange={(value) => handleSelectChange('playingFrequency', value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="How often do you play?" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="equipmentValue">Equipment Value (KES) *</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Kes</span>
              <Input
                id="equipmentValue"
                name="equipmentValue"
                type="number"
                value={formData.equipmentValue || ''}
                onChange={handleInputChange}
                placeholder="e.g. 50,000"
                className="pl-12"
                min={0}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-3">Coverage Options *</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COVERAGE_TYPES.map((coverage) => (
              <div key={coverage.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`coverage-${coverage.id}`}
                    name={coverage.id}
                    type="checkbox"
                    aria-label={`Select ${coverage.label} coverage`}
                    title={coverage.label}
                    checked={formData.coverageTypes?.includes(coverage.id) || false}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-0.5"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor={`coverage-${coverage.id}`} className="font-medium">
                    {coverage.label}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo || ''}
            onChange={handleInputChange}
            placeholder="Please provide any additional information about your sports activities..."
            className="mt-2 bg-white border-gray-300 focus:border-red-400 focus:ring-red-300 rounded-md shadow-sm transition duration-150 ease-in-out"
            rows={3}
          />
        </div>
        
        <div className="mt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="golfers-sportsman-terms"
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
              <Label htmlFor="golfers-sportsman-terms" className="font-medium">
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
