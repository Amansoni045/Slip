"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Activity, Trophy, Award, Settings, ShieldAlert, Cpu } from "lucide-react";
import { API_URL } from "@/config";

const BLUE = "#38bdf8";
const PURPLE = "#a78bfa";

export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/metrics`);
        if (!res.ok) {
          throw new Error("Failed to fetch model diagnostics");
        }
        const json = await res.json();
        setMetrics(json);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-[#a78bfa] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading model performance metrics...</p>
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

  // Find the winning model from leaderboard
  const winner = metrics.leaderboard.find((m: any) => m.rank === "Gold") || metrics.leaderboard[0];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#a78bfa]" /> Model Performance & Diagnostics
        </h1>
        <p className="text-gray-400 text-sm mt-1">Detailed view of the trained Machine Learning pipeline and its evaluation metrics.</p>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#a78bfa] shadow-lg">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Model Accuracy</span>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics.model_accuracy}%</div>
          <p className="text-[10px] text-gray-500 mt-1">Overall percentage of correct predictions</p>
        </div>
        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#a78bfa] shadow-lg">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Precision (Churn)</span>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics.precision_churn}%</div>
          <p className="text-[10px] text-gray-500 mt-1">How many flagged as Churn actually churned</p>
        </div>
        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#a78bfa] shadow-lg">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Recall (Churn)</span>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics.recall_churn}%</div>
          <p className="text-[10px] text-gray-500 mt-1">Percentage of actual churn cases identified</p>
        </div>
        <div className="bg-[#0f1e36] border border-[#1e2d45] rounded-2xl p-5 border-l-4 border-l-[#a78bfa] shadow-lg">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">F1 Score (Churn)</span>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics.f1_churn}%</div>
          <p className="text-[10px] text-gray-500 mt-1">Harmonic mean of Precision and Recall</p>
        </div>
      </div>

      {/* Model Leaderboard Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-[#fbbf24]" /> Model Benchmarking Leaderboard
        </h3>
        <p className="text-xs text-gray-400 mb-6">Comparison of the top 3 models evaluated during cross-validation.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Chart */}
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.leaderboard} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="model" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="accuracy" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leaderboard winner card */}
          <div className="bg-gradient-to-br from-[#fbbf24]/10 to-[#0a1628]/10 border border-[#fbbf24]/30 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-[#fbbf24] font-bold text-md flex items-center gap-2">
                <Trophy className="w-5 h-5" /> The Winner
              </h4>
              <h5 className="text-white font-extrabold text-lg mt-3">{winner.model}</h5>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Chosen as the primary production-grade pipeline with a <strong>{winner.accuracy}%</strong> cross-validation accuracy. It provides optimal variance-bias trade-offs for churn detection.
              </p>
            </div>
            <div className="inline-block px-3 py-1 bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] rounded-full text-[10px] font-bold self-start mt-4 uppercase">
              BEST PERFORMANCE
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Confusion Matrix</h3>
          <p className="text-xs text-gray-400 mb-6">Test set evaluation results (Actual vs Predicted Churn).</p>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Grid layout for Heatmap */}
            <div className="w-full max-w-sm">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
                <div></div>
                <div>Predicted: No</div>
                <div>Predicted: Yes</div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center mb-2">
                <div className="text-right text-xs font-bold text-gray-500 pr-2">Actual: No</div>
                <div className="bg-[#1d4ed8]/30 border border-[#1e2d45] h-20 flex flex-col justify-center items-center rounded-xl">
                  <span className="text-white font-extrabold text-lg">{metrics.confusion_matrix.matrix[0][0]}</span>
                  <span className="text-[10px] text-gray-400 mt-1">True Negative</span>
                </div>
                <div className="bg-[#f97316]/10 border border-[#1e2d45] h-20 flex flex-col justify-center items-center rounded-xl">
                  <span className="text-white font-extrabold text-lg">{metrics.confusion_matrix.matrix[0][1]}</span>
                  <span className="text-[10px] text-gray-400 mt-1">False Positive</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-right text-xs font-bold text-gray-500 pr-2">Actual: Yes</div>
                <div className="bg-[#f97316]/10 border border-[#1e2d45] h-20 flex flex-col justify-center items-center rounded-xl">
                  <span className="text-white font-extrabold text-lg">{metrics.confusion_matrix.matrix[1][0]}</span>
                  <span className="text-[10px] text-gray-400 mt-1">False Negative</span>
                </div>
                <div className="bg-[#38bdf8]/30 border border-[#1e2d45] h-20 flex flex-col justify-center items-center rounded-xl">
                  <span className="text-white font-extrabold text-lg">{metrics.confusion_matrix.matrix[1][1]}</span>
                  <span className="text-[10px] text-gray-400 mt-1">True Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Feature Importance</h3>
          <p className="text-xs text-gray-400 mb-6">Relative contribution of features in the Random Forest model.</p>
          
          <div className="h-[280px]">
            {metrics.feature_importances && metrics.feature_importances.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.feature_importances} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={10} width={120} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f1e36", borderColor: "#1e2d45" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="importance" fill={PURPLE} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                Feature importance data not available for this model configuration.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Config Summary */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-blue-400" /> Model Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Pipeline Architecture</h4>
            <pre className="bg-[#070d1a] border border-[#1e2d45] rounded-xl p-4 text-xs font-mono text-[#38bdf8] overflow-x-auto">
{`Pipeline(steps=[
  ('preprocessor', ColumnTransformer(transformers=[
    ('num', StandardScaler(), ['tenure', 'MonthlyCharges', ...]),
    ('cat', OneHotEncoder(), ['Contract', 'InternetService', ...])
  ])),
  ('clf', RandomForestClassifier(n_estimators=50, random_state=42))
])`}
            </pre>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-white mb-3">Training Summary</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#a78bfa]" />
                <span><strong>Model Type:</strong> Random Forest Classifier</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#a78bfa]" />
                <span><strong>Total Training Samples:</strong> ~5,600 (with SMOTE balance)</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#a78bfa]" />
                <span><strong>Test Samples:</strong> 1,405 customers</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#a78bfa]" />
                <span><strong>Input Features:</strong> 19 categories (one-hot encoded)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
