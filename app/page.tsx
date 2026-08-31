import type React from "react";
import BeerFmcgIntelligenceOSRaw from "../components/BeerFmcgIntelligenceOS";
import { getSupabaseClient } from "../lib/supabase";

type MarketAlert = {
  id: number | string;
  alert_type?: string;
  priority?: string;
  title: string;
  details?: string;
  strategic_action?: string;
  impact?: number;
  urgency?: number;
};

type MarketBrand = {
  id: number | string;
  brand_name: string;
  market_share_volume?: number | string;
};

type CompanyFinancial = {
  id: number | string;
  company_name: string;
  period?: string;
  net_revenue_vnd_bn?: number | string | null;
  yoy_revenue_growth_pct?: number | string | null;
  ad_promo_expense_vnd_bn?: number | string | null;
  is_full_year_target?: boolean | null;
  is_latest_actual?: boolean;
};

// Component gốc là file `.jsx` nên nhận props tự do; khai kiểu thủ công tại đây để tránh
// TypeScript tự suy luận ra `never[]` cho mảng rỗng mặc định trong component.


type BeerFmcgIntelligenceOSProps = {
  initialAlerts?: MarketAlert[];
  initialMarketShare?: MarketBrand[];
  initialFinancials?: CompanyFinancial[];
  dataError?: string | null;
};

const BeerFmcgIntelligenceOS: React.FC<BeerFmcgIntelligenceOSProps> =
  BeerFmcgIntelligenceOSRaw as unknown as React.FC<BeerFmcgIntelligenceOSProps>;

// Luôn fetch dữ liệu mới nhất từ Supabase mỗi lần có người tải trang — không cache tĩnh.

export const revalidate =
  0;
export const dynamic =
  "force-dynamic";

export default async function Home() {
  let alerts: MarketAlert[] = [];
  let brands: MarketBrand[] = [];
  let financials: CompanyFinancial[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = getSupabaseClient();

    const [alertsRes, brandsRes, financialsRes] = await Promise.all([
      supabase
        .from("market_alerts")
        .select("*")
        .order("impact", { ascending: false })
        .order("urgency", { ascending: false }),
      supabase
        .from("market_brands")
        .select("*")
        .order("market_share_volume", { ascending: false }),
      supabase
        .from("company_financials")
        .select("*")
        .order("company_name", { ascending: true }),
    ]);

    if (alertsRes.error) throw alertsRes.error;
    if (brandsRes.error) throw brandsRes.error;
    if (financialsRes.error) throw financialsRes.error;

    alerts = alertsRes.data ?? [];
    brands = brandsRes.data ?? [];
    financials = financialsRes.data ?? [];
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "Không thể kết nối Supabase";
    console.error("Lỗi tải dữ liệu từ Supabase:", message);
    fetchError = message;
  }

  return (
    <BeerFmcgIntelligenceOS
      initialAlerts={alerts}
      initialMarketShare={brands}
      initialFinancials={financials}
      dataError={fetchError}
    />
  );
}