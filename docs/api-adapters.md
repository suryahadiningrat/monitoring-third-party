# API Adapters — Third Party Service Monitor

## Arsitektur Adapter

Setiap layanan third party memiliki adapter tersendiri yang mengimplementasikan interface yang sama.  
Adapter bertanggung jawab untuk mengambil data live (balance, usage, billing) dari API masing-masing layanan.

---

## Base Interface

```typescript
// src/adapters/base.adapter.ts

export interface AdapterConfig {
  apiKey?: string;
  secretKey?: string;
  appId?: string;
  [key: string]: string | undefined;
}

export interface AdapterResult {
  success: boolean;
  data?: {
    balance?: number;
    balanceCurrency?: string;
    usagePercent?: number;
    usageLabel?: string;
    nextBillingAmount?: number;
    renewalDate?: string;
    planName?: string;
    raw?: Record<string, unknown>;
  };
  error?: string;
  lastSynced: string;
}

export interface ServiceAdapter {
  name: string;
  fetchStatus(config: AdapterConfig): Promise<AdapterResult>;
}
```

---

## Status API Per Layanan

| Layanan | API Tersedia | Endpoint | Catatan |
|---------|-------------|---------|---------|
| Niagahoster | ❌ Tidak ada public API | - | Manual only |
| Webpushr | ✅ Ada | `https://api.webpushr.com/v1/` | Butuh API key |
| Mailjet | ✅ Ada | `https://api.mailjet.com/v3/` | Butuh API key + secret |
| Ahrefs | ✅ Ada | `https://api.ahrefs.com/v3/` | Butuh API token |
| Semrush | ✅ Ada | `https://api.semrush.com/` | Butuh API key |
| me-QR Code | ⚠️ Terbatas | - | Cek manual |
| Rumahweb | ❌ Tidak ada public API | - | Manual only |
| Elastic Email | ✅ Ada | `https://api.elasticemail.com/v4/` | Butuh API key |
| Qiscus | ✅ Ada | `https://api3.qiscus.com/` | Butuh App ID + secret |
| Adsmedia | ⚠️ Terbatas | - | Cek dokumentasi |
| Google Drive | ✅ Ada (Google APIs) | `https://www.googleapis.com/drive/v3/` | Butuh OAuth2 |
| Zoom | ✅ Ada | `https://api.zoom.us/v2/` | Butuh OAuth2 / Server-to-Server |

---

## Implementasi Adapter Per Layanan

