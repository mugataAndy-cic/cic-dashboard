
'use client';

import { useState, useEffect } from 'react';
import styles from './clientProfile.module.css';
import { useRouter, useParams } from 'next/navigation';
import { 
  User, Phone, Mail, MapPin, Calendar, FileText, Users, 
  CreditCard, FileCheck, Clock, Search, Bell, Settings, 
  Plus, Download, Eye, X, Check, Upload, Loader2, FolderOpen, 
  LayoutDashboard, AlertCircle, Receipt, FileText as DocumentText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Types
type Priority = 'low' | 'medium' | 'high';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  policies: number;
  joinDate: string;
  address: string;
  dob: string;
  avatarInitials: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  assignedTo: string;
}

interface Document {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  color: string;
  size: string;
  lastModified: string;
}

type TabType = 'overview' | 'documents' | 'activity';

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Mercy Mandela',
    email: 'mercy.mandela@email.com',
    phone: '+254 700 123 456',
    status: 'Active',
    policies: 3,
    joinDate: 'January 15, 2022',
    address: '123 Main Street, Nairobi, Kenya',
    dob: 'May 10, 1980',
    avatarInitials: 'MM'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+254 723 456 789',
    status: 'Inactive',
    policies: 1,
    joinDate: 'March 10, 2023',
    address: '456 Park Road, Mombasa, Kenya',
    dob: 'September 22, 1975',
    avatarInitials: 'JS'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '+254 734 567 890',
    status: 'Active',
    policies: 5,
    joinDate: 'February 5, 2023',
    address: '789 Kenyatta Road, Nakuru, Kenya',
    dob: 'November 25, 1985',
    avatarInitials: 'RJ'
  }
];

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Review insurance policy',
    status: 'In Progress',
    priority: 'high',
    completed: false,
    dueDate: '2023-12-15',
    assignedTo: 'John Doe'
  },
  {
    id: 2,
    title: 'Update client information',
    status: 'Pending',
    priority: 'medium',
    completed: false,
    dueDate: '2023-12-20',
    assignedTo: 'Jane Smith'
  },
  {
    id: 3,
    title: 'Process claim #12345',
    status: 'Completed',
    priority: 'high',
    completed: true,
    dueDate: '2023-12-10',
    assignedTo: 'Robert Johnson'
  }
];

const mockDocuments: Document[] = [
  {
    id: 1,
    title: 'Insurance Policy',
    subtitle: 'Comprehensive Auto Insurance',
    type: 'PDF',
    color: 'bg-blue-100 text-blue-800',
    size: '2.5 MB',
    lastModified: '3 days ago'
  },
  {
    id: 2,
    title: 'Claim Form',
    subtitle: 'Filled Claim Form',
    type: 'DOCX',
    color: 'bg-green-100 text-green-800',
    size: '1.2 MB',
    lastModified: '1 week ago'
  }
];

interface ClientProfileProps {
  params: {
    id: string;
  };
}

