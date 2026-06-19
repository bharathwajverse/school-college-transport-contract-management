import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Search, Map, Edit2, Trash2 } from 'lucide-react';

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [contractFilter, setContractFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    contract_id: '',
    route_name: '',
    pickup_points: '',
    drop_points: '',
    distance_km: '',
    route_status: 'ACTIVE'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [routesRes, contractsRes] = await Promise.all([
        api.get('/routes', { params: { contract_id: contractFilter || undefined } }),
        api.get('/contracts')
      ]);

      const routesData = routesRes.data.data || routesRes.data || [];
      setRoutes(Array.isArray(routesData) ? routesData : []);

      const contractsBody = contractsRes.data.data || contractsRes.data;
      const contractsData = contractsBody.items || contractsBody.contracts || contractsBody || [];
      setContracts(Array.isArray(contractsData) ? contractsData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load routes data.');
    } finally {
      setLoading(false);
    }
  }, [contractFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = () => {
    setEditingRoute(null);
    setFormData({
      contract_id: contracts[0]?.id || '',
      route_name: '',
      pickup_points: '',
      drop_points: '',
      distance_km: '',
      route_status: 'ACTIVE'
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setFormData({
      contract_id: route.contract_id || '',
      route_name: route.route_name || '',
      pickup_points: Array.isArray(route.pickup_points) ? route.pickup_points.join(', ') : '',
      drop_points: Array.isArray(route.drop_points) ? route.drop_points.join(', ') : '',
      distance_km: route.distance_km || '',
      route_status: route.route_status || 'ACTIVE'
    });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await api.delete(`/routes/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete route.');
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

    // Parse comma-separated points into arrays
    const pickup_points = formData.pickup_points
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const drop_points = formData.drop_points
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const payload = {
      ...formData,
      pickup_points,
      drop_points,
      distance_km: Number(formData.distance_km)
    };

    try {
      if (editingRoute) {
        await api.put(`/routes/${editingRoute.id}`, payload);
      } else {
        await api.post('/routes', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save route.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter routes locally by search query
  const filteredRoutes = routes.filter((r) =>
    r.route_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Route Management</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Define pickup points, drop coordinates, routing distance, and verify active status.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          variant="primary"
          className="self-start sm:self-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-4 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search by route name..."
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

      {/* Table Records */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
            <p className="text-xs text-[#94A3B8] font-semibold">Loading route logs...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#0D1220] border border-white/5 flex items-center justify-center text-[#8B7CFF] text-2xl">
              <Map className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-sm font-bold text-white">No routes established</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                Configure a navigation route, map stops, and link them to transport agreements.
              </p>
            </div>
          </div>
        ) : (
          <Table headers={['Route Name', 'Contract No', 'Pickup Points', 'Drop Points', 'Distance', 'Status', 'Actions']}>
            {filteredRoutes.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                  {r.route_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8] font-medium">
                  {r.contract_number || '—'}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[#94A3B8]/80 max-w-xs truncate">
                  {Array.isArray(r.pickup_points) ? r.pickup_points.join(', ') : '—'}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[#94A3B8]/80 max-w-xs truncate">
                  {Array.isArray(r.drop_points) ? r.drop_points.join(', ') : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                  {r.distance_km} km
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={r.route_status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {r.route_status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold space-x-4">
                  <button
                    onClick={() => openEditModal(r)}
                    className="text-[#8B7CFF] hover:text-[#A78BFA] transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
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

      {/* Add / Edit Route Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingRoute ? 'Edit Route' : 'Add Route'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Contract Link"
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

          <Input
            label="Route Name"
            name="route_name"
            id="route_name"
            required
            placeholder="e.g. Route A - Main Campus"
            value={formData.route_name}
            onChange={handleInputChange}
          />

          <Input
            label="Pickup Points (comma-separated)"
            name="pickup_points"
            id="pickup_points"
            required
            placeholder="e.g. Bus Stop 1, Main Road, Station"
            value={formData.pickup_points}
            onChange={handleInputChange}
          />

          <Input
            label="Drop Points (comma-separated)"
            name="drop_points"
            id="drop_points"
            required
            placeholder="e.g. Campus gate, Admin block, Hostel"
            value={formData.drop_points}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Distance (km)"
              type="number"
              step="0.01"
              name="distance_km"
              id="distance_km"
              required
              placeholder="e.g. 15.50"
              value={formData.distance_km}
              onChange={handleInputChange}
            />

            <Select
              label="Status"
              name="route_status"
              id="route_status"
              value={formData.route_status}
              onChange={handleInputChange}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' }
              ]}
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
