import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/services/api';
import { Product } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  availableCategories: string[];
  onSuccess: () => void;
}

export function ProductModal({ isOpen, onClose, editingProduct, availableCategories, onSuccess }: ProductModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [modalPrice, setModalPrice] = React.useState('');
  const [modalCategory, setModalCategory] = React.useState('');
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (editingProduct?.price) {
        setModalPrice((editingProduct.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } else {
        setModalPrice('');
      }
      setModalCategory(editingProduct?.category || '');
      setImageFile(null);
    }
  }, [isOpen, editingProduct]);

  const handleClose = () => {
    setImageFile(null);
    setIsCategoryPickerOpen(false);
    onClose();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
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
    setIsSubmitting(true);

    let uploadedImageUrl = editingProduct?.imageUrl || '';

    try {
      if (imageFile) {
        const sigRes = await api.get('/products/upload-signature');
        const { signature, timestamp, cloudName, apiKey, folder } = sigRes.data;

        const cloudinaryData = new FormData();
        cloudinaryData.append('file', imageFile);
        cloudinaryData.append('api_key', apiKey);
        cloudinaryData.append('timestamp', timestamp);
        cloudinaryData.append('signature', signature);
        cloudinaryData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: cloudinaryData,
        });

        if (!uploadRes.ok) throw new Error('Falha no upload da imagem na nuvem');

        const uploadJson = await uploadRes.json();
        uploadedImageUrl = uploadJson.secure_url;
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
      handleClose();
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao processar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editingProduct ? 'Editar Produto' : 'Novo Produto'}>
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
              className="pr-9"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </form>
    </Modal>
  );
}
