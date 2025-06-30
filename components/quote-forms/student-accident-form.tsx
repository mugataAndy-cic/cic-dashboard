import React, { useState } from "react";
import { MotionWrapper } from "../motion-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

const COVERAGE_OPTIONS = [
  { id: "medical_expenses", label: "Medical Expenses" },
  { id: "permanent_disability", label: "Permanent Disability" },
  { id: "temporary_disability", label: "Temporary Disability" },
  { id: "funeral_expenses", label: "Funeral Expenses" },
  { id: "education_benefit", label: "Education Benefit" },
  { id: "repatriation", label: "Repatriation" }
];

const ACTIVITY_LEVELS = [
  { value: "low", label: "Low (Mostly classroom activities)" },
  { value: "moderate", label: "Moderate (Occasional sports)" },
  { value: "high", label: "High (Competitive sports)" },
  { value: "extreme", label: "Extreme (Adventure sports)" }
] as const;

interface StudentAccidentFormProps {
  formData: any;
  onFormChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  productDetails: {
    minValue: number;
  };
}

export const StudentAccidentForm: React.FC<StudentAccidentFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleDateChange = (date: Date | undefined, fieldName: string) => {
    onFormChange(fieldName, date);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFormChange(name, checked);
  };

  const handleCoverageChange = (optionId: string, checked: boolean) => {
    const currentCoverage = formData.coverageOptions || [];
    
    if (checked) {
      onFormChange('coverageOptions', [...currentCoverage, optionId]);
    } else {
      onFormChange('coverageOptions', currentCoverage.filter((option: string) => option !== optionId));
    }
  };

  const [date, setDate] = useState<Date>();

  return (
    <MotionWrapper>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Student's Full Name */}
          <div className="space-y-2">
            <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
              Student's Full Name
            </Label>
            <Input
              id="studentName"
              name="studentName"
              value={formData.studentName || ''}
              onChange={handleInputChange}
              placeholder="Enter student's full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* School Name */}
          <div className="space-y-2">
            <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">
              School Name
            </Label>
            <Input
              id="schoolName"
              name="schoolName"
              value={formData.schoolName || ''}
              onChange={handleInputChange}
              placeholder="Enter school name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Activity Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 block">
              Activity Level
            </Label>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((level) => (
                <label key={level.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={formData.activityLevel === level.value}
                    onChange={() => onFormChange('activityLevel', level.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <span className="text-gray-700">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Coverage Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Coverage Options</h3>
            <p className="text-sm text-gray-500">Select the coverage options you'd like to include in your policy:</p>
            
            <div className="flex overflow-x-auto pb-2 -mx-1 space-x-3">
              {COVERAGE_OPTIONS.map((option) => (
                <div 
                  key={option.id} 
                  className={`flex-shrink-0 w-40 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.coverageOptions?.includes(option.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCoverageChange(option.id, !formData.coverageOptions?.includes(option.id))}
                >
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      name={`coverage-${option.id}`}
                      aria-label={`Select ${option.label} coverage`}
                      title={`${option.label} coverage option`}
                      checked={formData.coverageOptions?.includes(option.id) || false}
                      onChange={(e) => handleCoverageChange(option.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                    />
                    <Label htmlFor={option.id} className="text-sm font-medium text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Declaration */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="declaration"
                name="declaration"
                aria-label="I declare that the information provided is true and accurate to the best of my knowledge"
                title="Declaration of accuracy"
                checked={formData.declaration || false}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                required
              />
              <div>
                <Label htmlFor="declaration" className="text-sm font-medium text-gray-700">
                  I declare that the information provided is true and accurate to the best of my knowledge.
                </Label>
                <p className="mt-1 text-xs text-gray-500">
                  By checking this box, you acknowledge that providing false information may result in claim denial.
                </p>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 block">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal px-4 py-3 border border-gray-300 rounded-md bg-white",
                    !date && "text-gray-400"
                  )}
                >
                  <span>{date ? format(date, "PPP") : "Select date of birth"}</span>
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    handleDateChange(date, 'dateOfBirth');
                  }}
                  initialFocus
                  className="bg-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Get Quote'}
          </Button>
        </form>
      </div>
    </MotionWrapper>
  );
};
