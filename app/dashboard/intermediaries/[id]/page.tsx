"use client"

import { useState } from 'react';
import * as React from 'react';
import { useParams } from 'next/navigation';
import { User, Phone, Mail, MapPin, Calendar, FileText, Users, CreditCard, FileCheck, Clock, Search, Bell, Settings, Plus, Download, Eye, Badge, Edit } from 'lucide-react';
import styles from './intermediaryProfile.module.css';
import { Button } from '@/components/ui/button';
import { Badge as ShadcnBadge } from '@/components/ui/badge';

interface IntermediaryProfileProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock database of intermediaries - in a real app, this would come from an API
const mockIntermediaries = [
  {
    id: '6',
    name: 'Michael Njoroge',
    email: 'michael.njoroge@example.com',
    phone: '+254 755 333 444',
    status: 'Active',
    policies: 15,
    joinDate: 'November 15, 2022',
    address: '303 Thika Road, Thika, Kenya',
    dob: 'December 5, 1978',
    avatarInitials: 'MN',
    intermediaryId: 'INT-1001',
    company: 'Nairobi Insurance Brokers',
    commissionRate: '15%',
    clients: 42
  },
  {
    id: '7',
    name: 'Elizabeth Atieno',
    email: 'elizabeth.atieno@example.com',
    phone: '+254 766 444 555',
    status: 'Active',
    policies: 23,
    joinDate: 'January 10, 2023',
    address: '404 Nyeri Road, Nyeri, Kenya',
    dob: 'February 20, 1988',
    avatarInitials: 'EA',
    intermediaryId: 'INT-1002',
    company: 'Mount Kenya Insurance Agency',
    commissionRate: '12.5%',
    clients: 28
  },
  {
    id: '8',
    name: 'James Mwangi',
    email: 'james.mwangi@example.com',
    phone: '+254 777 555 666',
    status: 'Active',
    policies: 18,
    joinDate: 'March 5, 2023',
    address: '505 Naivasha Road, Naivasha, Kenya',
    dob: 'October 10, 1975',
    avatarInitials: 'JM',
    intermediaryId: 'INT-1003',
    company: 'Rift Valley Insurance Services',
    commissionRate: '14%',
    clients: 35
  }
];

export default function IntermediaryProfilePage({ params }: IntermediaryProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);
  
  // Get the intermediary ID from the resolved params
  const intermediaryId = resolvedParams.id;
  
  // Find the intermediary by ID from the URL
  const intermediary = mockIntermediaries.find(i => i.id === intermediaryId);

  // If intermediary not found, show a loading state or error message
  if (!intermediary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Intermediary Not Found</h1>
          <p className="text-gray-600">The requested intermediary profile could not be found.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'policies', label: 'Policies', count: intermediary.policies },
    { id: 'clients', label: 'Clients', count: intermediary.clients },
    { id: 'commissions', label: 'Commissions' },
    { id: 'documents', label: 'Documents', count: 8 }
  ];

  const latestTasks = [
    {
      id: 1,
      title: 'Review policy renewal documents',
      status: 'Due 15 Dec',
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      title: 'Process commission payment',
      status: 'Due 20 Dec',
      priority: 'medium',
      completed: false
    },
    {
      id: 3,
      title: 'Submit monthly report',
      status: 'Due 25 Dec',
      priority: 'low',
      completed: true
    }
  ];

  const documents = [
    {
      id: 1,
      name: 'Contract Agreement.pdf',
      type: 'PDF',
      size: '2.4 MB',
      date: 'Nov 12, 2023'
    },
    {
      id: 2,
      name: 'Commission Statement Q3 2023.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      date: 'Oct 1, 2023'
    },
    {
      id: 3,
      name: 'ID Copy.jpg',
      type: 'Image',
      size: '850 KB',
      date: 'Sep 28, 2023'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intermediary Profile</h1>
          <p className="text-gray-600">Manage intermediary details and activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#ac1f2d] flex items-center justify-center text-white text-2xl font-bold">
              {intermediary.avatarInitials}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{intermediary.name}</h2>
                  <p className="text-gray-600">{intermediary.company}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <ShadcnBadge variant={intermediary.status === 'Active' ? 'default' : 'secondary'}>
                    {intermediary.status}
                  </ShadcnBadge>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {intermediary.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {intermediary.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {intermediary.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#ac1f2d] text-[#ac1f2d]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Intermediary Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Intermediary ID</h4>
                  <p className="text-gray-900">{intermediary.intermediaryId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Company</h4>
                  <p className="text-gray-900">{intermediary.company}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Commission Rate</h4>
                  <p className="text-gray-900">{intermediary.commissionRate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Total Clients</h4>
                  <p className="text-gray-900">{intermediary.clients}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Total Policies</h4>
                  <p className="text-gray-900">{intermediary.policies}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Join Date</h4>
                  <p className="text-gray-900">{intermediary.joinDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Policies</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        POL-2023-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Motor Insurance
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ShadcnBadge variant="default">Active</ShadcnBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KES 15,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                    {/* Add more policy rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Policy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Process Commission
              </Button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {latestTasks.map((task) => (
                <div key={task.id} className="flex items-start">
                  <div className={`flex-shrink-0 h-2 w-2 mt-1.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' : 
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <Button variant="ghost" size="sm" className="text-[#ac1f2d]">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
