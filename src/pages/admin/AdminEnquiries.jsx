import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Phone, Calendar, User, ShoppingBag, CheckCircle, Clock } from 'lucide-react';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    productOfInterest: '',
    status: 'pending',
    notes: ''
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedEnquiries = localStorage.getItem('tr_traders_enquiries');
    if (savedEnquiries) {
      setEnquiries(JSON.parse(savedEnquiries));
    } else {
      // Load initial mock data to show them how it works
      const mockData = [
        {
          id: '1',
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          productOfInterest: 'Indigo Blue Suit (Premium Cotton)',
          status: 'pending',
          date: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Asked for custom sizing XL.'
        },
        {
          id: '2',
          name: 'Neha Gupta',
          phone: '+91 99887 76655',
          productOfInterest: 'Glass Organza Tie-Dye',
          status: 'resolved',
          date: new Date(Date.now() - 172800000).toISOString(),
          notes: 'Ordered and paid via UPI.'
        }
      ];
      setEnquiries(mockData);
      localStorage.setItem('tr_traders_enquiries', JSON.stringify(mockData));
    }
  }, []);

  // Save to local storage whenever enquiries changes
  useEffect(() => {
    // Prevent overriding with empty array on first render if there's actual data
    if (enquiries.length > 0) {
       localStorage.setItem('tr_traders_enquiries', JSON.stringify(enquiries));
    }
  }, [enquiries]);

  const handleStatusToggle = (id) => {
    setEnquiries(enquiries.map(enq => {
      if (enq.id === id) {
        return { ...enq, status: enq.status === 'pending' ? 'resolved' : 'pending' };
      }
      return enq;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry lead?')) {
      const newEnquiries = enquiries.filter(e => e.id !== id);
      setEnquiries(newEnquiries);
      localStorage.setItem('tr_traders_enquiries', JSON.stringify(newEnquiries));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEnquiry = {
      ...formData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    const updated = [newEnquiry, ...enquiries];
    setEnquiries(updated);
    
    // Reset Form
    setFormData({ name: '', phone: '', productOfInterest: '', status: 'pending', notes: '' });
    setIsModalOpen(false);
  };

  const filteredEnquiries = enquiries.filter(enq => 
    enq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    enq.phone.includes(searchTerm) ||
    enq.productOfInterest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-text font-medium">WhatsApp Leads (CRM)</h2>
          <p className="text-muted text-sm mt-1">
            Manually track and manage the customer inquiries you receive on WhatsApp.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-text text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2 w-max shadow-sm"
        >
          <Plus size={18} />
          Log New Lead
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads by name, phone, or product..." 
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium border border-yellow-100 flex items-center gap-2">
                <Clock size={16} />
                {enquiries.filter(e => e.status === 'pending').length} Pending
            </div>
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2">
                <CheckCircle size={16} />
                {enquiries.filter(e => e.status === 'resolved').length} Resolved
            </div>
        </div>
      </div>

      {/* Dashboard Lists */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {filteredEnquiries.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center justify-center">
              <User size={48} className="text-gray-200 mb-4" />
              <h3 className="text-lg font-serif font-medium text-text">No leads found</h3>
              <p className="text-gray-500 text-sm mt-1 mb-6">You don't have any WhatsApp inquiries matching your search.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg/50 border-b border-border text-xs uppercase tracking-wider text-muted font-bold font-sans">
                  <th className="p-4 font-bold">Customer Info</th>
                  <th className="p-4 font-bold">Interested In</th>
                  <th className="p-4 font-bold hidden md:table-cell">Date Logged</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-medium text-text mb-1">{enquiry.name}</div>
                      <div className="text-sm text-gray-500 font-sans flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" />
                        {enquiry.phone}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-2">
                        <ShoppingBag size={16} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-text text-sm block leading-tight">{enquiry.productOfInterest}</span>
                          {enquiry.notes && <span className="text-xs text-gray-500 italic mt-1 block max-w-xs">{enquiry.notes}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 align-top hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                           <Calendar size={14} className="text-gray-400" />
                           {new Date(enquiry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </td>
                    <td className="p-4 align-top">
                      <button 
                        onClick={() => handleStatusToggle(enquiry.id)}
                        className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
                          enquiry.status === 'resolved' 
                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200'
                        }`}
                      >
                        {enquiry.status === 'resolved' ? (
                          <><CheckCircle size={14} /> Resolved</>
                        ) : (
                          <><Clock size={14} /> Pending</>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right align-top">
                      <button 
                        onClick={() => handleDelete(enquiry.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete Lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fade-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-bg/30">
              <h3 className="font-serif text-xl font-medium text-text">Log New WhatsApp Lead</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-text transition-colors text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">Customer Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" placeholder="e.g. Priya Sharma" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">WhatsApp Number</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Product of Interest</label>
                <input type="text" required value={formData.productOfInterest} onChange={e => setFormData({...formData, productOfInterest: e.target.value})} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" placeholder="e.g. Red Silk Anarkali" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Initial Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none">
                  <option value="pending">Pending Reply / Negotiation</option>
                  <option value="resolved">Resolved / Ordered</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Notes / Chat Summary</label>
                <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2.5 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" placeholder="Add any sizing notes or conversation context here..."></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-text rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-text hover:bg-black text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
