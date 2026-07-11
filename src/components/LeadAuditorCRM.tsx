import React, { useState, useEffect } from "react";
import { 
  Briefcase, Search, ShieldAlert, Cpu, CheckCircle, ArrowRight, Plus, 
  Trash2, Mail, FileText, DollarSign, Calendar, RefreshCw, BarChart2, Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Lead } from "../types";
import ReactMarkdown from "react-markdown";

export default function LeadAuditorCRM() {
  const [activeTab, setActiveTab] = useState<"auditor" | "discover" | "crm">("crm");
  
  // CRM State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [crmLoading, setCrmLoading] = useState(false);
  
  // Brand Auditor State
  const [auditName, setAuditName] = useState("");
  const [auditIndustry, setAuditIndustry] = useState("Construcción / Painting");
  const [auditUrl, setAuditUrl] = useState("");
  const [auditDesc, setAuditDesc] = useState("");
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // Discover Leads State
  const [discoverCity, setDiscoverCity] = useState("Shallotte, NC");
  const [discoverIndustry, setDiscoverIndustry] = useState("Painting Contractors");
  const [discoveredLeads, setDiscoveredLeads] = useState<any[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);

  // Manual Lead Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadContact, setNewLeadContact] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadUrl, setNewLeadUrl] = useState("");
  const [newLeadIndustry, setNewLeadIndustry] = useState("Servicios Locales");
  const [newLeadNotes, setNewLeadNotes] = useState("");

  // Fetch leads from Express server
  const fetchLeads = async () => {
    setCrmLoading(true);
    try {
      const response = await fetch("/api/crm/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setCrmLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead status on server
  const handleUpdateStatus = async (id: string, nextStatus: Lead["status"]) => {
    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        const updatedLead = await response.json();
        setLeads((prev) => prev.map((l) => (l.id === id ? updatedLead : l)));
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  // Delete lead on server
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este lead del CRM?")) return;
    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  // Add Lead to CRM
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;

    try {
      const response = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLeadName,
          contactName: newLeadContact,
          email: newLeadEmail,
          phone: newLeadPhone,
          website: newLeadUrl,
          industry: newLeadIndustry,
          notes: newLeadNotes,
          status: "Identificado",
          score: Math.floor(Math.random() * 25) + 65 // Random realism score
        })
      });

      if (response.ok) {
        const created = await response.json();
        setLeads((prev) => [created, ...prev]);
        setShowAddModal(false);
        // Reset
        setNewLeadName("");
        setNewLeadContact("");
        setNewLeadEmail("");
        setNewLeadPhone("");
        setNewLeadUrl("");
        setNewLeadNotes("");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  // Run AI Website Brand Audit
  const handleRunAudit = async () => {
    if (!auditName) return;
    setAuditLoading(true);
    setAuditReport(null);

    try {
      const response = await fetch("/api/leads/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: auditName,
          industry: auditIndustry,
          websiteUrl: auditUrl,
          description: auditDesc
        })
      });

      const data = await response.json();
      setAuditReport(data.report);
    } catch (error) {
      console.error("Audit error:", error);
      setAuditReport("Error al generar auditoría de marca. Intente nuevamente.");
    } finally {
      setAuditLoading(false);
    }
  };

  // Run AI Lead Discovery
  const handleDiscoverLeads = async () => {
    setDiscoverLoading(true);
    setDiscoveredLeads([]);

    try {
      const response = await fetch("/api/leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: discoverCity,
          industry: discoverIndustry
        })
      });

      const data = await response.json();
      setDiscoveredLeads(data.leads || []);
    } catch (error) {
      console.error("Discovery error:", error);
    } finally {
      setDiscoverLoading(false);
    }
  };

  // Add discovered lead into CRM
  const handleImportLead = async (discovered: any) => {
    try {
      const response = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: discovered.name,
          contactName: discovered.contactName,
          email: discovered.email,
          phone: discovered.phone,
          website: discovered.website,
          industry: discoverIndustry,
          notes: `Lead descubierto por Mora-Intel. Debilidad identificada: ${discovered.weakness}`,
          status: "Identificado",
          score: discovered.score
        })
      });

      if (response.ok) {
        const created = await response.json();
        setLeads((prev) => [created, ...prev]);
        // Remove from list
        setDiscoveredLeads((prev) => prev.filter((d) => d.name !== discovered.name));
        alert(`¡${discovered.name} ha sido importado exitosamente al CRM!`);
      }
    } catch (error) {
      console.error("Import error:", error);
    }
  };

  // Count leads by status
  const getStatusCount = (status: Lead["status"]) => {
    return leads.filter((l) => l.status === status).length;
  };

  return (
    <div className="space-y-6" id="crm-commercial-workspace">
      {/* Workspace Subheading / Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            Mora-Intel Workspace
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
              ACTIVE CRM
            </span>
          </h2>
          <p className="text-xs text-neutral-400">
            Suite privada de automatización comercial, auditorías de marca con Gemini y control de contratos de Mora-Grafic's.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-neutral-900 border border-white/10 p-1 rounded-xl">
          {[
            { id: "crm", label: "CRM & Pipelines" },
            { id: "auditor", label: "Auditor de Marcas IA" },
            { id: "discover", label: "Lead Discovery Engine" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div>
        {activeTab === "crm" && (
          <div className="space-y-6">
            {/* Stats board */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { status: "Identificado", label: "Identificados", color: "bg-neutral-800 text-neutral-300" },
                { status: "En Contacto", label: "En Contacto", color: "bg-blue-950/40 text-blue-300 border-blue-900/30" },
                { status: "Propuesta Enviada", label: "Propuesta Enviada", color: "bg-blue-950/40 text-blue-300 border-blue-900/30" },
                { status: "Convertido", label: "Convertidos 🎉", color: "bg-emerald-950/40 text-emerald-300 border-emerald-900/30" },
                { status: "Perdido", label: "Archivados", color: "bg-rose-950/20 text-rose-300 border-rose-900/10" }
              ].map((st) => (
                <div key={st.status} className="p-4 rounded-xl bg-neutral-900/80 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">{st.label}</span>
                    <span className="block text-2xl font-bold font-display mt-1 text-white">
                      {getStatusCount(st.status as any)}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded-md ${st.color}`}>
                    Active
                  </span>
                </div>
              ))}
            </div>

            {/* Pipeline list */}
            <div className="rounded-2xl liquid-glass overflow-hidden border border-white/10">
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-neutral-950/40">
                <h4 className="text-sm font-semibold text-white font-display">Embudo de Clientes y Contratos</h4>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Prospecto</span>
                </button>
              </div>

              {crmLoading ? (
                <div className="p-12 text-center text-neutral-400">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-xs">Sincronizando Leads del CRM con el servidor...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 space-y-2">
                  <p className="text-sm">El embudo de CRM está vacío.</p>
                  <p className="text-xs">Ve a la pestaña de "Lead Discovery Engine" para poblar el CRM con prospectos evaluados por IA.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-950/60 text-neutral-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                        <th className="p-4">Empresa / Negocio</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4">Estatus</th>
                        <th className="p-4">Calificación (Score)</th>
                        <th className="p-4">Industria</th>
                        <th className="p-4">Acciones de Ventas</th>
                        <th className="p-4 text-right">Mantenimiento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold text-white block">{lead.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">{lead.website || "Sin sitio"}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-neutral-200 block">{lead.contactName || "N/A"}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">{lead.email || lead.phone || "Sin contacto"}</span>
                          </td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                              className={`px-2 py-1 rounded-md text-[10px] font-medium bg-neutral-900 border border-white/10 text-white focus:outline-none ${
                                lead.status === "Convertido" ? "border-emerald-500/40 text-emerald-300" :
                                lead.status === "Propuesta Enviada" ? "border-blue-500/40 text-blue-300" : ""
                              }`}
                            >
                              <option value="Identificado">Identificado</option>
                              <option value="En Contacto">En Contacto</option>
                              <option value="Propuesta Enviada">Propuesta Enviada</option>
                              <option value="Convertido">Convertido 🎉</option>
                              <option value="Perdido">Archivado</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${lead.score >= 85 ? "bg-emerald-500" : "bg-blue-500"}`}></span>
                              <span className="font-mono font-medium">{lead.score}/100</span>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-300">{lead.industry}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {/* Quick Outreach Buttons */}
                              <a
                                href={`mailto:${lead.email}?subject=Propuesta de Rediseño Premium para ${lead.name}`}
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors border border-white/5"
                                title="Enviar correo de ventas"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                              <button
                                onClick={() => {
                                  // Prepopulate brand auditor
                                  setAuditName(lead.name);
                                  setAuditUrl(lead.website);
                                  setAuditIndustry(lead.industry);
                                  setAuditDesc(lead.notes);
                                  setActiveTab("auditor");
                                }}
                                className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] rounded-md font-mono transition-all border border-blue-500/20"
                                title="Hacer Auditoría de Marca con IA"
                              >
                                Audit IA
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 hover:bg-rose-500/10 text-neutral-500 hover:text-rose-400 rounded-lg transition-colors"
                              title="Eliminar Lead"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BRAND AUDITOR TAB */}
        {activeTab === "auditor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Controls */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-white/5 space-y-4">
                <h4 className="text-xs font-semibold text-neutral-300 font-mono uppercase tracking-wider">
                  Configurar Auditoría de Marca
                </h4>

                <div>
                  <label className="block text-[11px] text-neutral-400 font-mono mb-1.5 uppercase">Empresa Cliente</label>
                  <input
                    type="text"
                    value={auditName}
                    onChange={(e) => setAuditName(e.target.value)}
                    placeholder="E.g., Erazo's Painting"
                    className="w-full bg-neutral-950 text-white placeholder-neutral-700 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="audit-company-name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 font-mono mb-1.5 uppercase">Sitio Web Actual</label>
                  <input
                    type="text"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    placeholder="E.g., erazospainting.com"
                    className="w-full bg-neutral-950 text-white placeholder-neutral-700 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="audit-company-url"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 font-mono mb-1.5 uppercase">Industria</label>
                  <input
                    type="text"
                    value={auditIndustry}
                    onChange={(e) => setAuditIndustry(e.target.value)}
                    placeholder="E.g., Painting Contractor"
                    className="w-full bg-neutral-950 text-white placeholder-neutral-700 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="audit-company-industry"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 font-mono mb-1.5 uppercase">Observaciones Iniciales</label>
                  <textarea
                    value={auditDesc}
                    onChange={(e) => setAuditDesc(e.target.value)}
                    rows={3}
                    placeholder="E.g., Sitio lento, fotos de baja calidad, tipografía desordenada..."
                    className="w-full bg-neutral-950 text-white placeholder-neutral-700 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="audit-company-desc"
                  />
                </div>

                <button
                  onClick={handleRunAudit}
                  disabled={auditLoading || !auditName}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                  id="run-audit-btn"
                >
                  {auditLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Analizando con Gemini 3.5...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4 w-4 text-blue-200" />
                      <span>Generar Auditoría de Marca</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Audit Report Result Box */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl liquid-glass p-6 border border-white/10 min-h-[400px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span className="text-[11px] font-semibold text-neutral-400 font-mono uppercase tracking-wider">
                      Reporte de Auditoría Generativa de Marca
                    </span>
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                  </div>

                  <AnimatePresence mode="wait">
                    {auditLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-12 text-center text-neutral-400 space-y-4"
                      >
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">Extrayendo datos de diseño...</p>
                          <p className="text-xs text-neutral-500 max-w-[320px] mx-auto">
                            Gemini está analizando la jerarquía visual, métricas de velocidad, indexabilidad y tasa de conversión proyectada.
                          </p>
                        </div>
                      </motion.div>
                    ) : auditReport ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-neutral-300 leading-relaxed space-y-4 select-text markdown-body"
                      >
                        <ReactMarkdown>{auditReport}</ReactMarkdown>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center p-12 text-neutral-500"
                      >
                        <ShieldAlert className="h-10 w-10 text-neutral-600 mb-2" />
                        <h5 className="text-sm font-semibold text-white">Ningún Reporte Activo</h5>
                        <p className="text-xs max-w-[340px] mx-auto mt-1">
                          Ingresa los datos del cliente potencial a la izquierda y presiona el botón para modelar un reporte ejecutivo persuasivo.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {auditReport && !auditLoading && (
                  <div className="border-t border-white/5 pt-4 mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        // Quick copy
                        navigator.clipboard.writeText(auditReport);
                        alert("¡Auditoría copiada al portapapeles exitosamente!");
                      }}
                      className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs transition-colors"
                    >
                      Copiar Reporte
                    </button>
                    <button
                      onClick={async () => {
                        // Add directly to CRM
                        try {
                          const response = await fetch("/api/crm/leads", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: auditName,
                              website: auditUrl,
                              industry: auditIndustry,
                              notes: `Auditoría generada por IA.`,
                              status: "Propuesta Enviada",
                              score: 85
                            })
                          });
                          if (response.ok) {
                            fetchLeads();
                            alert("¡Lead importado al CRM con estado 'Propuesta Enviada'!");
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Importar como Lead a CRM
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LEAD DISCOVERY TAB */}
        {activeTab === "discover" && (
          <div className="space-y-6">
            {/* Input Controls */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="block text-[11px] text-neutral-400 font-mono mb-1.5 uppercase">Ciudad / Región</label>
                <input
                  type="text"
                  value={discoverCity}
                  onChange={(e) => setDiscoverCity(e.target.value)}
                  placeholder="E.g., Shallotte, NC o Honduras"
                  className="w-full bg-neutral-950 text-white placeholder-neutral-700 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  id="discover-city-input"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[11px] text-neutral-400 font-mono mb-1.5 uppercase">Industria a Evaluar</label>
                <input
                  type="text"
                  value={discoverIndustry}
                  onChange={(e) => setDiscoverIndustry(e.target.value)}
                  placeholder="E.g., Carpinteros, Hoteles, Talleres..."
                  className="w-full bg-neutral-950 text-white placeholder-neutral-700 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  id="discover-industry-input"
                />
              </div>

              <div className="md:col-span-4">
                <button
                  onClick={handleDiscoverLeads}
                  disabled={discoverLoading || !discoverCity}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                  id="run-discover-btn"
                >
                  {discoverLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Escanenando condados locales...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Descubrir Leads de Baja Conversión</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Discovered Leads Result Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {discoverLoading ? (
                  <div className="md:col-span-2 p-12 text-center text-neutral-400">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-xs">Sondando bases de datos y analizando debilidades estéticas vía Gemini...</p>
                  </div>
                ) : discoveredLeads.length > 0 ? (
                  discoveredLeads.map((dl, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl liquid-glass border border-white/10 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-white text-sm font-display">{dl.name}</h5>
                            <span className="text-[10px] text-neutral-400 font-mono tracking-wide uppercase">
                              Contacto: {dl.contactName}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2.5 py-0.5 rounded-full">
                            Puntaje Lead: {dl.score}/100
                          </span>
                        </div>

                        {/* Weakness tag */}
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-2 items-start">
                          <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                          <div className="text-[11px] text-neutral-300 leading-normal">
                            <strong>Debilidad Crítica:</strong> {dl.weakness}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="text-[10px] text-neutral-400 font-mono space-y-0.5 pt-1.5 border-t border-white/5">
                          <div>Sitio: {dl.website}</div>
                          <div>Correo: {dl.email}</div>
                          <div>Teléfono: {dl.phone}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleImportLead(dl)}
                        className="w-full py-2 bg-neutral-850 hover:bg-blue-600 hover:text-white text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Importar al CRM de Ventas</span>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="md:col-span-2 p-12 text-center text-neutral-500 rounded-2xl border border-dashed border-white/10 bg-neutral-900/20">
                    <Search className="h-8 w-8 text-neutral-700 mx-auto mb-2" />
                    <p className="text-sm">Buscador listo.</p>
                    <p className="text-xs">Establece la región e industria arriba para simular la prospección automatizada de Mora-Intel.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Manual Add Lead Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
          >
            <h4 className="text-base font-bold text-white font-display mb-4">Agregar Lead Manualmente</h4>

            <form onSubmit={handleAddLead} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-mono mb-1">Nombre de Empresa *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Contacto Principal</label>
                  <input
                    type="text"
                    value={newLeadContact}
                    onChange={(e) => setNewLeadContact(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Industria</label>
                  <input
                    type="text"
                    value={newLeadIndustry}
                    onChange={(e) => setNewLeadIndustry(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Correo</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Sitio Web Actual</label>
                <input
                  type="text"
                  value={newLeadUrl}
                  onChange={(e) => setNewLeadUrl(e.target.value)}
                  placeholder="E.g., domain.com"
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-mono mb-1">Notas Iniciales</label>
                <textarea
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Prospecto
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
