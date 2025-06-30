import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const CARGO_TYPES = [
  "General Cargo",
  "Perishable Goods",
  "Hazardous Materials",
  "Machinery & Equipment",
  "Vehicles",
  "Electronics",
  "Textiles",
  "Construction Materials",
  "Other"
]

const TRANSPORT_MODES = [
  "Sea Freight",
  "Air Freight",
  "Road Freight",
  "Rail Freight",
  "Multimodal"
]

const COVERAGE_TYPES = [
  { id: "all_risks", name: "All Risks", description: "Covers all risks of physical loss or damage" },
  { id: "free_particular_average", name: "Free of Particular Average (FPA)", description: "Covers total losses and general average" },
  { id: "with_average", name: "With Average (WA)", description: "Covers partial losses above a certain percentage" },
  { id: "theft_pilferage", name: "Theft & Pilferage", description: "Covers theft and pilferage during transit" },
  { id: "war_risks", name: "War Risks", description: "Covers losses due to war or related perils" },
  { id: "strikes_riots", name: "Strikes, Riots & Civil Commotions", description: "Covers losses due to civil unrest" }
]

interface CargoItem {
  id: string
  description: string
  type: string
  quantity: number
  weight: number
  value: number
}

interface MarineCargoFormProps {
  formData: any
  onFormChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  productDetails: {
    minValue: number
  }
}

