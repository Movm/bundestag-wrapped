import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface DocSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export function DocSection({ children, className = '', delay = 0, id }: DocSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

interface SectionHeaderProps {
  tag: string;
  title: string;
  description?: string;
}

export function SectionHeader({ tag, title, description }: SectionHeaderProps) {
  return (
    <>
      <h2 className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
        {tag}
      </h2>
      <h3 className="text-2xl font-serif text-stone-900 mb-6">{title}</h3>
      {description && (
        <p className="text-stone-600 leading-relaxed mb-8">{description}</p>
      )}
    </>
  );
}

interface CodeBlockProps {
  children: ReactNode;
  title?: string;
  note?: string;
}

export function CodeBlock({ children, title, note }: CodeBlockProps) {
  return (
    <div className="bg-stone-900 rounded-xl p-6 text-white font-mono text-sm">
      {title && (
        <h4 className="font-mono text-xs text-stone-400 uppercase tracking-wider mb-4">
          {title}
        </h4>
      )}
      <div className="space-y-2">{children}</div>
      {note && (
        <div className="mt-6 pt-4 border-t border-stone-700 text-stone-400 text-xs">
          <strong className="text-stone-300">Hinweis:</strong> {note}
        </div>
      )}
    </div>
  );
}

interface InfoCardProps {
  children: ReactNode;
  className?: string;
}

export function InfoCard({ children, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-white border border-stone-200 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6">
      <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-sm font-mono mb-4">
        {number}
      </div>
      <h4 className="font-medium text-stone-900 mb-2">{title}</h4>
      <div className="text-sm text-stone-600 leading-relaxed">{children}</div>
    </div>
  );
}

interface StatBoxProps {
  value: string | number;
  label: string;
  className?: string;
}

export function StatBox({ value, label, className = '' }: StatBoxProps) {
  return (
    <div className={`bg-white border border-stone-200 rounded-lg p-6 text-center ${className}`}>
      <div className="text-3xl font-mono text-stone-900 mb-2">{value}</div>
      <div className="text-sm text-stone-600">{label}</div>
    </div>
  );
}

interface DownloadLinkProps {
  href: string;
  title: string;
  description: string;
  color: 'pink' | 'blue' | 'emerald' | 'stone';
}

export function DownloadLink({ href, title, description, color }: DownloadLinkProps) {
  const colorClasses = {
    pink: 'hover:border-pink-300 hover:bg-pink-50 group-hover:text-pink-600',
    blue: 'hover:border-blue-300 hover:bg-blue-50 group-hover:text-blue-600',
    emerald: 'hover:border-emerald-300 hover:bg-emerald-50 group-hover:text-emerald-600',
    stone: 'hover:border-stone-300 hover:bg-stone-100 group-hover:text-stone-600',
  };

  const dotColor = {
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    stone: 'bg-stone-500',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-4 bg-white border border-stone-200 rounded-lg transition-colors group ${colorClasses[color]}`}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-3 h-3 rounded-full ${dotColor[color]}`} />
          <span className="font-medium text-stone-900">{title}</span>
        </div>
        <p className="text-xs text-stone-500">{description}</p>
      </div>
      <div className={`flex items-center gap-2 text-stone-400 ${colorClasses[color].split(' ').pop()}`}>
        <span className="text-xs font-mono">JSON</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
    </a>
  );
}

export function FileIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
