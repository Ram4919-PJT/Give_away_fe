import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Build NGO report analytics from live platform data (no mock charts).
 */
export function useNgoReportData() {
  const { inventory, ngoBeneficiaries, ngoRequests } = useApp();

  return useMemo(() => {
    const inv = inventory || [];
    const beneficiaries = ngoBeneficiaries || [];
    const requests = ngoRequests || [];

    const totalInventory = inv.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
    const itemRequests = requests.filter((r) => r.type === 'Items');
    const fundRequests = requests.filter((r) => r.type === 'Financial');

    const categoryCounts = {};
    inv.forEach((i) => {
      const cat = i.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + (Number(i.qty) || 0);
    });

    const distribution = Object.entries(categoryCounts).map(([name, value], idx) => ({
      name,
      value,
      color: ['#22C55E', '#16A34A', '#4ADE80', '#86EFAC', '#BBF7D0'][idx % 5],
    }));

    return {
      kpis: {
        totalDonations: requests.length,
        itemsDistributed: totalInventory,
        activeBeneficiaries: beneficiaries.length,
        pendingRequests: requests.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length,
      },
      distribution,
      inventory: inv,
      beneficiaries,
      requests,
      itemRequests,
      fundRequests,
      empty: !inv.length && !beneficiaries.length && !requests.length,
    };
  }, [inventory, ngoBeneficiaries, ngoRequests]);
}
