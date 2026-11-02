import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, ShieldCheck, Copy, Check, MessageSquare } from 'lucide-react';

export const ContactModal = ({ item, isOpen, onClose }) => {
  const [copied, setCopied] = useState('');

  if (!isOpen || !item) return null;

  const contact = item.contactInfo || {};
  const seller = item.seller || item.reporter || {};
  const email = contact.email || seller.email || 'student@campus.edu';
  const phone = contact.phone || seller.phone || '';
  const preferred = contact.preferredMethod || 'Campus Meetup';

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Contact Student</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* User profile snippet */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <img
              src={seller.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${seller.name || 'user'}`}
              alt={seller.name || 'Student'}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">{seller.name || 'Campus Student'}</h4>
              <p className="text-xs text-slate-500">{seller.campus || 'Northwood University'}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                <span>Preferred: {preferred}</span>
              </div>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="space-y-2.5">
            {/* Email */}
            {email && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Campus Email</p>
                    <p className="text-xs font-semibold text-slate-800">{email}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(email, 'email')}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition"
                  title="Copy email"
                >
                  {copied === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Phone / WhatsApp */}
            {phone && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Phone / WhatsApp</p>
                    <p className="text-xs font-semibold text-slate-800">{phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(phone, 'phone')}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition"
                  title="Copy phone"
                >
                  {copied === 'phone' ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Handover location */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Meetup Location</p>
                <p className="text-xs font-semibold text-slate-800">{item.location || 'Campus Public Area'}</p>
              </div>
            </div>
          </div>

          {/* Safety note */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              For personal security, always complete exchanges in visible campus areas like the Student Union or Library lobby.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
