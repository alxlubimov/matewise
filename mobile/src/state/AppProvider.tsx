import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from '../domain/model';
import { initialState, groups as demoGroups, people } from '../data/demo';
import { reducer, type Action } from './reducer';
import { parseDemoState } from './persistence';
const KEY = 'matewise:demo:v1';
const Context = createContext<{ state: AppState; ready: boolean; error: string | null; dispatch: (a: Action) => void } | null>(null);
// Storage contains public demo data only: no passwords, tokens or real accounts.
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef(Promise.resolve());
  useEffect(() => { let alive = true;
    AsyncStorage.getItem(KEY).then(value => { if (value && alive) setState(parseDemoState(value)); }).catch(() => { if (alive) setError('Не удалось прочитать сохранённое демо. Открыты учебные данные.'); }).finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const serialized = JSON.stringify(state);
    queue.current = queue.current.then(() => AsyncStorage.setItem(KEY, serialized)).catch(() => setError('Изменения работают, но сохранить их на устройстве не удалось.'));
  }, [state, ready]);
  return <Context.Provider value={{ state, ready, error, dispatch: action => setState(current => reducer(current, action)) }}>{children}</Context.Provider>;
}
export function useApp() { const context = useContext(Context); if (!context) throw new Error('AppProvider missing'); return context; }
export function useCatalog() {
  const { state } = useApp();
  return { groups: state.customGroup ? [...demoGroups, state.customGroup] : demoGroups, person: (id: string) => id === state.profile.id ? state.profile : people.find(p => p.id === id)! };
}
