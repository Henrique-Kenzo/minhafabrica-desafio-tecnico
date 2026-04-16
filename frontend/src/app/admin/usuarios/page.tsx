'use client';

import * as React from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Edit2, Plus, Trash2, Search, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [profileFilter, setProfileFilter] = React.useState('');

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const qs = new URLSearchParams();
      if (searchTerm) qs.append('search', searchTerm);
      if (profileFilter) qs.append('profile', profileFilter);
      qs.append('page', currentPage.toString());
      qs.append('limit', '15');
      
      const res = await api.get(`/users?${qs.toString()}`);
      setUsers(res.data.data);
      const calculatedPages = Math.ceil((res.data.total || 0) / 15);
      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
      setTotalItems(res.data.total || 0);
    } catch {
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, profileFilter]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, profileFilter, currentPage]);

  const getVisiblePages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) end = Math.min(totalPages, 5);
    if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Usuário excluído!');
      fetchUsers();
    } catch {
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (editingUser) {
        if (!data.password) delete data.password;
        await api.put(`/users/${editingUser._id}`, data);
        toast.success('Usuário atualizado!');
      } else {
        await api.post('/users', data);
        toast.success('Usuário criado!');
      }
      handleCloseModal();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-slate-500 mt-1">Gerencie os usuários do sistema.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-full sm:w-56" ref={profileRef}>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-between h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-700"
          >
            <span className="truncate">
              {profileFilter === '' ? "Todos os perfis" : profileFilter === 'admin' ? "Admin" : "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>
          
          {isProfileOpen && (
            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden py-1">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${profileFilter === '' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={() => { setProfileFilter(''); setIsProfileOpen(false); }}
              >
                Todos os perfis
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${profileFilter === 'admin' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={() => { setProfileFilter('admin'); setIsProfileOpen(false); }}
              >
                Admin
              </div>
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${profileFilter === 'user' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={() => { setProfileFilter('user'); setIsProfileOpen(false); }}
              >
                User
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                  <TableCell className="text-slate-500">{user.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">
                      {user.profile}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(user)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl mt-auto">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading}>Anterior</Button>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading}>Próxima</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Mostrando <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * 15 + 1}</span> a <span className="font-medium">{Math.min(currentPage * 15, totalItems)}</span> de <span className="font-medium">{totalItems}</span> usuários
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-1" aria-label="Pagination">
                <Button variant="outline" className="w-10 h-10 p-0" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getVisiblePages().map(p => (
                  <Button 
                    key={p} 
                    variant={currentPage === p ? 'default' : 'outline'} 
                    className={`w-10 h-10 p-0 ${currentPage === p ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                    onClick={() => setCurrentPage(p)}
                    disabled={isLoading}
                  >
                    {p}
                  </Button>
                ))}

                <Button variant="outline" className="w-10 h-10 p-0" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <Input name="name" required defaultValue={editingUser?.name} placeholder="Nome completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <Input name="email" type="email" required defaultValue={editingUser?.email} placeholder="email@exemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Senha {editingUser && <span className="text-slate-400 font-normal">(deixe em branco para manter a atual)</span>}
            </label>
            <Input name="password" type="password" required={!editingUser} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Perfil</label>
            <select
              name="profile"
              defaultValue={editingUser?.profile || 'user'}
              className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
