import { useEffect, useState } from 'react';

// Cliente único del Web Worker de búsqueda.
const worker = new Worker(new URL('./search.worker.js', import.meta.url), { type: 'module' });

let status = { ready: false, chunks: 0, docs: 0, loadMs: 0, error: null };
let semStatus = { status: 'off', detail: '' };
const statusListeners = new Set();
const pending = new Map();
let reqSeq = 0;

function emit() {
  statusListeners.forEach((l) => l());
}

worker.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'ready') {
    status = { ready: true, chunks: m.chunks, docs: m.docs, loadMs: m.ms, error: null };
    emit();
  } else if (m.type === 'sem-status') {
    semStatus = { status: m.status, detail: m.detail };
    emit();
  } else if (m.type === 'debug-resources') {
    window.__visorWorkerResources = m.urls;
  } else if (m.type === 'results' || m.type === 'error') {
    const p = pending.get(m.reqId);
    if (p) {
      pending.delete(m.reqId);
      if (m.type === 'error') p.reject(new Error(m.error));
      else p.resolve(m);
    } else if (m.type === 'error') {
      status = { ...status, error: m.error };
      emit();
    }
  }
};
worker.postMessage({ type: 'init' });

export function search(query, { mode = 'keyword', sources = [] } = {}) {
  const reqId = ++reqSeq;
  return new Promise((resolve, reject) => {
    pending.set(reqId, { resolve, reject });
    worker.postMessage({ type: 'search', reqId, query, mode, sources });
  });
}

export function warmSemantic() {
  worker.postMessage({ type: 'warm-semantic' });
}

export function useSearchStatus() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((x) => x + 1);
    statusListeners.add(l);
    return () => statusListeners.delete(l);
  }, []);
  return { ...status, sem: semStatus };
}

// Diagnóstico: window.__visorDebug() guarda en window.__visorWorkerResources las URLs que pidió el worker.
window.__visorDebug = () => worker.postMessage({ type: 'debug-resources' });
