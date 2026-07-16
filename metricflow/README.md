# MetricFlow OS

## Description du Projet
MetricFlow OS est une infrastructure SaaS Multi-Tenant développée pour les agences de marketing digital. 
**Problématique :** Les agences perdent un temps critique sur la consolidation manuelle des données publicitaires (Meta, Google) et réagissent trop lentement face aux baisses de rentabilité de leurs clients.
**Solution :** Une plateforme web centralisée permettant la création de portefeuilles clients isolés, l'aspiration automatisée des données via la Graph API de Meta, un portail en marque blanche, et la génération d'audits stratégiques via une Intelligence Artificielle (Gemini).

## Technologies Utilisées
- **Framework :** Next.js 16 (App Router, Server-Side Rendering)
- **Front-end :** React 19, TailwindCSS, Framer Motion, Recharts
- **Base de données & Auth :** Supabase (PostgreSQL, Row Level Security, Auth)
- **IA & APIs :** Google GenAI SDK (Gemini 2.5 Flash), Meta Graph API (OAuth 2.0)

## Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Front-End (Navigateur Client)"]
        UI["Interface React / Next.js"]
        Viz["Recharts & Framer Motion"]
    end

    subgraph Server ["Serveur Next.js (App Router)"]
        Middleware{"proxy.ts (Middleware)"}
        API_Meta["Route API /api/auth/meta/callback"]
        API_AI["Route API /api/report"]
    end

    subgraph Database ["Infrastructure Supabase"]
        Auth["Supabase Auth"]
        RLS{"PostgreSQL RLS"}
        DB[("PostgreSQL BDD")]
    end

    subgraph External ["Services Tiers"]
        Meta["Meta Graph API"]
        Gemini["Google GenAI"]
    end

    %% Flux Frontend
    UI -->|Requête| Middleware
    Middleware -->|Redirection| UI
    UI <-->|Login| Auth
    Auth -->|Set JWT Cookie| UI
    UI -->|Render| Viz

    %% Flux Base de données
    UI -->|Requêtes| RLS
    RLS -->|Filtre| DB
    DB -->|Données| UI

    %% Flux API AI
    UI -->|Stats Client| API_AI
    API_AI <-->|"Prompt Engineering"| Gemini
    API_AI -->|Rapport| UI

    %% Flux API Meta
    UI -->|OAuth| Meta
    Meta -->|Code Auth| API_Meta
    API_Meta <-->|"Échange Token (Long Lived)"| Meta
    API_Meta -->|Update Token| DB

    ## Base de Données

```mermaid
erDiagram
    USERS ||--o{ AGENCIES : "possède"
    AGENCIES ||--o{ AGENCY_CLIENTS : "gère"
    AGENCY_CLIENTS ||--o{ CLIENT_PERFORMANCES : "analyse"

    USERS {
        uuid id PK
        string email
        string encrypted_password
    }
    AGENCIES {
        uuid id PK
        uuid owner_id FK
        string name
        string primary_color
        string theme_mode
        timestamp created_at
    }
    AGENCY_CLIENTS {
        uuid id PK
        uuid agency_id FK
        string name
        text[] platform
        float target_cpa
        string meta_access_token
        string meta_ad_account_id
        timestamp created_at
    }
    CLIENT_PERFORMANCES {
        uuid id PK
        uuid client_id FK
        string month
        string platform
        float spend
        integer clicks
        integer conversions
        timestamp created_at
    }