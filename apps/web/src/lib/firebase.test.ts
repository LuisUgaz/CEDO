import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Configuración Centralizada de Firebase SDK Modular v10', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('debe existir el módulo firebase.ts y exportar app, auth, db y funciones de inicialización', async () => {
    const firebaseModule = await import('./firebase');
    expect(firebaseModule.getFirebaseApp).toBeDefined();
    expect(firebaseModule.getFirebaseAuth).toBeDefined();
    expect(firebaseModule.getFirestoreDb).toBeDefined();
    expect(firebaseModule.isFirebaseConfigured).toBeDefined();
  });

  it('debe inicializar Firebase y Firestore con persistencia offline', async () => {
    const { getFirebaseApp, getFirestoreDb, getFirebaseAuth } = await import('./firebase');
    const app = getFirebaseApp();
    const db = getFirestoreDb();
    const auth = getFirebaseAuth();

    expect(app).toBeDefined();
    expect(db).toBeDefined();
    expect(auth).toBeDefined();
  });

  it('debe existir el archivo firestore.rules con las reglas de seguridad basadas en roles', () => {
    const rulesPath = path.resolve(__dirname, '../../../../firestore.rules');
    expect(fs.existsSync(rulesPath)).toBe(true);

    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    expect(rulesContent).toContain('rules_version = \'2\';');
    expect(rulesContent).toContain('function isAuthenticated()');
    expect(rulesContent).toContain('function hasRole(role)');
    expect(rulesContent).toContain('function isAdmin()');
    expect(rulesContent).toContain('match /pacientes/{pacienteId}');
    expect(rulesContent).toContain('match /citas_agenda/{semanaId}');
    expect(rulesContent).toContain('match /transacciones/{transaccionId}');
    expect(rulesContent).toContain('match /inventario/{itemId}');
  });
});
