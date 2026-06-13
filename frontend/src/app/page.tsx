"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Cpu, BarChart3, Database, FileDown, PieChart, 
  CheckCircle2, XCircle, Target, Settings, FolderOpen, Workflow 
} from "lucide-react";
import { API_URL } from "@/config";

export default function Home() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`${API_URL}`);
        if (res.ok) {
          const json = await res.json();
          setStatus(json);
        }
      } catch (e) {
        console.error("Backend offline:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const systemStatus = status ? "Ready" : "Offline";
  const kbStatus = status ? "Ready" : "Offline";
  const vectorStatus = status ? "Ready" : "Offline";

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#070d1a] relative overflow-hidden select-none">
      {/* Decorative Radial Background */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[100%] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl w-full space-y-8 animate-fade-up">
        {/* Hero Banner Shell */}
        <div className="border border-[#1e2d45] rounded-3xl p-6 md:p-10 bg-gradient-to-b from-[#0c1830] via-[#091526] to-[#070d1a] relative overflow-hidden shadow-2xl">
          {/* Header Branding */}
          <div className="flex justify-between items-center border-b border-[#1e2d45] pb-6 mb-8 text-sm">
            <div className="text-xl font-extrabold tracking-tight text-white">
              Sli<span className="text-[#38bdf8]">p</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-gray-500 font-semibold">
              <span className="text-white">Overview</span>
              <span>Predict</span>
              <span>AI Strategist</span>
              <span>Docs</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-6 max-w-2xl mx-auto my-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Predict churn early.<br/>
              <span className="text-[#38bdf8]">Retain every customer.</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              A production-grade churn intelligence platform combining ML prediction, RAG-powered knowledge retrieval, and agentic AI reasoning — all in one workspace.
            </p>

            {/* Pill Rows */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1e2d45] rounded-full text-xs font-semibold text-[#93c5fd]">
                <Cpu className="w-3.5 h-3.5" /> LangGraph Agent
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1e2d45] rounded-full text-xs font-semibold text-[#93c5fd]">
                <BarChart3 className="w-3.5 h-3.5" /> ML Pipeline
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1e2d45] rounded-full text-xs font-semibold text-[#93c5fd]">
                <Database className="w-3.5 h-3.5" /> RAG Playbook
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1e2d45] rounded-full text-xs font-semibold text-[#93c5fd]">
                <FileDown className="w-3.5 h-3.5" /> Reports
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1e2d45] rounded-full text-xs font-semibold text-[#93c5fd]">
                <PieChart className="w-3.5 h-3.5" /> Analytics
              </div>
            </div>
          </div>
        </div>

        {/* Health status row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-4 flex flex-col">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Dataset Rows</span>
            <span className="text-xl font-extrabold text-white mt-1">
              {loading ? "..." : (status?.dataset_rows?.toLocaleString() || "Offline")}
            </span>
            <span className="mt-2 text-[10px] text-gray-500 flex items-center gap-1 font-semibold uppercase">
              <Database className="w-3 h-3 text-[#38bdf8]" /> DB Source
            </span>
          </div>

          <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-4 flex flex-col">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Model Features</span>
            <span className="text-xl font-extrabold text-white mt-1">
              {loading ? "..." : (status?.features_count || "Offline")}
            </span>
            <span className="mt-2 text-[10px] text-gray-500 flex items-center gap-1 font-semibold uppercase">
              <Cpu className="w-3 h-3 text-[#38bdf8]" /> Random Forest
            </span>
          </div>

          <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-4 flex flex-col">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Knowledge Base</span>
            <span className={`text-xl font-extrabold mt-1 ${status ? "text-emerald-400" : "text-red-400"}`}>
              {loading ? "..." : kbStatus}
            </span>
            <span className="mt-2 text-[10px] text-gray-500 flex items-center gap-1 font-semibold uppercase">
              {status ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
              MD Playbooks
            </span>
          </div>

          <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-4 flex flex-col">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Vector Index</span>
            <span className={`text-xl font-extrabold mt-1 ${status ? "text-emerald-400" : "text-red-400"}`}>
              {loading ? "..." : vectorStatus}
            </span>
            <span className="mt-2 text-[10px] text-gray-500 flex items-center gap-1 font-semibold uppercase">
              {status ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
              FAISS Store
            </span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a1628] border border-[#1e2d45] rounded-2xl p-5 flex flex-col">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Target className="w-4.5 h-4.5 text-[#38bdf8]" /> What it does
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Estimates customer churn probability from service profiles and converts predictions into business-focused saving interventions.
            </p>
          </div>

          <div className="bg-[#0a1628] border border-[#1e2d45] rounded-2xl p-5 flex flex-col">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <Settings className="w-4.5 h-4.5 text-[#38bdf8]" /> How it works
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Input customer attributes → preprocessing pipeline → risk scoring → LangGraph + RAG strategizing → email draft and mitigation report.
            </p>
          </div>

          <div className="bg-[#0a1628] border border-[#1e2d45] rounded-2xl p-5 flex flex-col">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <FolderOpen className="w-4.5 h-4.5 text-[#38bdf8]" /> Data supported
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Structured subscriber CSV features, trained Scikit-learn model pickles (.pkl), markdown playbook documents, and FAISS vector indices.
            </p>
          </div>
        </div>

        {/* Product flow shell */}
        <div className="bg-[#0a1628] border border-[#1e2d45] rounded-2xl p-6">
          <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
            <Workflow className="w-5 h-5 text-[#38bdf8]" /> Product Flow
          </h4>
          <div className="space-y-2.5 text-xs text-gray-400">
            <p><strong className="text-[#38bdf8]">1.</strong> Explore global churn distributions and correlations in the analytics dashboard.</p>
            <p><strong className="text-[#38bdf8]">2.</strong> Run classification model inferences to calculate risk on individual customer profiles.</p>
            <p><strong className="text-[#38bdf8]">3.</strong> Engage the LangGraph RAG cognitive flow to construct tailored retention plans and email drafts.</p>
          </div>
        </div>

        {/* Enter Dashboard button */}
        <Link 
          href="/dashboard"
          className="block w-full py-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl text-center font-bold tracking-wide transition shadow-lg cursor-pointer select-none"
        >
          Enter Command Center
        </Link>
      </div>
    </main>
  );
}
