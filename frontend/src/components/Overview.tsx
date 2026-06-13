"use client";

import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, AreaChart, Area 
} from "recharts";
import { Database, TrendingUp, DollarSign, ShieldAlert, ShieldCheck } from "lucide-react";
import { API_URL } from "@/config";

const BLUE = "#38bdf8";
const ORG = "#f97316";
const DARK_SLATE = "#1e293b";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [sampleData, setSampleData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [sumRes, chartRes, sampleRes] = await Promise.all([
          fetch(`${API_URL}/summary`),
          fetch(`${API_URL}/charts`),
          fetch(`${API_URL}/sample-data`)
        ]);

        if (!sumRes.ok || !chartRes.ok || !sampleRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const sumJson = await sumRes.json();
        const chartJson = await chartRes.json();
        const sampleJson = await sampleRes.json();

        setSummary(sumJson);
        setChartData(chartJson);
        setSampleData(sampleJson);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading platform intelligence overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center max-w-2xl mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-1">Failed to Connect to Backend</h3>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  // Correlation Heatmap Colors helper
  const getHeatmapColor = (val: number) => {
    // scale from #0a1628 (min) to #1d4ed8 (mid) to #38bdf8 (max)
    const absVal = Math.abs(val);
    if (val > 0) {
      if (val < 0.3) return "rgba(56, 189, 248, 0.1)";
      if (val < 0.7) return "rgba(56, 189, 248, 0.4)";
      return "rgba(56, 189, 248, 0.8)";
    } else {
      if (absVal < 0.3) return "rgba(249, 115, 22, 0.1)";
      if (absVal < 0.7) return "rgba(249, 115, 22, 0.4)";
      return "rgba(249, 115, 22, 0.8)";
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Platform Intelligence <span className="text-[#38bdf8]">Overview</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Telco Customer Analysis & Behavioral Insights</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold self-start sm:self-center">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
          <ShieldCheck className="w-3.5 h-3.5" />
          System Operational
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#38bdf8] shadow-lg hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Base</span>
            <Database className="w-5 h-5 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {summary.total_base.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">Active subscribers in dataset</p>
        </div>

        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#f97316] shadow-lg hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Churn Rate</span>
            <TrendingUp className="w-5 h-5 text-[#f97316]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {summary.churn_rate}%
          </div>
          <p className="text-xs text-emerald-500 mt-1">↓ -0.8% from last quarter</p>
        </div>

        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#38bdf8] shadow-lg hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg. Ticket</span>
            <DollarSign className="w-5 h-5 text-[#38bdf8]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            ${summary.avg_ticket}
          </div>
          <p className="text-xs text-gray-500 mt-1">Mean monthly charges</p>
        </div>

        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#a78bfa] shadow-lg hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">CLV Potential</span>
            <DollarSign className="w-5 h-5 text-[#a78bfa]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {formatCurrency(summary.clv_potential)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Lifetime value at risk</p>
        </div>
      </div>

      {/* Primary Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Churn Distribution</h3>
          <div className="h-[280px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.churn_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill={BLUE} />
                  <Cell fill={ORG} />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white">{summary.churn_rate}%</span>
              <span className="text-xs text-gray-400">Total Churn</span>
            </div>
          </div>
        </div>

        {/* Contract Type vs Churn */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contract Type vs Churn</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.contract_churn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="Contract" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="Retained" fill={BLUE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Churned" fill={ORG} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenure Distribution by Churn */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tenure Distribution by Churn</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.tenure_churn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="bin" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Area type="monotone" dataKey="Retained" stackId="1" stroke={BLUE} fill={BLUE} fillOpacity={0.2} />
                <Area type="monotone" dataKey="Churned" stackId="1" stroke={ORG} fill={ORG} fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Charges by Churn */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Charges Distribution by Churn</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.charge_churn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="bin" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Area type="monotone" dataKey="Retained" stroke={BLUE} fill={BLUE} fillOpacity={0.15} />
                <Area type="monotone" dataKey="Churned" stroke={ORG} fill={ORG} fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row: Internet Service vs Churn & Correlation Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internet Service vs Churn */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Internet Service vs Churn</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.internet_churn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="InternetService" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="Retained" fill={BLUE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Churned" fill={ORG} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Correlation Heatmap */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Correlation Heatmap</h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-4 gap-1 text-center font-semibold text-xs text-gray-400 mb-2">
              <div></div>
              {chartData.correlation.columns.map((col: string) => (
                <div key={col} className="capitalize">{col.replace("Charges", " Charges")}</div>
              ))}
            </div>
            {chartData.correlation.columns.map((rowCol: string, rowIndex: number) => (
              <div key={rowCol} className="grid grid-cols-4 gap-1 items-center mb-1 text-sm">
                <div className="text-right pr-2 text-xs font-semibold text-gray-400 capitalize truncate">
                  {rowCol.replace("Charges", " Charges")}
                </div>
                {chartData.correlation.matrix[rowIndex].map((val: number, colIndex: number) => (
                  <div 
                    key={colIndex}
                    style={{ backgroundColor: getHeatmapColor(val) }}
                    className="h-14 flex items-center justify-center rounded border border-[#1e2d45]/20 text-white font-bold transition hover:scale-105"
                  >
                    {val.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Explorer Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sample Data (first 100 rows)</h3>
        <div className="overflow-x-auto border border-[#1e2d45] rounded-xl max-h-[400px]">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0f1e36] text-gray-300 font-bold border-b border-[#1e2d45] sticky top-0">
                <th className="p-3">Gender</th>
                <th className="p-3">Senior</th>
                <th className="p-3">Tenure</th>
                <th className="p-3">Contract</th>
                <th className="p-3">Internet</th>
                <th className="p-3">Tech Support</th>
                <th className="p-3">Monthly Charges</th>
                <th className="p-3">Total Charges</th>
                <th className="p-3 text-center">Churn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {sampleData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#0f1e36]/30 text-gray-300 transition">
                  <td className="p-3 capitalize">{row.gender}</td>
                  <td className="p-3">{row.SeniorCitizen === 1 ? "Yes" : "No"}</td>
                  <td className="p-3">{row.tenure} mo</td>
                  <td className="p-3">{row.Contract}</td>
                  <td className="p-3">{row.InternetService}</td>
                  <td className="p-3">{row.TechSupport}</td>
                  <td className="p-3">${row.MonthlyCharges.toFixed(2)}</td>
                  <td className="p-3">${row.TotalCharges.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row.Churn === "Yes" 
                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {row.Churn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