### Webpushr
```typescript
// src/adapters/webpushr.ts
export const webpushrAdapter: ServiceAdapter = {
  name: 'Webpushr',
  async fetchStatus(config) {
    try {
      const res = await fetch('https://api.webpushr.com/v1/subscriber/count', {
        headers: {
          'webpushrKey': config.apiKey!,
          'webpushrAuthToken': config.secretKey!,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return {
        success: true,
        data: {
          usageLabel: `${data.total_count} subscribers`,
          raw: data,
        },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Mailjet
```typescript
// src/adapters/mailjet.ts
export const mailjetAdapter: ServiceAdapter = {
  name: 'Mailjet',
  async fetchStatus(config) {
    const credentials = btoa(`${config.apiKey}:${config.secretKey}`);
    try {
      const res = await fetch('https://api.mailjet.com/v3/REST/message?Limit=1', {
        headers: { Authorization: `Basic ${credentials}` },
      });
      const data = await res.json();
      return {
        success: true,
        data: { usageLabel: `${data.Total} messages sent`, raw: data },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Elastic Email
```typescript
// src/adapters/elastic-email.ts
export const elasticEmailAdapter: ServiceAdapter = {
  name: 'Elastic Email',
  async fetchStatus(config) {
    try {
      const res = await fetch(
        `https://api.elasticemail.com/v4/statistics?apikey=${config.apiKey}`
      );
      const data = await res.json();
      return {
        success: true,
        data: {
          usageLabel: `${data.EmailsSent || 0} emails sent this month`,
          raw: data,
        },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Ahrefs
```typescript
// src/adapters/ahrefs.ts
export const ahrefsAdapter: ServiceAdapter = {
  name: 'Ahrefs',
  async fetchStatus(config) {
    try {
      const res = await fetch('https://api.ahrefs.com/v3/account/subscription', {
        headers: { Authorization: `Bearer ${config.apiKey}` },
      });
      const data = await res.json();
      return {
        success: true,
        data: {
          planName: data.subscription?.plan_name,
          renewalDate: data.subscription?.next_billing_date,
          raw: data,
        },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Semrush
```typescript
// src/adapters/semrush.ts
export const semrushAdapter: ServiceAdapter = {
  name: 'Semrush',
  async fetchStatus(config) {
    try {
      const res = await fetch(
        `https://api.semrush.com/?type=api_units&key=${config.apiKey}`
      );
      const text = await res.text();
      const units = parseInt(text.trim(), 10);
      return {
        success: true,
        data: {
          balance: units,
          usageLabel: `${units.toLocaleString()} API units remaining`,
          raw: { units },
        },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Qiscus
```typescript
// src/adapters/qiscus.ts
export const qiscusAdapter: ServiceAdapter = {
  name: 'Qiscus',
  async fetchStatus(config) {
    try {
      const res = await fetch(
        `https://api3.qiscus.com/api/v2.1/rest/user_stat`,
        {
          headers: {
            'QISCUS-SDK-APP-ID': config.appId!,
            'QISCUS-SDK-SECRET': config.secretKey!,
          },
        }
      );
      const data = await res.json();
      return {
        success: true,
        data: {
          usageLabel: `${data.results?.total_users || 0} total users`,
          raw: data,
        },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Zoom (Server-to-Server OAuth)
```typescript
// src/adapters/zoom.ts
// Zoom menggunakan OAuth2 — perlu exchange client_id + client_secret ke access_token dulu
export const zoomAdapter: ServiceAdapter = {
  name: 'Zoom',
  async fetchStatus(config) {
    try {
      // Step 1: get access token
      const tokenRes = await fetch('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + config.accountId, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${config.apiKey}:${config.secretKey}`),
        },
      });
      const { access_token } = await tokenRes.json();

      // Step 2: get subscription info
      const planRes = await fetch('https://api.zoom.us/v2/accounts/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const data = await planRes.json();
      return {
        success: true,
        data: {
          planName: data.plan_type || 'Pro',
          raw: data,
        },
        lastSynced: new Date().toISOString(),
      };
    } catch (e) {
      return { success: false, error: String(e), lastSynced: new Date().toISOString() };
    }
  },
};
```

### Manual Adapters (Niagahoster, Rumahweb, Adsmedia, me-QR)
```typescript
// src/adapters/manual.ts
export const manualAdapter: ServiceAdapter = {
  name: 'Manual',
  async fetchStatus(_config) {
    return {
      success: false,
      error: 'Layanan ini tidak memiliki API publik. Perbarui data secara manual.',
      lastSynced: new Date().toISOString(),
    };
  },
};
```

---

## Registry Adapter

```typescript
// src/adapters/index.ts
import { webpushrAdapter } from './webpushr';
import { mailjetAdapter } from './mailjet';
import { ahrefsAdapter } from './ahrefs';
import { semrushAdapter } from './semrush';
import { elasticEmailAdapter } from './elastic-email';
import { qiscusAdapter } from './qiscus';
import { zoomAdapter } from './zoom';
import { manualAdapter } from './manual';

export const adapterRegistry: Record<string, ServiceAdapter> = {
  'Webpushr Push Notif': webpushrAdapter,
  'Mailjet Email Marketing': mailjetAdapter,
  'Ahrefs': ahrefsAdapter,
  'Semrush': semrushAdapter,
  'Elastic Email': elasticEmailAdapter,
  'Qiscus WA Notif': qiscusAdapter,
  'Zoom Pro': zoomAdapter,
  // Default fallback
  default: manualAdapter,
};

export function getAdapter(serviceName: string): ServiceAdapter {
  return adapterRegistry[serviceName] ?? adapterRegistry.default;
}
```

---

## Catatan CORS

Beberapa API mungkin memblokir request langsung dari browser (CORS).  
Jika terjadi CORS error, solusi:
1. Tambahkan proxy sederhana menggunakan Vite proxy di `vite.config.ts`
2. Atau buat endpoint backend minimal (Express/Hono) sebagai proxy layer
3. Atau gunakan Cloudflare Workers sebagai proxy gratis

```typescript
// vite.config.ts — contoh proxy untuk Mailjet
export default defineConfig({
  server: {
    proxy: {
      '/api/mailjet': {
        target: 'https://api.mailjet.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mailjet/, ''),
      },
    },
  },
});
```