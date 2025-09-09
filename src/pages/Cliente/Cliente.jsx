import React, { useState } from 'react';
import './Cliente.css';

export const Cliente = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([
    {
      id: 1,
      email: 'cliente1@example.com',
      nombre: 'Cliente Uno',
      telefono: '123456789',
      empresa: 'Empresa Uno',
      fechaRegistro: '2025-09-01',
      viajesRealizados: 5,
      totalFacturado: 2500,
      viajesPendientes: 1,
    },
  ]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClientes = clientes.filter((cliente) =>
    Object.values(cliente).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAdd = () => {
    setModalData({});
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    setModalData(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setClientes(clientes.filter((cliente) => cliente.id !== id));
  };

  const handleViewDetails = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    setModalData(cliente);
    setIsDetailModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    if (data.id) {
      // Editar cliente existente
      setClientes(clientes.map((cliente) => (cliente.id === data.id ? data : cliente)));
    } else {
      // Agregar nuevo cliente
      setClientes([...clientes, { ...data, id: Date.now(), fechaRegistro: new Date().toISOString().split('T')[0] }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="cliente-container">
      <div className="cliente-header">
        <h1>Clientes</h1>
        <button className="btn-crear" onClick={handleAdd}>Crear Nuevo Cliente</button>
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
        className="cliente-buscador"
      />
      <table className="cliente-tabla">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.email}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.empresa}</td>
              <td>{cliente.fechaRegistro}</td>
              <td>
                <button onClick={() => handleViewDetails(cliente.id)}>👁️ Ver Detalles</button>
                <button onClick={() => handleEdit(cliente.id)}>Editar</button>
                <button onClick={() => handleDelete(cliente.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal data={modalData} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} />
      )}
      {isDetailModalOpen && (
        <DetailModal data={modalData} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  );
};

const Modal = ({ data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{data.id ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Empresa</label>
            <input
              type="text"
              name="empresa"
              placeholder="Empresa"
              value={formData.empresa || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-save">Guardar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DetailModal = ({ data, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles del Cliente</h2>
        <div className="detail-header">
          <h3>{data.nombre}</h3>
          <p>{data.empresa}</p>
        </div>
        <div className="detail-section">
          <h4>Información de Contacto</h4>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Teléfono:</strong> {data.telefono}</p>
        </div>
        <div className="detail-section">
          <h4>Información Adicional</h4>
          <p><strong>Fecha de Registro:</strong> {data.fechaRegistro}</p>
          <p><strong>Empresa:</strong> {data.empresa}</p>
        </div>
        <div className="detail-cards">
          <div className="card">
            <h5>Viajes Realizados</h5>
            <p>{data.viajesRealizados}</p>
          </div>
          <div className="card">
            <h5>Total Facturado</h5>
            <p>${data.totalFacturado}</p>
          </div>
          <div className="card">
            <h5>Viajes Pendientes</h5>
            <p>{data.viajesPendientes}</p>
          </div>
        </div>
        <button className="btn-cancel" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