export function MarineCargoForm({
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  productDetails
}: MarineCargoFormProps) {
  const [cargoItems, setCargoItems] = useState<CargoItem[]>(formData.cargoItems || [])
  const [newCargoItem, setNewCargoItem] = useState<Omit<CargoItem, 'id'>>({
    description: '',
    type: '',
    quantity: 1,
    weight: 0,
    value: 0
  })
  const [showAddCargo, setShowAddCargo] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onFormChange(name, checked);
    } else if (type === 'number') {
      onFormChange(name, value === '' ? '' : Number(value));
    } else {
      onFormChange(name, value);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    onFormChange(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const currentTypes = Array.isArray(formData.coverageTypes) ? [...formData.coverageTypes] : [];
    
    if (checked) {
      onFormChange('coverageTypes', [...currentTypes, name]);
    } else {
      onFormChange('coverageTypes', currentTypes.filter((type: string) => type !== name));
    }
  };

  const handleCargoItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCargoItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'weight' || name === 'value' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleAddCargoItem = () => {
    if (!newCargoItem.description || !newCargoItem.type || newCargoItem.value <= 0) {
      alert('Please fill in all required cargo details');
      return;
    }

    const cargoItem: CargoItem = {
      ...newCargoItem,
      id: Date.now().toString()
    };

    const updatedCargoItems = [...cargoItems, cargoItem];
    setCargoItems(updatedCargoItems);
    onFormChange('cargoItems', updatedCargoItems);
    
    // Reset form
    setNewCargoItem({
      description: '',
      type: '',
      quantity: 1,
      weight: 0,
      value: 0
    });
    setShowAddCargo(false);
  };

  const handleRemoveCargoItem = (id: string) => {
    const updatedCargoItems = cargoItems.filter(item => item.id !== id);
    setCargoItems(updatedCargoItems);
    onFormChange('cargoItems', updatedCargoItems);
  };

  const calculateTotalValue = () => {
    return cargoItems.reduce((sum, item) => sum + (item.value * item.quantity), 0);
  };

  return (
    <div className="marine-cargo-form-scroll space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <style jsx global>{`
        .marine-cargo-form-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .marine-cargo-form-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .marine-cargo-form-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .marine-cargo-form-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Personal Information</h3>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Marine Cargo Insurance</h3>
              <p className="text-sm text-muted-foreground">Please fill in the details below to get a quote</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          {/* Cargo Details Section */}
          <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Cargo Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargoType">Type of Cargo <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.cargoType || ''}
                  onValueChange={(value) => handleSelectChange('cargoType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cargo type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARGO_TYPES.map((type) => (
                      <SelectItem key={type.toLowerCase().replace(/\s+/g, '_')} value={type.toLowerCase().replace(/\s+/g, '_')}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transportMode">Mode of Transport <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.transportMode || ''}
                  onValueChange={(value) => handleSelectChange('transportMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_MODES.map((mode) => (
                      <SelectItem key={mode.toLowerCase().replace(/\s+/g, '_')} value={mode.toLowerCase().replace(/\s+/g, '_')}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origin">Place of Origin <span className="text-red-500">*</span></Label>
                <Input
                  id="origin"
                  name="origin"
                  value={formData.origin || ''}
                  onChange={handleChange}
                  placeholder="e.g. Mombasa Port, Kenya"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Final Destination <span className="text-red-500">*</span></Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination || ''}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi, Kenya"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Cargo Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCargo(!showAddCargo)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddCargo ? 'Cancel' : 'Add Cargo Item'}
                </Button>
              </div>
              
              {showAddCargo && (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <h4 className="font-medium mb-4">Add Cargo Item</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargoDescription">Description <span className="text-red-500">*</span></Label>
                      <Input
                        id="cargoDescription"
                        name="description"
                        value={newCargoItem.description}
                        onChange={handleCargoItemChange}
                        placeholder="Detailed description of the cargo"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="itemType">Cargo Type <span className="text-red-500">*</span></Label>
                      <Select
                        value={newCargoItem.type}
                        onValueChange={(value) => setNewCargoItem({...newCargoItem, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cargo type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CARGO_TYPES.map((type) => (
                            <SelectItem key={type.toLowerCase().replace(/\s+/g, '_')} value={type.toLowerCase().replace(/\s+/g, '_')}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={newCargoItem.quantity}
                        onChange={handleCargoItemChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newCargoItem.weight}
                          onChange={handleCargoItemChange}
                          className="pl-12"
                          required
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value">Value (KES) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                        <Input
                          id="value"
                          name="value"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newCargoItem.value}
                          onChange={handleCargoItemChange}
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        type="button"
                        onClick={handleAddCargoItem}
                        className="w-full"
                      >
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {cargoItems.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value (KES)</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (KES)</th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cargoItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.weight.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.value.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {(item.quantity * item.value).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => handleRemoveCargoItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Remove cargo item"
                                aria-label="Remove cargo item"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                            Total Value:
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-gray-900">
                            KES {calculateTotalValue().toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Total Cargo Value: <span className="font-medium">KES {calculateTotalValue().toLocaleString()}</span></p>
                    {productDetails?.minValue && calculateTotalValue() < productDetails.minValue && (
                      <p className="text-red-500 mt-1">
                        Minimum sum insured should be KES {productDetails.minValue.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-gray-500">No cargo items added yet. Click "Add Cargo Item" to get started.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Coverage Options Section */}
          <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Coverage Options</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium">Select Coverage Type <span className="text-red-500">*</span></h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COVERAGE_TYPES.map((coverage) => (
                  <div key={coverage.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <label className="flex items-start space-x-3">
                      <div className="flex items-center h-5">
                        <input
                          id={coverage.id}
                          name={coverage.id}
                          type="checkbox"
                          checked={Array.isArray(formData.coverageTypes) && formData.coverageTypes.includes(coverage.id)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="block text-sm font-medium text-gray-900">
                            {coverage.name}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {coverage.description}
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Additional Coverage Options</h4>
                
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="warehouse_cover"
                        name="warehouse_cover"
                        type="checkbox"
                        checked={formData.warehouse_cover || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="warehouse_cover" className="font-medium text-gray-900">
                        Warehouse to Warehouse Coverage
                      </label>
                      <p className="text-gray-500">
                        Extends coverage to include temporary storage at origin and destination
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="transit_delay"
                        name="transit_delay"
                        type="checkbox"
                        checked={formData.transit_delay || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="transit_delay" className="font-medium text-gray-900">
                        Transit Delay Coverage
                      </label>
                      <p className="text-gray-500">
                        Covers additional expenses due to unexpected transit delays
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information Section */}
          <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">Additional Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="special_handling">Special Handling Requirements</Label>
                <Textarea
                  id="special_handling"
                  name="special_handling"
                  value={formData.special_handling || ''}
                  onChange={handleChange}
                  placeholder="Any special handling, packaging, or temperature requirements..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea
                  id="additional_notes"
                  name="additional_notes"
                  value={formData.additional_notes || ''}
                  onChange={handleChange}
                  placeholder="Any other information we should know about your shipment..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms_agreed"
                    name="terms_agreed"
                    type="checkbox"
                    required
                    checked={formData.terms_agreed || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms_agreed" className="font-medium text-gray-900">
                    I agree to the terms and conditions <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500">
                    By checking this box, you acknowledge that providing false information may affect your coverage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 mt-8">
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200 py-6 text-base font-medium shadow-md shiny-button"
            disabled={isSubmitting || Boolean(productDetails?.minValue && calculateTotalValue() < productDetails.minValue)}
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
      </form>
    </div>
  );
}
