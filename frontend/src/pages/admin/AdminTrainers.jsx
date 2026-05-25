import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [unassignedClients, setUnassignedClients] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClientToAssign, setSelectedClientToAssign] = useState('');

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setErrorMessage('Debes iniciar sesión como administrador para ver esta página.');
      setLoading(false);
      return;
    }

    if (Number(user?.id_rol) === 1) {
      fetchTrainers();
    } else {
      setErrorMessage('No tienes permisos de administrador para acceder a esta información.');
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/api/admin/trainers');
      setTrainers(response.data);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error al cargar entrenadores', error);
      setErrorMessage('No se pudieron cargar los entrenadores.');
      toast.error('No se pudieron cargar los entrenadores');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerClients = async (trainer) => {
    setSelectedTrainer(trainer);
    setLoadingClients(true);
    try {
      const response = await api.get(`/api/admin/trainers/${trainer.id_usuario}/clients`);
      setClients(response.data || []);
    } catch (error) {
      console.error('Error al cargar clientes del entrenador', error);
      toast.error('No se pudieron cargar los clientes');
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleUnassignClient = async (clientId) => {
    if (!window.confirm('¿Deseas desasignar este cliente de su entrenador?')) return;

    try {
      await api.put(`/api/admin/trainers/${clientId}/unassign`);
      toast.success('Cliente desasignado correctamente');
      setClients((prev) => prev.filter((client) => client.id_usuario !== clientId));
      fetchTrainers();
    } catch (error) {
      console.error('Error al desasignar cliente', error);
      toast.error('No se pudo desasignar el cliente');
    }
  };

  const handleOpenAssignModal = async () => {
    if (!selectedTrainer) return;
    setIsAssignModalOpen(true);
    setSelectedClientToAssign('');
    try {
      const response = await api.get('/api/admin/unassigned-clients');
      setUnassignedClients(response.data || []);
    } catch (error) {
      console.error('Error cargando clientes sin asignar:', error);
      toast.error('Error al cargar clientes sin asignar');
    }
  };

  const handleAssignClient = async () => {
    if (!selectedClientToAssign || !selectedTrainer) return;
    try {
      await api.post(`/api/admin/trainers/${selectedTrainer.id_usuario}/assign/${selectedClientToAssign}`);
      toast.success('Cliente asignado correctamente');
      setIsAssignModalOpen(false);
      fetchTrainerClients(selectedTrainer);
      fetchTrainers();
    } catch (error) {
      console.error('Error al asignar cliente:', error);
      toast.error('No se pudo asignar el cliente');
    }
  };

  const filteredTrainers = trainers.filter(t =>
    `${t.nombre} ${t.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col gap-6">

          <div>
            <h1 className="text-4xl font-black italic uppercase mb-2">Entrenadores</h1>
            <p className="text-white/60 max-w-2xl text-sm md:text-base">
              Administra entrenadores y revisa qué clientes tienen asignados. Desde aquí puedes desasignar clientes y ver rápidamente la carga de cada entrenador.
            </p>
            {errorMessage && (
              <div className="mt-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
            
            <div className="bg-[#0d0d0d] rounded-3xl border border-white/5 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/40">Entrenadores</p>
                  <h2 className="text-2xl font-bold">Listado</h2>
                </div>
                <span className="text-sm text-white/40 whitespace-nowrap">{filteredTrainers.length} encontrados</span>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-white/40">Cargando entrenadores...</div>
              ) : filteredTrainers.length === 0 ? (
                <div className="py-12 text-center text-sm text-white/40">No se encontraron entrenadores.</div>
              ) : (
                <div className="space-y-3">
                  {filteredTrainers.map((trainer) => (
                    <button
                      key={trainer.id_usuario}
                      onClick={() => fetchTrainerClients(trainer)}
                      className={`w-full text-left rounded-3xl p-4 transition-all border ${
                        selectedTrainer?.id_usuario === trainer.id_usuario
                          ? 'border-red-600/30 bg-red-600/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-white text-base truncate">{trainer.nombre} {trainer.apellidos}</p>
                          <p className="text-sm text-white/50 truncate">{trainer.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Clientes</p>
                          <p className="text-lg font-black text-red-500">{trainer.clientsCount || 0}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#0d0d0d] rounded-3xl border border-white/5 p-5 shadow-xl min-h-80">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/40">Detalles</p>
                  <h2 className="text-2xl font-bold break-words">
                    {selectedTrainer ? `${selectedTrainer.nombre} ${selectedTrainer.apellidos}` : 'Selecciona un entrenador'}
                  </h2>
                </div>
                {selectedTrainer && (
                  <div className="flex flex-wrap gap-3 items-center justify-start lg:justify-end">
                    <span className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60 whitespace-nowrap">
                      {clients.length} clientes
                    </span>
                    <button
                      onClick={handleOpenAssignModal}
                      className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                      + Asignar Cliente
                    </button>
                  </div>
                )}
              </div>

              {selectedTrainer ? (
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                    <p className="text-sm text-white/50 mb-2">Email</p>
                    <p className="text-white text-sm md:text-base break-all">{selectedTrainer.email}</p>
                  </div>

                  {loadingClients ? (
                    <div className="py-16 text-center text-sm text-white/40">Cargando clientes...</div>
                  ) : clients.length === 0 ? (
                    <div className="py-16 text-center text-sm text-white/40">
                      Este entrenador no tiene clientes asignados actualmente.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {clients.map((client) => (
                        <div key={client.id_usuario} className="rounded-3xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-bold text-white text-base truncate">{client.nombre} {client.apellidos}</p>
                              <p className="text-sm text-white/50 truncate">{client.email}</p>
                            </div>
                            <button
                              onClick={() => handleUnassignClient(client.id_usuario)}
                              className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-red-700 w-full sm:w-auto"
                            >
                              Desasignar
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/50 border-t border-white/5 pt-2">
                            <p>Peso: <span className="text-white font-semibold">{client.peso ?? 'N/A'} kg</span></p>
                            <p>Objetivo: <span className="text-white font-semibold capitalize">{client.objetivo ? client.objetivo.replace(/_/g, ' ') : 'N/A'}</span></p>
                          </div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                            Asignado el: {client.fecha_asignacion ? new Date(client.fecha_asignacion).toLocaleDateString() : 'Sin fecha'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center text-sm text-white/40">
                  Selecciona un entrenador para ver sus clientes y desasignarlos.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] rounded-3xl border border-white/10 p-6 shadow-2xl relative mx-2">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-2">Asignar Cliente</h3>
            <p className="text-sm text-white/50 mb-6">
              Selecciona un cliente que actualmente no tenga entrenador para asignárselo a <span className="text-white font-bold italic">{selectedTrainer?.nombre}</span>.
            </p>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                Cliente a asignar
              </label>

              <div className="relative">
                <select
                  value={selectedClientToAssign}
                  onChange={(e) => setSelectedClientToAssign(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 pl-4 pr-10 py-3.5 text-sm text-white outline-none focus:border-red-500/50 appearance-none cursor-pointer transition-all"
                >
                  <option value="" className="bg-[#0d0d0d] text-white/50">-- Selecciona un cliente --</option>
                  {unassignedClients.map(client => (
                    <option
                      key={client.id_usuario}
                      value={client.id_usuario}
                      className="bg-[#0d0d0d] text-white py-2"
                    >
                      {client.nombre} {client.apellidos} — {client.email}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-white/40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {unassignedClients.length === 0 && (
                <p className="text-xs text-red-400 mt-2">No hay clientes sin entrenador actualmente.</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-5 py-3 rounded-full text-sm font-bold text-white/60 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignClient}
                disabled={!selectedClientToAssign}
                className="px-5 py-3 rounded-full bg-red-600 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTrainers;