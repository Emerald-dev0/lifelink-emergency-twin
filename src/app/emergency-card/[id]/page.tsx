'use client';

import { use, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertTriangle, Phone, Shield, Loader2 } from 'lucide-react';

interface PatientData {
  identifier: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
}

export default function EmergencyCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/emergency/${id}`);
        const data = await res.json();
        if (data.success) {
          setPatient(data.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-[#FF3D3D] mx-auto mb-4" />
          <p className="text-white text-lg font-bold">NO IDENTITY FOUND</p>
          <p className="text-gray-400 text-sm mt-2">Invalid LIFELINK ID</p>
        </div>
      </div>
    );
  }

  const emergencyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/emergency/${patient.identifier}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white select-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
      {/* Top Banner */}
      <div className="bg-[#FF3D3D] px-4 py-3 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Emergency Medical Information</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 flex flex-col items-center">
        {/* Blood Type — HUGE */}
        <div className="w-full text-center mb-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Blood Type</p>
          <p className="text-[72px] font-black leading-none text-[#FF3D3D]" style={{ textShadow: '0 0 30px rgba(255,61,61,0.3)' }}>
            {patient.bloodType}
          </p>
        </div>

        {/* QR Code — Large and Scannable */}
        <div className="bg-white p-5 rounded-2xl mb-6" style={{ boxShadow: '0 0 40px rgba(0,229,255,0.15)' }}>
          {patient.identifier ? (
            <QRCodeSVG
              value={emergencyUrl}
              size={260}
              level="H"
              fgColor="#050505"
              bgColor="#FFFFFF"
              imageSettings={{
                src: '/icons/lifelink-logo.svg',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          ) : (
            <div className="w-[260px] h-[260px] bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-400 text-xs">No ID</p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-gray-500 text-center mb-6 uppercase tracking-wider">
          Scan QR to view full medical information
        </p>

        {/* Allergies — Warning */}
        {patient.allergies.length > 0 && (
          <div className="w-full rounded-xl border border-[#FFB800]/30 bg-[#FFB800]/5 p-4 mb-4">
            <p className="text-[10px] text-[#FFB800] font-black uppercase tracking-[0.2em] mb-2">
              ⚠ ALLERGIES — DO NOT ADMINISTER
            </p>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <span key={a} className="px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-xs font-bold text-[#FFB800]">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medications */}
        {patient.medications.length > 0 && (
          <div className="w-full rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-4 mb-4">
            <p className="text-[10px] text-[#00E5FF] font-black uppercase tracking-[0.2em] mb-2">
              ACTIVE MEDICATIONS
            </p>
            <div className="space-y-1">
              {patient.medications.map((m) => (
                <p key={m} className="text-sm text-gray-300">{m}</p>
              ))}
            </div>
          </div>
        )}

        {/* Conditions */}
        {patient.conditions.length > 0 && (
          <div className="w-full rounded-xl border border-gray-700 bg-gray-800/30 p-4 mb-4">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">
              CONDITIONS
            </p>
            <div className="flex flex-wrap gap-2">
              {patient.conditions.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full border border-gray-600 text-xs text-gray-300">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts — Tap to Call */}
        {patient.emergencyContacts.length > 0 && (
          <div className="w-full rounded-xl border border-gray-700 bg-gray-800/30 p-4 mb-6">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">
              EMERGENCY CONTACTS
            </p>
            <div className="space-y-2">
              {patient.emergencyContacts.map((c, i) => (
                <a
                  key={i}
                  href={`tel:${c.phone}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#050505] border border-gray-700 active:bg-gray-800 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-[11px] text-gray-500">{c.relationship}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/10">
                    <Phone className="w-3 h-3 text-[#00E5FF]" />
                    <span className="text-xs font-bold text-[#00E5FF]">{c.phone}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Shield className="w-3 h-3 text-[#00E5FF]" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">LIFELINK Emergency Identity</span>
          </div>
          <p className="text-[9px] text-gray-600 font-mono">{patient.identifier}</p>
        </div>
      </div>
    </div>
  );
}
