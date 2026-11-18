import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  isBackendConnected?: boolean;
  isSyncing?: boolean;
  onSyncData?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  searchKeyword,
  setSearchKeyword,
  isBackendConnected = false,
  isSyncing = false,
  onSyncData,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans text-stone-900">
      {/* Standalone Collapsible Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area with Standalone Admin Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          isBackendConnected={isBackendConnected}
          isSyncing={isSyncing}
          onSyncData={onSyncData}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
