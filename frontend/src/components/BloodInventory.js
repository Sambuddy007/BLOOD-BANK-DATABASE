import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Thermometer,
  MapPin,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { format, addDays, isAfter, parseISO } from 'date-fns';

const BloodInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    donor_id: '',
    blood_type: '',
    rh_factor: '',
    units_available: '',
    collection_date: '',
    expiry_date: '',
    storage_location: '',
    storage_temperature: '',
    notes: ''
  });

  const bloodTypes = ['A', 'B', 'AB', 'O'];
  const rhFactors = ['+', '-'];
  const statuses = ['available', 'reserved', 'expired', 'quarantined', 'transfused'];

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [searchTerm, bloodTypeFilter, statusFilter, inventory]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.storage_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${item.blood_type}${item.rh_factor}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (bloodTypeFilter) {
      filtered = filtered.filter(item => item.blood_type === bloodTypeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          donor_id: '',
          blood_type: '',
          rh_factor: '',
          units_available: '',
          collection_date: '',
          expiry_date: '',
          storage_location: '',
          storage_temperature: '',
          notes: ''
        });
        fetchInventory();
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  const handleEditInventory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${selectedItem.inventory_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({
          donor_id: '',
          blood_type: '',
          rh_factor: '',
          units_available: '',
          collection_date: '',
          expiry_date: '',
          storage_location: '',
          storage_temperature: '',
          notes: ''
        });
        fetchInventory();
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      donor_id: item.donor_id || '',
      blood_type: item.blood_type || '',
      rh_factor: item.rh_factor || '',
      units_available: item.units_available || '',
      collection_date: item.collection_date || '',
      expiry_date: item.expiry_date || '',
      storage_location: item.storage_location || '',
      storage_temperature: item.storage_temperature || '',
      notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'unknown';
    
    const today = new Date();
    const expiry = parseISO(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'critical';
    if (daysUntilExpiry <= 30) return 'warning';
    return 'safe';
  };

  const getExpiryColor = (status) => {
    switch (status) {
      case 'expired': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-orange-600 bg-orange-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'safe': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'quarantined': return 'bg-yellow-100 text-yellow-800';
      case 'transfused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.units_available, 0);
  const criticalExpiry = inventory.filter(item => getExpiryStatus(item.expiry_date) === 'critical').length;
  const lowStock = inventory.filter(item => item.units_available < 10).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Inventory Management</h1>
          <p className="text-gray-600">Track and manage blood units, expiry dates, and storage locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add Blood Unit
        </button>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500">
              <Droplets className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Expiry</p>
              <p className="text-2xl font-bold text-orange-600">{criticalExpiry}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, notes, or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setBloodTypeFilter('');
                setStatusFilter('');
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry_date);
                return (
                  <tr key={item.inventory_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {item.blood_type}{item.rh_factor}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.units_available}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.collection_date ? format(parseISO(item.collection_date), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={getExpiryColor(expiryStatus)}>
                          {item.expiry_date ? format(parseISO(item.expiry_date), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{item.storage_location || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredInventory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No inventory items found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Inventory Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Blood Unit to Inventory"
      >
        <form onSubmit={handleAddInventory} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <select
                required
                value={formData.blood_type}
                onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
                className="input-field"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rh Factor</label>
              <select
                required
                value={formData.rh_factor}
                onChange={(e) => setFormData({...formData, rh_factor: e.target.value})}
                className="input-field"
              >
                <option value="">Select Rh Factor</option>
                {rhFactors.map(factor => (
                  <option key={factor} value={factor}>{factor}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units Available</label>
              <input
                type="number"
                required
                min="1"
                value={formData.units_available}
                onChange={(e) => setFormData({...formData, units_available: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
              <input
                type="date"
                required
                value={formData.collection_date}
                onChange={(e) => setFormData({...formData, collection_date: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.storage_temperature}
                onChange={(e) => setFormData({...formData, storage_temperature: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
            <input
              type="text"
              required
              value={formData.storage_location}
              onChange={(e) => setFormData({...formData, storage_location: e.target.value})}
              className="input-field"
              placeholder="e.g., Refrigerator A-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="input-field"
              rows="3"
              placeholder="Additional notes about this blood unit..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Blood Unit
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Inventory Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Blood Unit"
      >
        <form onSubmit={handleEditInventory} className="space-y-4">
          {/* Same form fields as Add Modal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <select
                required
                value={formData.blood_type}
                onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
                className="input-field"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rh Factor</label>
              <select
                required
                value={formData.rh_factor}
                onChange={(e) => setFormData({...formData, rh_factor: e.target.value})}
                className="input-field"
              >
                <option value="">Select Rh Factor</option>
                {rhFactors.map(factor => (
                  <option key={factor} value={factor}>{factor}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units Available</label>
              <input
                type="number"
                required
                min="1"
                value={formData.units_available}
                onChange={(e) => setFormData({...formData, units_available: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
              <input
                type="date"
                required
                value={formData.collection_date}
                onChange={(e) => setFormData({...formData, collection_date: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.storage_temperature}
                onChange={(e) => setFormData({...formData, storage_temperature: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
            <input
              type="text"
              required
              value={formData.storage_location}
              onChange={(e) => setFormData({...formData, storage_location: e.target.value})}
              className="input-field"
              placeholder="e.g., Refrigerator A-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="input-field"
              rows="3"
              placeholder="Additional notes about this blood unit..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Blood Unit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BloodInventory;
