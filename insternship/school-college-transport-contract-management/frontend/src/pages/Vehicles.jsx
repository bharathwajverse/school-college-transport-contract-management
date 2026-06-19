import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Search, Bus, Edit2, Trash2 } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [contractFilter, setContractFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    contract_id: '',
    vehicle_number: '',
    vehicle_type: '',
    capacity: '',
    insurance_expiry: '',
    fitness_expiry: '',
    status: 'ACTIVE'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [vehiclesRes, contractsRes] = await Promise.all([
        api.get('/vehicles', { params: { contract_id: contractFilter || undefined } }),
        api.get('/contracts')
      ]);

      const vehiclesData = vehiclesRes.data.data || vehiclesRes.data || [];
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);

      const contractsBody = contractsRes.data.data || contractsRes.data;
      const contractsData = contractsBody.items || contractsBody.contracts || contractsBody || [];
      setContracts(Array.isArray(contractsData) ? contractsData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles data.');
    } finally {
      setLoading(false);
    }
  }, [contractFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      contract_id: contracts[0]?.id || '',
      vehicle_number: '',
      vehicle_type: '',
      capacity: '',
      insurance_expiry: '',
      fitness_expiry: '',
      status: 'ACTIVE'
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      contract_id: vehicle.contract_id || '',
      vehicle_number: vehicle.vehicle_number || '',
      vehicle_type: vehicle.vehicle_type || '',
      capacity: vehicle.capacity || '',
      insurance_expiry: vehicle.insurance_expiry ? vehicle.insurance_expiry.slice(0, 10) : '',
      fitness_expiry: vehicle.fitness_expiry ? vehicle.fitness_expiry.slice(0, 10) : '',
      status: vehicle.status || 'ACTIVE'
    });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete vehicle.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      fitness_expiry: formData.fitness_expiry || null
    };

    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter vehicles locally by vehicle number search
  const filteredVehicles = vehicles.filter((v) =>
    v.vehicle_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vehicle Fleet</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Monitor registration details, capacity allocation, insurance timelines, and system compliance status.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          variant="primary"
          className="self-start sm:self-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-4 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search by vehicle number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              id="contract_filter"
              value={contractFilter}
              onChange={(e) => setContractFilter(e.target.value)}
              options={[
                { value: '', label: 'All Contracts' },
                ...contracts.map((c) => ({
                  value: c.id,
                  label: `${c.contract_number} (${c.institution_name})`
                }))
              ]}
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-fade-in">
          {error}
        </div>
      )}

      {/* Fleet Listing Table */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
            <p className="text-xs text-[#94A3B8] font-semibold">Loading fleet status...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#0D1220] border border-white/5 flex items-center justify-center text-[#8B7CFF] text-2xl">
              <Bus className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-sm font-bold text-white">No vehicles registered</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                Begin registering your physical transport fleet details and assign them to contracts.
              </p>
            </div>
          </div>
        ) : (
          <Table headers={['Vehicle No', 'Type', 'Capacity', 'Insurance Expiry', 'Fitness Expiry', 'Contract No', 'Status', 'Actions']}>
            {filteredVehicles.map((v) => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                  {v.vehicle_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8] font-medium">
                  {v.vehicle_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                  {v.capacity} seats
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                  {formatDate(v.insurance_expiry)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-bold">
                  {formatDate(v.fitness_expiry)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#8B7CFF] font-bold">
                  {v.contract_number || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={v.status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {v.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold space-x-4">
                  <button
                    onClick={() => openEditModal(v)}
                    className="text-[#8B7CFF] hover:text-[#A78BFA] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>

      {/* Add / Edit Vehicle Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Linked Contract"
            name="contract_id"
            id="contract_id"
            required
            value={formData.contract_id}
            onChange={handleInputChange}
            options={contracts.map((c) => ({
              value: c.id,
              label: `${c.contract_number} (${c.institution_name})`
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vehicle Registration No"
              name="vehicle_number"
              id="vehicle_number"
              required
              placeholder="e.g. KA-01-AB-1234"
              value={formData.vehicle_number}
              onChange={handleInputChange}
            />

            <Input
              label="Vehicle Type / Description"
              name="vehicle_type"
              id="vehicle_type"
              required
              placeholder="e.g. 50-Seater Bus"
              value={formData.vehicle_type}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Passenger Capacity"
              type="number"
              name="capacity"
              id="capacity"
              required
              placeholder="e.g. 50"
              value={formData.capacity}
              onChange={handleInputChange}
            />

            <Select
              label="Status"
              name="status"
              id="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Insurance Expiry Date"
              type="date"
              name="insurance_expiry"
              id="insurance_expiry"
              required
              value={formData.insurance_expiry}
              onChange={handleInputChange}
            />

            <Input
              label="Fitness Certificate Expiry Date"
              type="date"
              name="fitness_expiry"
              id="fitness_expiry"
              value={formData.fitness_expiry}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
