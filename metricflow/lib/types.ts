export interface Agency {
  id: string;
  name: string;
  primary_color: string;
  theme_mode: string;
  owner_id: string;
  created_at?: string;
}

export interface Client {
  id: string;
  agency_id: string;
  name: string;
  platform: string[];
  target_cpa?: number;
  meta_access_token?: string;
  meta_ad_account_id?: string; // <--- LE NOUVEAU CHAMP OBLIGATOIRE
  created_at?: string;
}

export interface ClientPerformance {
  id: string;
  client_id: string;
  month: string;
  platform: string;
  spend: number;
  clicks: number;
  conversions: number;
  created_at?: string;
}