import React from 'react';
// 아이콘 이름을 더 안정적인 것으로 변경했습니다.
import { Sparkles, Construction, Package, Shield, Bug, Car, Bell } from 'lucide-react';

const CATEGORIES = [
  { id: "cleaning", title: "청소 요청", subtitle: "청결 유지 신청", icon: Sparkles, color: "#3B82F6", bg: "#EFF6FF" },
  { id: "repair", title: "시설 수리", subtitle: "파손·고장 신고", icon: Construction, color: "#F59E0B", bg: "#FFFBEB" },
  { id: "supplies", title: "비품 부족", subtitle: "소모품 요청", icon: Package, color: "#10B981", bg: "#ECFDF5" },
  { id: "safety", title: "안전 신고", subtitle: "위험 요소 신고", icon: Shield, color: "#EF4444", bg: "#FEF2F2" },
  { id: "pest", title: "해충 신고", subtitle: "방역 요청", icon: Bug, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "parking", title: "주차 문제", subtitle: "주차 관련 신고", icon: Car, color: "#6B7280", bg: "#F9FAFB" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-5 pb-24" style={{ fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-4">
        <div>
          <p className="text-sm text-slate-500">안녕하세요 👋</p>
          <h1 className="text-2xl font-bold text-slate-900">무엇을 도와드릴까요?</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
          <Bell size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Banner */}
      <div className="bg-blue-600 rounded-3xl p-6 mb-8 text-white flex justify-between items-center shadow-lg shadow-blue-200">
        <div>
          <p className="text-xs text-blue-200 font-medium tracking-wider mb-1 uppercase">시설 관리 시스템</p>
          <h2 className="text-xl font-bold leading-tight">불편사항을<br />빠르게 해결해드려요</h2>
        </div>
        <div className="opacity-40">
          <Construction size={56} />
        </div>
      </div>

      {/* Grid */}
      <h3 className="text-lg font-semibold mb-4 text-slate-800">요청 유형 선택</h3>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((item) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50 hover:border-blue-200 transition-all active:scale-95 cursor-pointer"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" 
                style={{ backgroundColor: item.bg }}
              >
                <IconComponent size={24} style={{ color: item.color }} />
              </div>
              <p className="font-bold text-slate-900 mb-1">{item.title}</p>
              <p className="text-xs text-slate-400">{item.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}