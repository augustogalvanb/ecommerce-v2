import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { ArrowLeft, Upload, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
  isActive: z.boolean().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    // Crear URLs de preview para las imágenes seleccionadas
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const product = await productService.getById(id);
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', Number(product.price));
      setValue('stock', product.stock);
      setValue('categoryId', product.categoryId);
      setValue('isActive', product.isActive);
      setExistingImages(product.images);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl: string) => {
    if (!id) return;
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      await productService.deleteImage(id, imageUrl);
      setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar la imagen');
    }
  };

  const onSubmit = async (data: ProductForm) => {
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('categoryId', data.categoryId);
    
    // Solo enviar isActive si estamos editando
    if (isEditing) {
      formData.append('isActive', data.isActive ? 'true' : 'false');
    }

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    if (isEditing && id) {
      await productService.update(id, formData);
    } else {
      await productService.create(formData);
    }

    navigate('/admin/products');
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al guardar el producto');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Volver a productos</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Modifica la información del producto' : 'Completa la información del nuevo producto'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto *
            </label>
            <input
              {...register('name')}
              type="text"
              className="input"
              placeholder="Ej: iPhone 15 Pro"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              {...register('description')}
              className="input min-h-[120px] resize-none"
              placeholder="Describe las características del producto..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select {...register('categoryId')} className="input">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              {...register('isActive')}
              type="checkbox"
              id="isActive"
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Producto activo (visible en la tienda)
            </label>
          </div>

          {/* Existing Images */}
          {isEditing && existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Imágenes actuales
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageUrl)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isEditing ? 'Agregar nuevas imágenes' : 'Imágenes del producto *'}
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="text-gray-400 mb-2" size={40} />
                <span className="text-sm text-gray-600">
                  Haz clic para seleccionar imágenes
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG hasta 10MB
                </span>
              </label>
            </div>

            {/* Preview Selected Files */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar producto' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
};