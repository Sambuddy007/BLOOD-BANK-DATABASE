import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Droplets, 
  Building2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    totalHospitals: 0,
    lowStockAlerts: 0
  });

  const [bloodTypeData, setBloodTypeData] = useState([]);
  const [monthlyDonations, setMonthlyDonations] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch donors count
      const donorsResponse = await fetch('http://localhost:5000/donors');
      const donors = await donorsResponse.json();
      
      // Fetch recipients count
      const recipientsResponse = await fetch('http://localhost:5000/recipients');
      const recipients = await recipientsResponse.json();
      
      // Fetch hospitals count
      const hospitalsResponse = await fetch('http://localhost:5000/hospitals');
      const hospitals = await hospitalsResponse.json();

      setStats({
        totalDonors: donors.length,
        totalRecipients: recipients.length,
        totalHospitals: hospitals.length,
        lowStockAlerts: 3 // Mock data for now
      });

      // Process blood type data
      const bloodTypes = {};
      donors.forEach(donor => {
        const type = donor.don_b_grp || 'Unknown';
        bloodTypes[type] = (bloodTypes[type] || 0) + 1;
      });

      const bloodTypeChartData = Object.entries(bloodTypes).map(([type, count]) => ({
        name: type,
        value: count
      }));

      setBloodTypeData(bloodTypeChartData);

      // Mock monthly donations data
      setMonthlyDonations([
        { month: 'Jan', donations: 45 },
        { month: 'Feb', donations: 52 },
        { month: 'Mar', donations: 38 },
        { month: 'Apr', donations: 61 },
        { month: 'May', donations: 55 },
        { month: 'Jun', donations: 48 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your blood bank operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donors"
          value={stats.totalDonors}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="bg-blue-500"
        />
        <StatCard
          title="Blood Units"
          value="156"
          icon={Droplets}
          trend="up"
          trendValue="+8%"
          color="bg-red-500"
        />
        <StatCard
          title="Hospitals"
          value={stats.totalHospitals}
          icon={Building2}
          trend="up"
          trendValue="+5%"
          color="bg-green-500"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          icon={AlertTriangle}
          trend="down"
          trendValue="-3"
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloodTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Donations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donations</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New donor registered: John Doe (A+)</span>
            </div>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Blood request from City Hospital</span>
            </div>
            <span className="text-xs text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Low stock alert: B- blood type</span>
            </div>
            <span className="text-xs text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
