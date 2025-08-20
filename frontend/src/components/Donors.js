import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  X
} from 'lucide-react';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [formData, setFormData] = useState({
    don_Name: '',
    sex: '',
    age: '',
    don_b_grp: '',
    rs_id: '',
    dis_id: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [searchTerm, bloodTypeFilter, donors]);

  const fetchDonors = async () => {
    try {
      const response = await fetch('http://localhost:5000/donors');
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.don_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.don_Id?.toString().includes(searchTerm)
      );
    }

    if (bloodTypeFilter) {
      filtered = filtered.filter(donor => donor.don_b_grp === bloodTypeFilter);
    }

    setFilteredDonors(filtered);
  };

  const handleAddDonor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({ don_Name: '', sex: '', age: '', don_b_grp: '', rs_id: '', dis_id: '' });
        fetchDonors();
      }
    } catch (error) {
      console.error('Error adding donor:', error);
    }
  };

  const handleEditDonor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/donors/${selectedDonor.don_Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedDonor(null);
        setFormData({ don_Name: '', sex: '', age: '', don_b_grp: '', rs_id: '', dis_id: '' });
        fetchDonors();
      }
    } catch (error) {
      console.error('Error updating donor:', error);
    }
  };

  const openEditModal = (donor) => {
    setSelectedDonor(donor);
    setFormData({
      don_Name: donor.don_Name || '',
      sex: donor.sex || '',
      age: donor.age || '',
      don_b_grp: donor.don_b_grp || '',
      rs_id: donor.rs_id || '',
      dis_id: donor.dis_id || ''
    });
    setShowEditModal(true);
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donors Management</h1>
          <p className="text-gray-600">Manage blood donors and their information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add New Donor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search donors by name or ID..."
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
            <button
              onClick={() => {
                setSearchTerm('');
                setBloodTypeFilter('');
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonors.map((donor) => (
                <tr key={donor.don_Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{donor.don_Id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donor.don_Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donor.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      donor.sex === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                      {donor.sex === 'M' ? 'Male' : 'Female'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {donor.don_b_grp}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(donor)}
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
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDonors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No donors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Donor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Donor"
      >
        <form onSubmit={handleAddDonor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.don_Name}
              onChange={(e) => setFormData({...formData, don_Name: e.target.value})}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select
                required
                value={formData.sex}
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select
              required
              value={formData.don_b_grp}
              onChange={(e) => setFormData({...formData, don_b_grp: e.target.value})}
              className="input-field"
            >
              <option value="">Select Blood Group</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
              Add Donor
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Donor Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Donor"
      >
        <form onSubmit={handleEditDonor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.don_Name}
              onChange={(e) => setFormData({...formData, don_Name: e.target.value})}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select
                required
                value={formData.sex}
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select
              required
              value={formData.don_b_grp}
              onChange={(e) => setFormData({...formData, don_b_grp: e.target.value})}
              className="input-field"
            >
              <option value="">Select Blood Group</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
              Update Donor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Donors;
