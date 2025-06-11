import React, { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import '../styles/components/adminProductos.scss';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const fetchProductos = async () => {
    try {      const res = await api.get('/productos');
      // Asegurar que los precios sean números
      const productosConPreciosNumericos = res.data.map(p => ({
        ...p,
        precio: typeof p.precio === 'string' ? parseFloat(p.precio) : p.precio
      }));
      setProductos(productosConPreciosNumericos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMensaje('Error al cargar los productos');
    }
  };

  useEffect(() => { 
    fetchProductos(); 
  }, []);

  const handleChange = e => {
    const value = e.target.name === 'precio' ? 
      parseFloat(e.target.value) || '' : 
      e.target.value;
    setNuevo({ ...nuevo, [e.target.name]: value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/productos', {
        nombre: nuevo.nombre,
        descripcion: nuevo.descripcion,
        precio: parseFloat(nuevo.precio),
        stock: parseInt(nuevo.stock),
        imagen: nuevo.imagen
      });
      setMensaje('Producto agregado exitosamente');
      setNuevo({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
      fetchProductos();
    } catch (error) {
      console.error('Error al agregar producto:', error);
      setMensaje('Error al agregar el producto');
    }
  };

  const handleEdit = producto => {
    setEditando(producto);
    setNuevo({
      ...producto,
      precio: typeof producto.precio === 'number' ? producto.precio : parseFloat(producto.precio)
    });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await api.put(`/productos/${editando.idProducto}`, {
        nombre: nuevo.nombre,
        descripcion: nuevo.descripcion,
        precio: parseFloat(nuevo.precio),
        stock: parseInt(nuevo.stock),
        imagen: nuevo.imagen
      });
      setMensaje('Producto actualizado exitosamente');
      setEditando(null);
      setNuevo({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
      fetchProductos();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setMensaje('Error al actualizar el producto');
    }
  };
  const handleDelete = async id => {
    try {
      await api.delete(`/productos/${id}`);
      setMensaje('Producto eliminado exitosamente');
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      setMensaje(`Error al eliminar el producto: ${error.response?.data?.error || error.message}`);
    }
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div className="admin-productos">
      <h2>Gestión de Productos</h2>
      {mensaje && <div className={mensaje.includes('Error') ? 'error-message' : 'success-message'}>{mensaje}</div>}
      <form onSubmit={editando ? handleUpdate : handleAdd} className="producto-form">
        <input
          name="nombre"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={handleChange}
          required
        />
        <input
          name="precio"
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          value={nuevo.stock}
          onChange={handleChange}
          required
        />
        <input
          name="imagen"
          placeholder="URL Imagen"
          value={nuevo.imagen}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit" className="primary-button">
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
          {editando && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setEditando(null);
                setNuevo({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.idProducto}>
                <td>{p.idProducto}</td>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${formatPrice(p.precio)}</td>
                <td>{p.stock}</td>
                <td>
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} width={40} height={40} style={{ objectFit: 'cover' }} />
                  ) : '-'}
                </td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(p)} className="edit-button">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.idProducto)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductos;
