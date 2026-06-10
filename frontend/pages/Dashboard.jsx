import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  GitBranch,
  Database,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Server,
  Cpu,
  Activity,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/hooks/useBrand";

const stats = [
  { label: "Tracked Events (24h)", value: "84.2K", change: "+12%", positive: true, icon: Server },
  { label: "Active Channels", value: "12", change: "+3", positive: true, icon: GitBranch },
  { label: "Attributed Revenue", value: "$48,920", change: "+18%", positive: true, icon: DollarSign },
  { label: "ROAS Lift", value: "+15%", change: "+2.1%", positive: true, icon: TrendingUp },
];

const recentEvents = [
  { id: 1, name: "Checkout, Acme Store", channel: "Meta CAPI", value: "$125.00", status: "attributed", date: "2 min ago" },
  { id: 2, name: "Repeat purchase, Beta Co", channel: "Shopify webhook", value: "$89.00", status: "attributed", date: "15 min ago" },
  { id: 3, name: "Email click, Gamma", channel: "Klaviyo event", value: "$245.00", status: "pending", date: "1 hour ago" },
  { id: 4, name: "Add-to-cart, Delta", channel: "Google EC", value: "$67.50", status: "attributed", date: "2 hours ago" },
];

const quickActions = [
  { label: "Add channel", icon: Plus, color: "bg-yellow-500" },
  { label: "Connect store", icon: Server, color: "bg-yellow-500" },
  { label: "Run model", icon: GitBranch, color: "bg-amber-500" },
  { label: "Export events", icon: Database, color: "bg-amber-500" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { brand } = useBrand();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what attribution is telling you about{" "}
          {brand?.name || "your store"} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-500 transition-all group"
            >
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attribution Events */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Attribution Events</h2>
            <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Server className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.channel} · {event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{event.value}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'attributed' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {[
              { icon: Server, text: "Meta CAPI connected, 12,480 events streamed", time: "5 min ago", color: "bg-yellow-500" },
              { icon: GitBranch, text: "Switched to position-based (40-20-40) model", time: "12 min ago", color: "bg-yellow-500" },
              { icon: Cpu, text: "Claude LLM connected for journey analysis", time: "1 hour ago", color: "bg-amber-500" },
              { icon: Activity, text: "Cohort analysis ran on 30-day window", time: "2 hours ago", color: "bg-amber-500" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${activity.color} flex-shrink-0`}>
                  <activity.icon className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel ROI Section - Placeholder */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Channel ROI by Attribution Model</h2>
          <div className="flex gap-2">
            {['7D', '30D', '90D', '1Y'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 text-sm rounded-lg ${
                  period === '30D'
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48 flex items-end justify-between gap-2">
          {[35, 45, 30, 55, 70, 65, 80, 75, 90, 85, 95, 100].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-yellow-500 rounded-t hover:bg-yellow-600 transition-colors"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
