'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Route as RouteIcon, Plus } from 'lucide-react';

const NewRouteModal = ({ onClose, onCreateRoute }) => {
  const [formData, setFormData] = useState({
    name: '',
    start: '',
    end: '',
    distance: '',
    profit: '',
    risk: 'Medium',
    duration: '',
    resources: [''],
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error on change
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    
    setFormData({
      ...formData,
      resources: updatedResources
    });
  };
  
  const addResourceField = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, '']
    });
  };
  
  const removeResourceField = (index) => {
    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);
    
    setFormData({
      ...formData,
      resources: updatedResources
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Route name is required';
    if (!formData.start.trim()) newErrors.start = 'Starting location is required';
    if (!formData.end.trim()) newErrors.end = 'Destination is required';
    if (formData.start.trim() === formData.end.trim()) {
      newErrors.end = 'Start and end locations cannot be the same';
    }
    
    if (!formData.distance) newErrors.distance = 'Distance is required';
    else if (isNaN(formData.distance) || Number(formData.distance) <= 0) {
      newErrors.distance = 'Distance must be a positive number';
    }
    
    if (!formData.profit) newErrors.profit = 'Profit is required';
    else if (isNaN(formData.profit) || Number(formData.profit) <= 0) {
      newErrors.profit = 'Profit must be a positive number';
    }
    
    if (!formData.duration) newErrors.duration = 'Duration is required';
    else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    const validResources = formData.resources.filter(r => r.trim());
    if (validResources.length === 0) {
      newErrors.resources = 'At least one resource is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Filter out empty resources
      const filteredResources = formData.resources.filter(r => r.trim());
      
      onCreateRoute({
        ...formData,
        distance: Number(formData.distance),
        profit: Number(formData.profit),
        duration: Number(formData.duration),
        resources: filteredResources
      });
    }
  };
  
  // African city options
  const cityOptions = [
    'Accra', 'Cairo', 'Cape Town', 'Casablanca', 'Dakar', 
    'Dar es Salaam', 'Johannesburg', 'Khartoum', 'Lagos', 
    'Marrakech', 'Mombasa', 'Nairobi', 'Port Elizabeth', 
    'Timbuktu', 'Tripoli', 'Tunis', 'Zanzibar'
  ];
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-3xl mx-4 bg-gray-900/95 rounded-xl border border-yellow-500/20 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/95 to-gray-800/95">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
              <RouteIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Create New Trade Route</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800/70 text-gray-400 hover:text-white hover:bg-gray-700/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Route Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Gold Coast Route"
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-red-500/50 focus:ring-red-500/30' 
                    : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Start Location</label>
                <select
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.start 
                      ? 'border-red-500/50 focus:ring-red-500/30' 
                      : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                  }`}
                >
                  <option value="">Select city</option>
                  {cityOptions.map(city => (
                    <option key={`start-${city}`} value={city}>{city}</option>
                  ))}
                </select>
                {errors.start && <p className="mt-1 text-xs text-red-400">{errors.start}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">End Location</label>
                <select
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.end 
                      ? 'border-red-500/50 focus:ring-red-500/30' 
                      : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                  }`}
                >
                  <option value="">Select city</option>
                  {cityOptions.map(city => (
                    <option key={`end-${city}`} value={city}>{city}</option>
                  ))}
                </select>
                {errors.end && <p className="mt-1 text-xs text-red-400">{errors.end}</p>}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g. 450"
                min="1"
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.distance 
                    ? 'border-red-500/50 focus:ring-red-500/30' 
                    : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                }`}
              />
              {errors.distance && <p className="mt-1 text-xs text-red-400">{errors.distance}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Profit (FLOW)</label>
              <input
                type="number"
                name="profit"
                value={formData.profit}
                onChange={handleChange}
                placeholder="e.g. 2500"
                min="1"
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.profit 
                    ? 'border-red-500/50 focus:ring-red-500/30' 
                    : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                }`}
              />
              {errors.profit && <p className="mt-1 text-xs text-red-400">{errors.profit}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="1"
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.duration 
                    ? 'border-red-500/50 focus:ring-red-500/30' 
                    : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                }`}
              />
              {errors.duration && <p className="mt-1 text-xs text-red-400">{errors.duration}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">Risk Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Low', 'Medium', 'High'].map(risk => (
                <label 
                  key={risk} 
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.risk === risk 
                      ? risk === 'Low' 
                        ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                        : risk === 'Medium'
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                          : 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="risk"
                    value={risk}
                    checked={formData.risk === risk}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>{risk}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">Tradeable Resources</label>
              <button
                type="button"
                onClick={addResourceField}
                className="flex items-center text-xs text-yellow-400 hover:text-yellow-300"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Resource
              </button>
            </div>
            {formData.resources.map((resource, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  placeholder="e.g. Gold, Silk, Spices"
                  className={`flex-1 px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.resources && index === 0
                      ? 'border-red-500/50 focus:ring-red-500/30' 
                      : 'border-gray-700/50 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                  }`}
                />
                {formData.resources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResourceField(index)}
                    className="p-2 rounded-lg bg-gray-800/70 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.resources && <p className="mt-1 text-xs text-red-400">{errors.resources}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">Route Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the route, its significance, and any special considerations..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-300 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
            >
              Cancel
            </button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-semibold text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Route
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewRouteModal;