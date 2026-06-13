"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, Cpu, Bot, Activity, ArrowLeft, Radio, 
  Database, ShieldAlert, Sparkles 
} from "lucide-react";
import { API_URL } from "@/config";

// Component imports
import Overview from "@/components/Overview";
import Prediction from "@/components/Prediction";
import Strategist from "@/components/Strategist";
import Performance from "@/components/Performance";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  
  // Shared state between Prediction and Strategist
  const [customerData, setCustomerData] = useState<any>(null);
  const [churnProb, setChurnProb] = useState<number>(0);
  
  // Snapshot states
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(`${API_URL}/summary`);
        if (res.ok) {
          const json = await res.json();
          setSummary(json);
        }
      } catch (e) {
        console.error("Failed to load sidebar summary:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Churn Prediction":
        return (
          <Prediction 
            customerData={customerData}
            setCustomerData={setCustomerData}
            churnProb={churnProb}
            setChurnProb={setChurnProb}
            setActiveTab={setActiveTab}
          />
        );
      case "AI Strategist":
        return (
          <Strategist 
            customerData={customerData}
            churnProb={churnProb}
            setActiveTab={setActiveTab}
          />
        );
      case "Model Performance":
        return <Performance />;
      default:
        return <Overview />;
    }
  };

  const navItems = [
    { name: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Churn Prediction", icon: <Cpu className="w-4 h-4" /> },
    { name: "AI Strategist", icon: <Bot className="w-4 h-4" /> },
    { name: "Model Performance", icon: <Activity className="w-4 h-4" /> }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#070d1a] text-[#e2e8f0]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#0b1220] border-b lg:border-b-0 lg:border-r border-[#1e2d45] flex flex-col justify-between p-6 shrink-0 z-10">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="border-b border-[#1e2d45] pb-4">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Sli<span className="text-[#38bdf8]">p</span>
            </h2>
            <span className="text-gray-500 text-[11px] block mt-0.5 font-bold uppercase tracking-wider">
              Telco Churn Intelligence
            </span>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-3 cursor-pointer ${
                    active 
                      ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg shadow-blue-900/30" 
                      : "text-gray-400 hover:text-white hover:bg-[#111827]"
                  }`}
                >
                  <span className={active ? "text-white" : "text-[#38bdf8]"}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-6 pt-6 mt-8 border-t border-[#1e2d45] lg:border-t-0 lg:pt-0">
          {/* Dataset Snapshot Card */}
          {summary && (
            <div className="bg-[#0a1628] border border-[#1e2d45] rounded-xl p-4 space-y-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                Dataset Snapshot
              </span>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Total customers</span>
                <span className="text-white">{summary.total_base.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Churn rate</span>
                <span className="text-[#f97316]">{summary.churn_rate}%</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Features</span>
                <span className="text-white">{summary.features}</span>
              </div>
            </div>
          )}

          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-xs transition border border-white/5 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Dashboard Header */}
        <header className="bg-gradient-to-r from-[#0f1e36] to-[#0a1628] border-b border-[#1e2d45] p-6 flex items-center gap-4">
          <div className="bg-[#070d1a] border border-[#1e2d45] p-2.5 rounded-xl text-[#38bdf8]">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">
              Slip — Churn Command Center
            </h1>
            <p className="text-gray-500 text-xs mt-1.5 font-medium leading-none">
              Monitor churn signals · Predict risk · Generate AI-powered retention actions
            </p>
          </div>
        </header>

        {/* Content Shell */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}