const ClientProfilePage = ({ params }: ClientProfileProps) => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch documents function
  const fetchDocuments = async () => {
    try {
      // In a real app, you would fetch documents from an API
      // const response = await fetch(`/api/clients/${id}/documents`);
      // const data = await response.json();
      // setDocuments(data);
      setDocuments(mockDocuments); // Using mock data for now
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    }
  };

  // Safe accessor for client data
  const getClientData = (key: keyof Client) => {
    return client?.[key] ?? '';
  };
  


  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const clientId = Array.isArray(id) ? id[0] : id;
        const foundClient = mockClients.find(c => c.id === clientId);
        
        if (!foundClient) {
          setError('Client not found');
          toast.error('Client not found');
          router.push('/dashboard/clients');
          return;
        }
        
        setClient(foundClient);
      } catch (err) {
        console.error('Error loading client data:', err);
        setError('Failed to load client data');
        toast.error('Failed to load client data');
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [id, router]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock tasks data
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
      }
    };

    const fetchDocuments = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Mock documents data
        setDocuments(mockDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
      }
    };

    fetchTasks();
    fetchDocuments();
  }, []);

  // Handle export
  const handleExport = () => {
    if (!client) return;
    
    const data = {
      client,
      tasks,
      documents,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client_${client.id}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Client data exported successfully');
  };

  // Handle generate report
  const handleGenerateReport = () => {
    if (!client) return;
    
    toast.success(`Generating report for ${client.name}...`);
    // Simulate report generation
    setTimeout(() => {
      toast.success('Report generated successfully');
    }, 2000);
  };

  // Handle view all tasks
  const handleViewAllTasks = () => {
    // Navigate to tasks page or open tasks modal
    toast.info('Viewing all tasks');
  };

  // Handle add new task
  const handleAddNewTask = () => {
    // Open add task modal
    toast.info('Adding new task');
  };

  // Handle view all documents
  const handleViewAllDocuments = () => {
    // Navigate to documents page or open documents modal
    toast.info('Viewing all documents');
  };

  // Handle view document
  const handleViewDocument = (docId: number) => {
    toast.info(`Viewing document ${docId}`);
  };

  // Handle download document
  const handleDownloadDocument = (docId: number) => {
    toast.info(`Downloading document ${docId}`);
  };

  // Handle send email
  const handleSendEmail = () => {
    if (client) {
      window.location.href = `mailto:${client.email}`;
    }
  };

  // Handle update profile
  const handleUpdateProfile = () => {
    toast.success('Profile updated successfully');
  };

  // Allowed file types and max size (10MB)
  const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Handle file change with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = Math.min(prev + 10, 90);
        if (newProgress === 90) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 150);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear the progress interval
      clearInterval(interval);
      setUploadProgress(100);

      // Add the uploaded file to documents
      const newDoc: Document = {
        id: Date.now(),
        title: selectedFile.name,
        subtitle: `${(selectedFile.size / 1024).toFixed(1)} KB`,
        type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
        color: 'bg-blue-100 text-blue-800',
        size: `${(selectedFile.size / 1024).toFixed(1)} KB`,
        lastModified: new Date().toLocaleDateString()
      };

      setDocuments(prev => [newDoc, ...prev]);
      setSelectedFile(null);
      setShowUploadModal(false);

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload document');
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (uploadProgress < 100) {
        setUploadProgress(0);
      }
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  const { name, email, phone, status, policies, joinDate, address, dob, avatarInitials } = client;

  // Return the main component
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">{client?.name || 'Client'}'s Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSendEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" onClick={handleUpdateProfile}>
              <UserPlus className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerateReport}>
              <DocumentText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white/80 shadow-xl border-b rounded-b-2xl backdrop-blur-md">
        <div className="px-6 py-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
            {/* Profile picture */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center shadow-xl backdrop-blur-lg bg-purple-500/70 border-4 border-white">
                <span className="text-4xl text-white font-bold">
                  {avatarInitials || name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/30 to-cyan-300/20 blur-2xl"></div>
            </div>

            {/* Client info */}
            <div className="flex flex-col items-center sm:items-start">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{client.name}</h2>
              <p className="text-gray-500 mb-2">Client ID: {client.id}</p>
              <div className="flex flex-col gap-1 text-gray-600">
                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {client.phone}</span>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {client.email}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Joined: {client.joinDate}</span>
                <span className="flex items-center gap-2">
                  <ShadcnBadge variant={client.status === "Active" ? "default" : "secondary"}>
                    {client.status}
                  </ShadcnBadge>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6">
          <div className="flex border-b relative">
            <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 w-full"></div>
            <div className="flex space-x-1 px-4">
              {[
                { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
                { id: 'policies', label: 'Policies', icon: <FileText className="w-4 h-4 mr-2" /> },
                { id: 'claims', label: 'Claims', icon: <AlertCircle className="w-4 h-4 mr-2" /> },
                { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4 mr-2" /> },
                { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4 mr-2" /> },
                { 
                  id: 'documents', 
                  label: 'Documents', 
                  icon: <DocumentText className="w-4 h-4 mr-2" />,
                  badge: documents.length > 0 ? (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      {documents.length}
                    </span>
                  ) : null
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`group relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${
                    activeTab === tab.id
                      ? 'text-[#AC1F2D]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    <span className={`transition-opacity duration-200 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      {tab.icon}
                    </span>
                    <span className="ml-2">{tab.label}</span>
                    {tab.badge}
                  </span>
                  <span 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#AC1F2D] transition-all duration-300 transform ${
                      activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Client Details</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  title="Settings"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-gray-900">{client.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{client.dob}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-900">{client.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                  <p className="text-gray-900">{client.address}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Policy Status</label>
                  <ShadcnBadge variant={client.status === "Active" ? "default" : "secondary"}>
                    {client.status}
                  </ShadcnBadge>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-[#AC1F2D] text-white py-2 px-4 rounded-lg hover:bg-[#8B1A26] transition-colors text-sm font-medium"
                    onClick={handleUpdateProfile}
                  >
                    Update Profile
                  </button>
                  <button 
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    title="Send email"
                    aria-label="Send email to client"
                    onClick={handleSendEmail}
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Latest Tasks</h3>
                <button 
                  className="text-sm text-[#AC1F2D] hover:text-[#8B1A26] font-medium"
                  onClick={handleViewAllTasks}
                >
                  Show all
                </button>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority as Priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">{task.status}</span>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
              
              <button 
                className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                onClick={handleAddNewTask}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Client Details</h3>
                <Button variant="outline" size="sm" onClick={handleUpdateProfile}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{client?.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{client?.phone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{client?.address || 'No address provided'}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                  <div className="mt-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{client?.joinDate ? new Date(client.joinDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tasks Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewAllTasks}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Due {task.dueDate}</span>
                        <span>•</span>
                        <span>Assigned to {task.assignedTo}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDocument(task.id)}
                        aria-label={`View details for ${task.title}`}
                        title={`View ${task.title}`}
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewAllDocuments}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${doc.color} bg-opacity-10`}>
                        <FileText className="w-5 h-5 text-[#AC1F2D]" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.id)}
                        aria-label={`Download ${doc.title}`}
                        title={`Download ${doc.title}`}
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* File Upload Section */}
              <div className="mt-6 border-t pt-6">
                <label className="block mb-4">
                  <div className={styles.uploadArea}>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium">{selectedFile?.name}</span>
                        </div>
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          aria-label="Remove file"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Remove file</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-gray-400 mb-1" aria-hidden="true" />
                        <p className="text-sm text-gray-600">
                          <span className="text-[#AC1F2D] font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLS, JPG, PNG (max. 10MB)</p>
                      </div>
                    )}
                  </div>
                </label>
                <Button 
                  className={`${styles.uploadButton} ${(!selectedFile || isLoading || isUploading) ? styles.uploadAreaDisabled : ''}`}
                  onClick={() => selectedFile && handleUploadDocument()}
                  disabled={!selectedFile || isLoading || isUploading}
                  aria-label={!selectedFile ? 'Please select a file to upload' : 'Upload document'}
                  title={!selectedFile ? 'Please select a file to upload' : 'Upload document'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
                disabled={isUploading}
                aria-label="Close upload modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!isUploading ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="mt-3 text-center">
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-[#AC1F2D] hover:text-[#8a1925]">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOC, XLS, JPG, PNG (max. 10MB)
                      </p>
                    </label>
                    {selectedFile && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium">{selectedFile.name}</span>
                          </div>
                          <button 
                            type="button"
                            className="text-gray-400 hover:text-gray-600 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Uploading...
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div 
                      className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200"
                      role="progressbar"
                      aria-valuenow={Math.round(uploadProgress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                    >
                      <div 
                        className="flex flex-col justify-center bg-[#AC1F2D] transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUploadDocument}
                  disabled={!selectedFile || isUploading}
                  className="bg-[#AC1F2D] hover:bg-[#8a1925]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : 'Upload Document'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
        <button
          type="button"
          onClick={() => setShowUploadModal(false)}
          className="text-gray-400 hover:text-gray-500 transition-colors"
          disabled={isUploading}
          aria-label="Close upload modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6">
        {uploadProgress === 0 ? (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-[#AC1F2D] hover:text-[#8a1925] cursor-pointer">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOC, XLS, JPG, PNG (max. 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Uploading...
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div 
                className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200"
                role="progressbar"
                aria-valuenow={Math.round(uploadProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
              >
                <div 
                  className="flex flex-col justify-center bg-[#AC1F2D] transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUploadModal(false)}
          disabled={isUploading}
          className="min-w-[80px]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleUploadDocument}
          disabled={!selectedFile || isUploading}
          className="min-w-[80px] bg-[#AC1F2D] hover:bg-[#8a1925] text-white"
        >
          {isUploading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : 'Upload'}
        </Button>
      </div>
    </div>
  </div>
)}
