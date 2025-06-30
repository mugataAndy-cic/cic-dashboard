import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

interface PrivateMotorFormProps {
  formData: any
  onFormChange: (name: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  productDetails: {
    minValue: number
  }
}

export const PrivateMotorForm: React.FC<PrivateMotorFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}) => {
  const [models, setModels] = React.useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    onFormChange(name, value)
  }

  // Simulate model fetching based on make
  React.useEffect(() => {
    if (formData.make) {
      const mockModels = [
        `${formData.make} Model 1`,
        `${formData.make} Model 2`,
        `${formData.make} Model 3`,
      ]
      setModels(mockModels)
      onFormChange('model', '') // Reset model when make changes
    } else {
      setModels([])
    }
  }, [formData.make])

  const handleBaseFormChange = (name: string, value: string) => {
    onFormChange(name, value)
  }

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <style jsx global>{`
        .form-scroll-container {
          max-height: calc(100vh - 250px);
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        .form-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .form-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .form-scroll-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .form-scroll-container::-webkit-scrollbar-thumb:hover {
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
        
        <div>
          <Label htmlFor="make">Vehicle Make *</Label>
          <Select
            value={formData.make || ''}
            onValueChange={(value) => onFormChange('make', value)}
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
            value={formData.model || ''}
            onValueChange={(value) => onFormChange('model', value)}
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
            value={formData.year || ''}
            onValueChange={(value) => onFormChange('year', value)}
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
              value={formData.value || ''}
              onChange={(e) => onFormChange('value', e.target.value)}
              placeholder="e.g. 1,500,000"
              className="pl-12 bg-white border-gray-300 focus:border-red-400 focus:ring-red-300 rounded-md shadow-sm transition duration-150 ease-in-out"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum value for comprehensive cover is Kes {productDetails.minValue.toLocaleString()}
          </p>
        </div>
        
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 mt-8">
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 py-6 text-base font-medium shadow-md shiny-button"
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
