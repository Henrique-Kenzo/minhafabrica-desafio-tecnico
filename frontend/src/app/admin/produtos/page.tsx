'use client';

import * as React from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Edit2, Plus, Trash2, Search, Filter, Image as ImageIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);


  const [modalPrice, setModalPrice] = React.useState('');
  const [modalCategory, setModalCategory] = React.useState('');
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [availableCategories, setAvailableCategories] = React.useState<string[]>([]);
  
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const categoryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Resetar a paginação ao digitar novos filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, currentPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const qs = new URLSearchParams();
      if (searchTerm) qs.append('search', searchTerm);
      if (categoryFilter) qs.append('category', categoryFilter);
      qs.append('page', currentPage.toString());
      qs.append('limit', '15');
      
      const res = await api.get(`/products?${qs.toString()}`);
      setProducts(res.data.data);
      const calculatedPages = Math.ceil((res.data.total || 0) / 15);
      setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
      setTotalItems(res.data.total || 0);
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
    if (product?.price) {
      setModalPrice(product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      setModalPrice('');
    }
    setModalCategory(product?.category || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setIsCategoryPickerOpen(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value === '') {
      setModalPrice('');
      return;
    }
    
    value = Number(value).toString();
    value = value.padStart(3, '0');
    
    let decimals = value.slice(-2);
    let integers = value.slice(0, -2);
    
    integers = integers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    setModalPrice(integers + ',' + decimals);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setIsLoading(true);

    let uploadedImageUrl = editingProduct?.imageUrl || '';

    try {
      // Se o usuario selecionou um novo arquivo, faz upload -> backend converte pra base64 e retorna
      if (imageFile) {
        const fileData = new FormData();
        fileData.append('image', imageFile);
        const uploadRes = await api.post('/products/upload', fileData, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        ...data,
        price: Number(modalPrice.replace(/\./g, '').replace(',', '.')),
        category: modalCategory,
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
        <div className="relative w-full sm:w-56" ref={categoryRef}>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center justify-between h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-700"
          >
            <span className="truncate">{categoryFilter || "Todas as categorias"}</span>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>
          
          {isCategoryOpen && (
            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
              <div 
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${categoryFilter === '' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={() => { setCategoryFilter(''); setIsCategoryOpen(false); }}
              >
                Todas as categorias
              </div>
              {availableCategories.map(cat => (
                <div 
                  key={cat}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${categoryFilter === cat ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => { setCategoryFilter(cat); setIsCategoryOpen(false); }}
                >
                  <span className="truncate">{cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[700px]">
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
                <TableCell colSpan={5} className="h-[400px] text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mb-4"></div>
                    Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[400px] text-center text-slate-500">
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
                          src={product.imageUrl} 
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
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl mt-auto">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading}>Anterior</Button>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading}>Próxima</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Mostrando <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * 15 + 1}</span> a <span className="font-medium">{Math.min(currentPage * 15, totalItems)}</span> de <span className="font-medium">{totalItems}</span> produtos totais
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
              onChange={handleTextareaInput}
              className="flex min-h-[40px] max-h-[150px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 resize-none overflow-y-auto"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
              <Input value={modalPrice} onChange={handlePriceChange} required placeholder="Ex: 1.682,82" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estoque</label>
              <Input name="stock" type="number" min="0" required defaultValue={editingProduct?.stock} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <div className="relative">
              <Input 
                value={modalCategory} 
                onChange={(e) => {
                  setModalCategory(e.target.value);
                  setIsCategoryPickerOpen(true);
                }}
                onFocus={() => setIsCategoryPickerOpen(true)}
                onBlur={() => setTimeout(() => setIsCategoryPickerOpen(false), 150)}
                required 
                placeholder="Ex: Eletrônicos, Roupas" 
              />
              {isCategoryPickerOpen && availableCategories.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg py-1 max-h-40 overflow-y-auto">
                  {availableCategories.map(cat => (
                    <div 
                      key={cat}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 text-slate-700"
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        setModalCategory(cat); 
                        setIsCategoryPickerOpen(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
