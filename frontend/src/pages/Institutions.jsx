import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Plus, Search, Building2, Edit2, Trash2 } from 'lucide-react';

const EMPTY_FORM = {
  institution_name: '',
  institution_type: 'SCHOOL',
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
};

export default function Institutions() {
  // --- State ---
  const [institutions, setInstitutions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // --- Fetch institutions ---
  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/institutions', {
        params: { page, limit: 10, search },
      });
      const body = res.data.data || res.data;
      const items = body.items || body.institutions || body || [];
      setInstitutions(Array.isArray(items) ? items : []);
      setTotalPages(body.totalPages ?? body.total_pages ?? (items.length < 10 ? page : page + 1));
    } catch (err) {
      console.error('Failed to fetch institutions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // --- Modal helpers ---
  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (inst) => {
    setEditingId(inst.id);
    setForm({
      institution_name: inst.institution_name || '',
      institution_type: inst.institution_type || 'SCHOOL',
      contact_person: inst.contact_person || '',
      phone: inst.phone || '',
      email: inst.email || '',
      address: inst.address || '',
      city: inst.city || '',
      state: inst.state || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  // --- Save (create / update) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await api.put(`/institutions/${editingId}`, form);
      } else {
        await api.post('/institutions', form);
      }
      closeModal();
      fetchInstitutions();
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Failed to save institution'
      );
    } finally {
      setSaving(false);
    }
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this institution? This will delete all linked contracts.')) {
      return;
    }
    try {
      await api.delete(`/institutions/${id}`);
      fetchInstitutions();
    } catch (err) {
      console.error('Failed to delete institution:', err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // --- Form change handler ---
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutions</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Manage school and college partnerships, contact profiles, and billing locations.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          variant="primary"
          className="self-start sm:self-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Institution
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-4 bg-[#121827]/40 border border-white/5 shadow-2xl">
        <div className="max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <Input
            type="text"
            placeholder="Search institutions by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table Records */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#121827]/40 border border-white/5 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7CFF]" />
            <p className="text-xs text-[#94A3B8] font-semibold">Loading institutions...</p>
          </div>
        ) : institutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#121827]/40 border border-white/5 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#0D1220] border border-white/5 flex items-center justify-center text-[#8B7CFF] text-2xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-sm font-bold text-white">No institutions registered</h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-normal">
                Establish a new transport contract target by adding a school or college first.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Table headers={['Name', 'Type', 'Contact Person', 'Phone', 'City', 'Status', 'Actions']}>
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-white">
                    {inst.institution_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={inst.institution_type === 'COLLEGE' ? 'info' : 'warning'}>
                      {inst.institution_type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-[#94A3B8]">
                    {inst.contact_person || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-medium">
                    {inst.phone || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]/80 font-medium">
                    {inst.city || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={inst.status === 'ACTIVE' || !inst.status ? 'success' : 'neutral'}>
                      {inst.status || 'ACTIVE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold space-x-4">
                    <button
                      onClick={() => openEditModal(inst)}
                      className="text-[#8B7CFF] hover:text-[#A78BFA] transition-colors cursor-pointer flex-inline items-center gap-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inst.id)}
                      className="text-red-400 hover:text-red-300 transition-colors cursor-pointer flex-inline items-center gap-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-[#121827]/40 border border-white/5 rounded-3xl backdrop-blur-md">
                <p className="text-xs text-[#94A3B8] font-bold">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="secondary"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    variant="secondary"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Edit Institution' : 'Add Institution'}>
        {formError && (
          <div className="mb-4 p-4 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Institution Name"
            name="institution_name"
            id="institution_name"
            required
            placeholder="e.g. St. Xavier's Academy"
            value={form.institution_name}
            onChange={handleChange}
          />

          <Select
            label="Institution Type"
            name="institution_type"
            id="institution_type"
            required
            value={form.institution_type}
            onChange={handleChange}
            options={[
              { value: 'SCHOOL', label: 'School' },
              { value: 'COLLEGE', label: 'College' },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              name="contact_person"
              id="contact_person"
              placeholder="Full name"
              value={form.contact_person}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              id="phone"
              placeholder="e.g. +91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            id="email"
            type="email"
            placeholder="e.g. contact@school.edu"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Physical Address"
            name="address"
            id="address"
            placeholder="Street Address, Campus..."
            value={form.address}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              id="city"
              placeholder="City name"
              value={form.city}
              onChange={handleChange}
            />
            <Input
              label="State"
              name="state"
              id="state"
              placeholder="State name"
              value={form.state}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
