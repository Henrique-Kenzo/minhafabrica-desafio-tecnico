'use client';

import * as React from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Edit2, Plus, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [availableCategories, setAvailableCategories] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const qs = new URLSearchParams();
      if (searchTerm) qs.append('search', searchTerm);
      if (categoryFilter) qs.append('category', categoryFilter);
      
      const res = await api.get(`/products?${qs.toString()}`);
      setProducts(res.data.data);
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setAvailableCategories(res.data);
    } catch (e) {
      console.warn('Falha no autocomplete de categorias', e);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produto excluído!');
      fetchProducts();
    } catch {
      toast.error('Erro ao excluir produto');
    }
  };

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setIsLoading(true);

    let uploadedImageUrl = editingProduct?.imageUrl || '';

    try {
      if (imageFile) {
        const fileData = new FormData();
        fileData.append('image', imageFile);
        const uploadRes = await api.post('/products/upload', fileData, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: uploadedImageUrl || undefined,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Produto atualizado!');
      } else {
        await api.post('/products', payload);
        toast.success('Produto criado!');
      }
      handleCloseModal();
      fetchProducts();
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao processar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-slate-500 mt-1">Gerencie os produtos cadastrados.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nome do produto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Filtrar por categoria..." 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9"
            list="category-suggestions"
          />
        </div>
      </div>

      <datalist id="category-suggestions">
        {availableCategories.map(cat => (
          <option key={cat} value={cat} />
        ))}
      </datalist>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${product.imageUrl}`} 
                          alt={product.name} 
                          className="h-10 w-10 min-w-10 rounded-md object-cover border border-slate-200" 
                        />
                      ) : (
                        <div className="h-10 w-10 min-w-10 flex items-center justify-center rounded-md bg-slate-100 text-slate-400 border border-slate-200">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        {product.name}
                        <p className="text-xs text-slate-400 font-normal truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-700/10">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {product.stock} un.
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Editar Produto' : 'Novo Produto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50">
             <div className="flex-1">
               <label className="block text-sm font-medium text-slate-700 mb-1">Imagem do Produto (Opcional)</label>
               <Input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                 className="text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
               />
               {editingProduct?.imageUrl && !imageFile && (
                 <p className="text-xs text-slate-500 mt-2">Imagem atual já enviada.</p>
               )}
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <Input name="name" required defaultValue={editingProduct?.name} placeholder="Nome do produto" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              name="description"
              required
              defaultValue={editingProduct?.description}
              placeholder="Descreva o produto"
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço</label>
              <Input name="price" type="number" step="0.01" min="0" required defaultValue={editingProduct?.price} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
              <Input name="stock" type="number" min="0" required defaultValue={editingProduct?.stock} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <Input 
              name="category" 
              required 
              defaultValue={editingProduct?.category} 
              placeholder="Ex: Eletrônicos, Roupas" 
              list="category-suggestions"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isLoading}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
