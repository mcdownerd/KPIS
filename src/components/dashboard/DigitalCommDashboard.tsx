import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useDigitalCommData } from "@/hooks/useDigitalCommData";
import { Loader2, TrendingUp, Cloud, Star, MessageSquare, Zap, Award, CheckCircle2, BarChart3, Target, Package } from "lucide-react";
import { upsertDigitalCommMetricsForStore, upsertQualityMetrics, upsertUberMetrics } from "@/lib/api/service";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DigitalCommDashboard() {
  const {
    mloversData: initialMlovers,
    googleData: initialGoogle,
    uberStarsData: initialUberStars,
    uberTimesData: initialUberTimes,
    uberInaccuracyData: initialUberInaccuracy,
    uberAvailabilityData: initialUberAvailability,
    uberTotalTimeData: initialUberTotalTime,
    deliveryData: initialDelivery,
    qualityData: initialQuality,

    loading,
    error,
    refetch
  } = useDigitalCommData();

  const [mlovers, setMlovers] = useState<any[]>([]);
  const [google, setGoogle] = useState<any[]>([]);

  // Uber States
  const [uberStars, setUberStars] = useState<any[]>([]);
  const [uberTimes, setUberTimes] = useState<any[]>([]);
  const [uberInaccuracy, setUberInaccuracy] = useState<any[]>([]);
  const [uberAvailability, setUberAvailability] = useState<any[]>([]);
  const [uberTotalTime, setUberTotalTime] = useState<any[]>([]);

  const [delivery, setDelivery] = useState<any[]>([]);
  const [quality, setQuality] = useState<any[]>([]);


  const [savingCell, setSavingCell] = useState<string | null>(null);

  useEffect(() => {
    if (initialMlovers) setMlovers(JSON.parse(JSON.stringify(initialMlovers)));
    if (initialGoogle) setGoogle(JSON.parse(JSON.stringify(initialGoogle)));

    if (initialUberStars) setUberStars(JSON.parse(JSON.stringify(initialUberStars)));
    if (initialUberTimes) setUberTimes(JSON.parse(JSON.stringify(initialUberTimes)));
    if (initialUberInaccuracy) setUberInaccuracy(JSON.parse(JSON.stringify(initialUberInaccuracy)));
    if (initialUberAvailability) setUberAvailability(JSON.parse(JSON.stringify(initialUberAvailability)));
    if (initialUberTotalTime) setUberTotalTime(JSON.parse(JSON.stringify(initialUberTotalTime)));

    if (initialDelivery) setDelivery(JSON.parse(JSON.stringify(initialDelivery)));
    if (initialQuality) setQuality(JSON.parse(JSON.stringify(initialQuality)));

  }, [initialMlovers, initialGoogle, initialUberStars, initialUberTimes, initialUberInaccuracy, initialUberAvailability, initialUberTotalTime, initialDelivery, initialQuality]);

  const handleValueChange = (type: string, location: string, month: string, value: string) => {
    const setter = {
      mlovers: setMlovers,
      google: setGoogle,
      uberStars: setUberStars,
      uberTimes: setUberTimes,
      uberInaccuracy: setUberInaccuracy,
      uberAvailability: setUberAvailability,
      uberTotalTime: setUberTotalTime,
      delivery: setDelivery,
      quality: setQuality
    }[type];

    if (setter) {
      setter((prev: any[]) => prev.map(item => {
        if (item.location === location) {
          return { ...item, [month]: value };
        }
        return item;
      }));
    }
  };

  const handleAutoSave = async (type: string, location: string, monthKey: string, value: string) => {
    const initialDataMap: Record<string, any[]> = {
      mlovers: initialMlovers,
      google: initialGoogle,
      uberStars: initialUberStars,
      uberTimes: initialUberTimes,
      uberInaccuracy: initialUberInaccuracy,
      uberAvailability: initialUberAvailability,
      uberTotalTime: initialUberTotalTime,
      delivery: initialDelivery,
      quality: initialQuality
    };

    const originalValue = initialDataMap[type]?.find(item => item.location === location)?.[monthKey];
    if (parseFloat(value) === parseFloat(originalValue as string)) return;

    const cellId = `${type}-${location}-${monthKey}`;
    try {
      setSavingCell(cellId);

      const storeId = location === 'Queluz'
        ? 'fcf80b5a-b658-48f3-871c-ac62120c5a78'
        : 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf';

      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const monthIdx = shortMonths.indexOf(monthKey);
      const val = parseFloat(value);
      if (isNaN(val)) return;

      const recordDate = new Date(2025, monthIdx, 1).toISOString().split('T')[0];

      if (type === 'mlovers' || type === 'google' || type === 'delivery') {
        await upsertDigitalCommMetricsForStore({
          month_name: monthNames[monthIdx],
          record_date: recordDate,
          [type === 'mlovers' ? 'mlovers' : type === 'google' ? 'google_rating' : 'delivery_rating']: val
        }, storeId);
      } else if (type.startsWith('uber')) {
        // Map frontend type to DB field
        const fieldMap: Record<string, string> = {
          'uberStars': 'estrelas',
          'uberTimes': 'tempos',
          'uberInaccuracy': 'inexatidao',
          'uberAvailability': 'ava_produto',
          'uberTotalTime': 'tempo_total'
        };

        await upsertUberMetrics({
          month_name: monthNames[monthIdx],
          record_date: recordDate,
          store_id: storeId,
          [fieldMap[type]]: val
        });
      } else if (type === 'quality') {
        await upsertQualityMetrics({
          month_name: monthNames[monthIdx],
          record_date: recordDate,
          sg: val
        }); // Note: upsertQualityMetrics uses getUserStore() which might need storeId parameter if we want to save for specific store
      }

      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Erro ao salvar ${monthKey} para ${location}`);
    } finally {
      setSavingCell(null);
    }
  };

  const calculateYTD = (data: any[]) => {
    if (!data || data.length === 0) return 0;
    const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    let total = 0;
    let count = 0;
    data.forEach(item => {
      shortMonths.forEach(m => {
        const val = parseFloat(item[m]);
        if (!isNaN(val) && val > 0) {
          total += val;
          count++;
        }
      });
    });
    return count > 0 ? (total / count).toFixed(2) : '0,00';
  };

  const getLatestValue = (data: any[], location: string) => {
    const item = data.find(i => i.location === location);
    if (!item) return '-';
    const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    for (let i = shortMonths.length - 1; i >= 0; i--) {
      const val = item[shortMonths[i]];
      if (val && parseFloat(val) > 0) return val;
    }
    return '-';
  };

  if (loading && mlovers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  return (
    <div className="space-y-4 pb-4">




      {/* --- DIGITAL COMMUNICATION SECTION --- */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Cloud className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">Comunicação Digital</h3>
        </div>

        {/* Google Ratings Summary */}
        <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/50 h-8">
                <TableHead className="font-bold text-foreground text-[10px] h-8 py-1 px-2">Google</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">Amadora</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">VAR</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">Ava. Total</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">Ava. Mês</TableHead>
                <TableHead className="font-bold text-foreground border-l border-border/50 text-[10px] h-8 py-1 px-2">Queluz</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">VAR</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">Ava. Total</TableHead>
                <TableHead className="text-center text-[10px] h-8 py-1 px-1">Ava. Mês</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/10 border-b border-border/50 h-8">
                <TableCell className="font-medium bg-muted/20 text-[10px] h-8 py-1 px-2">Rating</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">{getLatestValue(google, 'Amadora')}</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">-</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">3629</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">22</TableCell>
                <TableCell className="text-center border-l border-border/50 text-[10px] h-8 py-1 px-2">{getLatestValue(google, 'Queluz')}</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">-</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">3558</TableCell>
                <TableCell className="text-center text-[10px] h-8 py-1 px-1">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Google Monthly Evolution */}
        <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50 h-8">
                <TableHead className="font-bold text-foreground bg-muted/50 text-[10px] h-8 py-1 px-2">Google</TableHead>
                {shortMonths.map(m => (
                  <TableHead key={m} className="text-center capitalize text-[10px] h-8 py-1 px-1">{m}</TableHead>
                ))}
                <TableHead className="text-center font-bold text-primary bg-primary/5 text-[10px] h-8 py-1 px-2">OBJETIVO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {google.map((item) => (
                <TableRow key={item.location} className="border-b border-border/50 hover:bg-muted/10 h-9">
                  <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2">{item.location}</TableCell>
                  {shortMonths.map(m => (
                    <TableCell key={m} className="p-0 relative h-9">
                      <div className="flex items-center justify-center h-full">
                        <Input
                          type="number"
                          step="0.1"
                          value={item[m] || ''}
                          onChange={(e) => handleValueChange('google', item.location, m, e.target.value)}
                          onBlur={(e) => handleAutoSave('google', item.location, m, e.target.value)}
                          className={`h-7 w-14 text-center bg-transparent border border-border/30 focus:ring-1 focus:ring-primary/50 transition-colors text-[10px] px-1 ${savingCell === `google-${item.location}-${m}` ? 'opacity-50' : ''}`}
                        />
                      </div>
                      {savingCell === `google-${item.location}-${m}` && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2">{item.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* MLovers Monthly Evolution (Existing) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">Evolução Mensal Mlovers</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
              <Cloud className="h-3 w-3" />
              <span>Salvamento automático ativado</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50 h-8">
                  <TableHead className="font-bold text-foreground bg-muted/50 text-[10px] h-8 py-1 px-2">Mlovers</TableHead>
                  {shortMonths.map(m => (
                    <TableHead key={m} className="text-center capitalize text-[10px] h-8 py-1 px-1">{m}</TableHead>
                  ))}
                  <TableHead className="text-center font-bold text-primary bg-primary/5 text-[10px] h-8 py-1 px-2">OBJETIVO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mlovers.map((item) => (
                  <TableRow key={item.location} className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2">{item.location}</TableCell>
                    {shortMonths.map(m => (
                      <TableCell key={m} className="p-0 relative h-9">
                        <div className="flex items-center justify-center h-full">
                          <Input
                            type="number"
                            step="0.1"
                            value={item[m] || ''}
                            onChange={(e) => handleValueChange('mlovers', item.location, m, e.target.value)}
                            onBlur={(e) => handleAutoSave('mlovers', item.location, m, e.target.value)}
                            className={`h-7 w-14 text-center bg-transparent border border-border/30 focus:ring-1 focus:ring-primary/50 transition-colors text-[10px] px-1 ${savingCell === `mlovers-${item.location}-${m}` ? 'opacity-50' : ''
                              }`}
                          />
                        </div>
                        {savingCell === `mlovers-${item.location}-${m}` && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                          </div>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2">
                      {item.target}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* --- UBER SECTION --- */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center gap-2 px-1">
            <Package className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">Uber</h3>
          </div>

          <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50 h-8">
                  <TableHead className="w-[150px] bg-muted/50"></TableHead>
                  {shortMonths.map(m => (
                    <TableHead key={m} className="text-center capitalize text-[10px] h-8 py-1 px-1">{m}</TableHead>
                  ))}
                  <TableHead className="text-center font-bold text-[10px] h-8 py-1 px-2">YTD</TableHead>
                  <TableHead className="text-center font-bold text-[10px] h-8 py-1 px-2">LY</TableHead>
                  <TableHead className="text-center font-bold text-primary bg-primary/5 text-[10px] h-8 py-1 px-2">OBJETIVO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['Amadora', 'Queluz'].map((store) => (
                  <>
                    {/* Store Header */}
                    <TableRow key={`${store}-header`} className="hover:bg-transparent border-b border-border/50 h-8 bg-green-100 dark:bg-green-900/30">
                      <TableCell colSpan={16} className="text-center font-bold text-xs uppercase tracking-wider py-1 text-green-800 dark:text-green-300">
                        {store}
                      </TableCell>
                    </TableRow>

                    {/* Metrics Rows */}
                    {[
                      { label: 'ESTRELAS', data: uberStars, type: 'uberStars' },
                      { label: 'TEMPOS', data: uberTimes, type: 'uberTimes' },
                      { label: 'INEXATIDÃO', data: uberInaccuracy, type: 'uberInaccuracy' },
                      { label: 'AVA. PRODUTO', data: uberAvailability, type: 'uberAvailability' },
                      { label: 'TEMPO TOTAL', data: uberTotalTime, type: 'uberTotalTime' }
                    ].map((metric) => {
                      const item = metric.data.find(i => i.location === store);
                      if (!item) return null;

                      return (
                        <TableRow key={`${store}-${metric.type}`} className="border-b border-border/50 hover:bg-muted/10 h-9">
                          <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 uppercase">{metric.label}</TableCell>
                          {shortMonths.map(m => (
                            <TableCell key={m} className="p-0 relative h-9">
                              <div className="flex items-center justify-center h-full">
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={item[m] || ''}
                                  onChange={(e) => handleValueChange(metric.type, store, m, e.target.value)}
                                  onBlur={(e) => handleAutoSave(metric.type, store, m, e.target.value)}
                                  className={`h-7 w-14 text-center bg-transparent border border-border/30 focus:ring-1 focus:ring-primary/50 transition-colors text-[10px] px-1 ${savingCell === `${metric.type}-${store}-${m}` ? 'opacity-50' : ''}`}
                                />
                              </div>
                              {savingCell === `${metric.type}-${store}-${m}` && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                                </div>
                              )}
                            </TableCell>
                          ))}
                          {/* YTD Column */}
                          <TableCell className="text-center text-[10px] h-9 py-1 px-2 bg-muted/10 font-medium">
                            {calculateYTD([item])}
                          </TableCell>
                          {/* LY Column (Placeholder) */}
                          <TableCell className="text-center text-[10px] h-9 py-1 px-2 text-muted-foreground">
                            -
                          </TableCell>
                          {/* Target Column */}
                          <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2">
                            {item.target}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Delivery Monthly Evolution */}
        <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50 h-8">
                <TableHead className="font-bold text-foreground bg-muted/50 text-[10px] h-8 py-1 px-2">Delivery</TableHead>
                {shortMonths.map(m => (
                  <TableHead key={m} className="text-center capitalize text-[10px] h-8 py-1 px-1">{m}</TableHead>
                ))}
                <TableHead className="text-center font-bold text-primary bg-primary/5 text-[10px] h-8 py-1 px-2">OBJETIVO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delivery.map((item) => (
                <TableRow key={item.location} className="border-b border-border/50 hover:bg-muted/10 h-9">
                  <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2">{item.location}</TableCell>
                  {shortMonths.map(m => (
                    <TableCell key={m} className="p-0 relative h-9">
                      <div className="flex items-center justify-center h-full">
                        <Input
                          type="number"
                          step="0.1"
                          value={item[m] || ''}
                          onChange={(e) => handleValueChange('delivery', item.location, m, e.target.value)}
                          onBlur={(e) => handleAutoSave('delivery', item.location, m, e.target.value)}
                          className={`h-7 w-14 text-center bg-transparent border border-border/30 focus:ring-1 focus:ring-primary/50 transition-colors text-[10px] px-1 ${savingCell === `delivery-${item.location}-${m}` ? 'opacity-50' : ''}`}
                        />
                      </div>
                      {savingCell === `delivery-${item.location}-${m}` && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2">{item.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>


      </section>
    </div>
  );
}
