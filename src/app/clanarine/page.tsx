'use client';

import { useState, useEffect } from 'react';
import { Clan, ClanStatus } from '@/types';
import ProtectedPage from '@/app/components/auth/ProtectedPage';
import { useAuth } from '@/contexts/AuthContext';

interface MemberListProps {
  members: Clan[];
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  membersPerPage: number;
  onRowClick: (member: Clan) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function MemberTable({ members, onRowClick }: { members: Clan[]; onRowClick: (member: Clan) => void }) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nema članova za prikaz.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Član #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Ime i Prezime
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Telefon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Datum Rođenja
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Napomene
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((member) => (
            <tr 
              key={member['Ime i Prezime']} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(member)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {member['Clanski Broj']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {member['Ime i Prezime']}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member.telefon || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  member.status === 'Aktivan' 
                    ? 'bg-green-100 text-green-800'
                    : member.status === 'Pasivan'
                    ? 'bg-yellow-100 text-yellow-800'
                    : member.status === 'Probni'
                    ? 'bg-blue-100 text-blue-800'
                    : member.status === 'Istekao'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {member['Datum Rodjenja'] 
                  ? new Date(member['Datum Rodjenja']).toLocaleDateString('sr-RS')
                  : '-'
                }
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {member.Napomene || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SearchBar({ searchTerm, onSearchChange }: { searchTerm: string; onSearchChange: (value: string) => void }) {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
        Pretraga članova po imenu
      </label>
      <input
        type="text"
        id="search"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Unesite ime ili prezime..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

function StatusFilter({ 
  selectedStatus, 
  onStatusChange 
}: { 
  selectedStatus: string; 
  onStatusChange: (status: string) => void;
}) {
  const statusOptions = [
    { value: 'all', label: 'Svi članovi', color: 'bg-gray-100 text-gray-800' },
    { value: ClanStatus.AKTIVAN, label: 'Aktivni', color: 'bg-green-100 text-green-800' },
    { value: ClanStatus.PASIVAN, label: 'Pasivni', color: 'bg-yellow-100 text-yellow-800' },
    { value: ClanStatus.PROBNI, label: 'Probni', color: 'bg-blue-100 text-blue-800' },
    { value: ClanStatus.ISTEKAO, label: 'Istekao', color: 'bg-red-100 text-red-800' },
    { value: ClanStatus.ISKLJUCEN, label: 'Isključen', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Filter po statusu članstva
      </label>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              selectedStatus === option.value
                ? `${option.color} border-current`
                : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center items-center space-x-4 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Prethodna
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Sledeća
      </button>
    </div>
  );
}

function MemberList({ members, searchTerm, statusFilter, currentPage, membersPerPage, onRowClick }: MemberListProps) {
  const filteredMembers = members.filter(member => {
    const matchesSearch = member['Ime i Prezime'].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {searchTerm ? 'Nema članova koji odgovaraju pretrazi.' : 'Nema članova za prikaz.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Prikazuje se {currentMembers.length} od {filteredMembers.length} članova
      </div>
      <MemberTable members={currentMembers} onRowClick={onRowClick} />
    </div>
  );
}

function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isLoading = false 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto !pt-12">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={onClose}
      >
        <div className="fixed inset-0 z-40 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div 
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onConfirm}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Obrađuje...' : 'Potvrdi'}
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
            >
              Otkaži
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberModal({ 
  isOpen, 
  onClose, 
  member, 
  onSave, 
  onPayMembership 
}: {
  isOpen: boolean;
  onClose: () => void;
  member: Clan | null;
  onSave: (memberData: Partial<Clan>) => Promise<void>;
  onPayMembership: (clanskiBroj: string) => void;
}) {
  const [formData, setFormData] = useState<Partial<Clan>>({
    'Ime i Prezime': '',
    email: '',
    telefon: '',
    status: ClanStatus.PROBNI,
    'Datum Rodjenja': undefined,
    Napomene: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!member;
  const isProtectedMember = member?.['Clanski Broj']?.startsWith('P/');
  const canPayMembership = isEditMode && !isProtectedMember;

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setFormData({
          'Clanski Broj': member['Clanski Broj'],
          'Ime i Prezime': member['Ime i Prezime'],
          email: member.email || '',
          telefon: member.telefon || '',
          status: member.status,
          'Datum Rodjenja': member['Datum Rodjenja'],
          Napomene: member.Napomene || ''
        });
      } else {
        setFormData({
          'Ime i Prezime': '',
          email: '',
          telefon: '',
          status: ClanStatus.PROBNI,
          'Datum Rodjenja': undefined,
          Napomene: ''
        });
      }
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProtectedMember && !isLoading) {
      setIsLoading(true);
      try {
        await onSave(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePayMembership = () => {
    if (member?.['Clanski Broj']) {
      onPayMembership(member['Clanski Broj']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto !pt-12">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={onClose}
      >
        <div className="fixed inset-0 z-40 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div 
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 relative z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEditMode ? 'Uredi člana' : 'Novi član'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ime i Prezime *
                </label>
                <input
                  type="text"
                  required
                  disabled={isProtectedMember || isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                  value={formData['Ime i Prezime'] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, 'Ime i Prezime': e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled={isProtectedMember || isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  disabled={isProtectedMember || isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                  value={formData.telefon || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefon: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  disabled={isProtectedMember || isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                  value={formData.status || ClanStatus.PROBNI}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ClanStatus }))}
                >
                  <option value={ClanStatus.PROBNI}>Probni</option>
                  <option value={ClanStatus.AKTIVAN}>Aktivan</option>
                  <option value={ClanStatus.PASIVAN}>Pasivan</option>
                  <option value={ClanStatus.ISTEKAO}>Istekao</option>
                  <option value={ClanStatus.ISKLJUCEN}>Isključen</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum Rođenja
                </label>
                <input
                  type="date"
                  disabled={isProtectedMember || isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                  value={formData['Datum Rodjenja'] ? new Date(formData['Datum Rodjenja']).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    'Datum Rodjenja': e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Napomene
              </label>
              <textarea
                disabled={isProtectedMember || isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                value={formData.Napomene || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, Napomene: e.target.value }))}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {canPayMembership && (
                <button
                  type="button"
                  onClick={handlePayMembership}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Uplati Članarinu
                </button>
              )}
              
              <div className="flex gap-3 ml-auto">
                {!isProtectedMember && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isLoading ? 'Čuva...' : (isEditMode ? 'Ažuriraj' : 'Kreiraj')}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Otkaži
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClanarinePage() {
  const { isAuthenticated } = useAuth();
  const [members, setMembers] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Clan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isLoading: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isLoading: false
  });
  const membersPerPage = 20;

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch('/api/clanovi');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        if (data.success) {
          setMembers(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch members');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      setLoading(true);
      fetchMembers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleAddNewMember = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: Clan) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (memberData: Partial<Clan>): Promise<void> => {
    try {
      const isEdit = !!selectedMember;
      const url = isEdit 
        ? `/api/clanovi/${selectedMember?.['Clanski Broj']}` 
        : '/api/clanovi';
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error('Failed to save member');
      }

      // Close modal only on successful response (200-299)
      setIsModalOpen(false);
      setSelectedMember(null);

      // Refresh members list
      const membersResponse = await fetch('/api/clanovi');
      const membersData = await membersResponse.json();
      if (membersData.success) {
        setMembers(membersData.data);
      }
    } catch (err) {
      // Modal stays open on error
      alert('Greška pri čuvanju člana: ' + (err instanceof Error ? err.message : 'Nepoznata greška'));
    }
  };

  const handlePayMembership = (clanskiBroj: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Potvrda uplate članarine',
      message: `Da li ste sigurni da želite da uplatite članarinu za člana ${clanskiBroj}? Ova akcija će ažurirati status člana na "Aktivan" i kreirati novi zapis o uplati.`,
      onConfirm: () => confirmPayMembership(clanskiBroj),
      isLoading: false
    });
  };

  const confirmPayMembership = async (clanskiBroj: string) => {
    // Set loading state
    setConfirmDialog(prev => ({ ...prev, isLoading: true }));
    
    try {
      const member = members.find(m => m['Clanski Broj'] === clanskiBroj);
      if (!member) return;

      // Update member status to Aktivan if they are Probni or Pasivan
      if (member.status === ClanStatus.PROBNI || member.status === ClanStatus.PASIVAN) {
        const updateResponse = await fetch(`/api/clanovi/${clanskiBroj}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...member,
            status: ClanStatus.AKTIVAN
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update member status');
        }
      }

      // Create new clanarina record
      const clanarinResponse = await fetch('/api/clanarine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'Clanski Broj': clanskiBroj,
          'Datum Uplate': new Date().toISOString()
        }),
      });

      if (!clanarinResponse.ok) {
        throw new Error('Failed to create membership payment record');
      }

      // Close both modals only on successful payment (200-299)
      setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {}, isLoading: false });
      setIsModalOpen(false);
      setSelectedMember(null);

      // Refresh members list
      const membersResponse = await fetch('/api/clanovi');
      const membersData = await membersResponse.json();
      if (membersData.success) {
        setMembers(membersData.data);
      }
    } catch (err) {
      // Reset loading state on error, keep dialog open
      setConfirmDialog(prev => ({ ...prev, isLoading: false }));
      alert('Greška pri uplati članarine: ' + (err instanceof Error ? err.message : 'Nepoznata greška'));
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member['Ime i Prezime'].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Učitavanje članova...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Greška: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Članarine</h1>
                <p className="text-gray-600">Pregled članova organizacije</p>
              </div>
              <button
                onClick={handleAddNewMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Dodaj Novog Člana
              </button>
            </div>
          </div>

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          
          <StatusFilter 
            selectedStatus={statusFilter} 
            onStatusChange={setStatusFilter} 
          />

          <MemberList 
            members={members}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            currentPage={currentPage}
            membersPerPage={membersPerPage}
            onRowClick={handleEditMember}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        <MemberModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          onSave={handleSaveMember}
          onPayMembership={handlePayMembership}
        />

        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {}, isLoading: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          isLoading={confirmDialog.isLoading}
        />
      </div>
    </ProtectedPage>
  );
}