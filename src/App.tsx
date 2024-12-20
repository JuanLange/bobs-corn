import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Toaster, toast } from "sonner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import api from './lib/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts'

interface Purchase {
  client_ip: string
  total_purchases: number
  last_purchase: string
}

interface DailyPurchase {
  date: string
  total: number
}

function App() {
  const [loading, setLoading] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [dailyPurchases, setDailyPurchases] = useState<DailyPurchase[]>([])
  const [userPurchases, setUserPurchases] = useState(0)
  const [nextAvailable, setNextAvailable] = useState<Date | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [timeProgress, setTimeProgress] = useState(100)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isWaiting, setIsWaiting] = useState(false)

  const parseUTCDate = (dateString: string): Date => {
    const date = new Date(dateString);
    const utcDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    );
    return utcDate;
  }

  const fetchPurchases = async () => {
    try {
      const response = await api.get('/corn/history');
      setPurchases(response.data.history || []);
      setDailyPurchases(response.data.dailyPurchases || []);
    } catch (error: any) {
      console.error('Error fetching purchases:', error?.response?.data || error);
      toast.error('Error loading purchase history');
    }
  };

  const startWaitingTimer = (nextAvailableTime: Date) => {
    setIsWaiting(true);
    setNextAvailable(nextAvailableTime);
    setTimeProgress(0);
  }

  const handleBuyClick = async () => {
    if (loading) return;

    // Si está esperando, mostrar mensaje pero no hacer la petición
    if (isWaiting) {
      const remainingSeconds = nextAvailable ? 
        Math.ceil((nextAvailable.getTime() - new Date().getTime()) / 1000) : 60;
      toast.error(`${remainingSeconds} seconds until your next purchase`);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/corn/buy');
      setUserPurchases(response.data.totalPurchases);
      toast.success(response.data.message);
      
      // Iniciar el timer para la próxima compra
      const now = new Date();
      const nextAvailable = new Date(now.getTime() + 60000); // 1 minuto desde ahora
      startWaitingTimer(nextAvailable);
      
      await fetchPurchases();
    } catch (error: any) {
      if (error.response?.status === 429) {
        // Convertimos la fecha UTC a local
        const nextTime = parseUTCDate(error.response.data.nextAvailable);
        toast.error(error.response.data.message);
        startWaitingTimer(nextTime);
      } else {
        toast.error('Error al comprar maíz');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (!isWaiting || !nextAvailable) {
      return;
    }

    const updateProgress = () => {
      const now = new Date();
      const total = 60 * 1000; // 60 segundos en ms
      const remaining = nextAvailable.getTime() - now.getTime();
      const elapsed = total - remaining;
      const progress = Math.max(0, Math.min(100, (elapsed / total) * 100));

      if (remaining <= 0) {
        setIsWaiting(false);
        setTimeProgress(100);
        setTimeLeft('');
        toast.success('You can buy corn now! 🌽');
        return;
      }

      setTimeProgress(progress);
      setTimeLeft(`${Math.ceil(remaining / 1000)}s`);
    }

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [isWaiting, nextAvailable]);

  useEffect(() => {
    const interval = setInterval(fetchPurchases, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="container mx-auto p-4 relative min-h-screen">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-4xl font-semibold text-white text-center text-[3.75rem] leading-[3.75rem] tracking-tight mb-8">
          welcome to<br /> 
          <span className="drop-shadow-lg">Bob's Corn Farm</span>
        </h1>
        
        {/* Nubes y Maíz */}
        <div className="relative w-full max-w-[34.375rem] h-[30vh] mb-8">
          <img 
            src="/images/cloud.svg" 
            alt="Cloud 1" 
            className="absolute w-[8.5625rem] left-0 top-[9.375rem] animate-float-slow drop-shadow-custom"
          />
          <img 
            src="/images/cloud.svg" 
            alt="Cloud 2" 
            className="absolute w-[5.375rem] left-[3.25rem] top-[1.8125rem] animate-float-medium drop-shadow-custom"
          />
          <img 
            src="/images/cloud.svg" 
            alt="Cloud 3" 
            className="absolute w-[2.5rem] left-[21.6875rem] top-0 animate-float-fast drop-shadow-custom"
          />
          <img 
            src="/images/cloud.svg" 
            alt="Cloud 4" 
            className="absolute w-[4.5625rem] left-[27.375rem] top-[3.5625rem] animate-float-fast drop-shadow-custom"
          />
          <img 
            src="/images/cloud.svg" 
            alt="Cloud 5" 
            className="absolute w-[6.875rem] right-0 top-[8.9375rem] animate-float-fast drop-shadow-custom"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/images/corn.png" 
              alt="Corn" 
              className="w-[14.1875rem] animate-bounce-slow"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 mb-6">
          {/* Progreso de tiempo */}
          <div className="flex justify-between ml-[1.5rem]">
            <span className="text-sm font-medium text-white">
              {isWaiting 
                ? `Next purchase ${timeLeft}`
                : 'You can buy now 🌽'}
            </span>
          </div>
          <div className="w-[18.75rem] max-w-xs bg-white/90 backdrop-blur-sm rounded-full p-6 ">
            <Progress 
              value={timeProgress} 
              className="h-2 bg-emerald-400/25"
            />
          </div>          
        </div>
        {/* Botón de compra */}
        <Button 
          onClick={handleBuyClick}
          disabled={loading}
          className="w-[18.75rem] max-w-xs text-[2.375rem] p-8 rounded-full bg-emerald-400 hover:bg-emerald-500 text-white font-semibold shadow-lg transition-all"
        >
          {loading ? 'Buying...' : 'Buy Corn'}
        </Button>

        

        <AnimatePresence>
          <motion.div
            initial={{ y: "calc(100% - 75px)" }}
            animate={{ y: isDetailOpen ? "25%" : "calc(100% - 75px)" }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-40"
            style={{ height: "75vh" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[75px] flex justify-center items-center">
              <motion.button
                onClick={() => setIsDetailOpen(!isDetailOpen)}
                className="w-[4rem] h-[4rem] bg-white border-emerald-400 border-4 backdrop-blur-sm rounded-full shadow-lg transition-transform hover:scale-105 relative top-[-37px] flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
              >
                <span className="text-emerald-400 font-bold text-[3rem] flex items-center justify-center pb-[0.6rem]">{isDetailOpen ? '−' : '+'}</span>
              </motion.button>
            </div>

            <div className="p-6 h-full overflow-y-auto pb-[400px] mt-[75px]">
              <div className="max-w-4xl mx-auto space-y-8">
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    {dailyPurchases && dailyPurchases.length > 0 && (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={dailyPurchases}>
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => {
                              return format(new Date(value), 'dd/MM')
                            }}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                            formatter={(value: number) => [value, 'Compras']}
                          />
                          <Bar 
                            dataKey="total" 
                            fill="#64E0BC"
                            radius={[50, 50, 0, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Compras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>Purchase History</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client IP</TableHead>
                          <TableHead>Total Purchases</TableHead>
                          <TableHead>Last Purchase</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchases?.map((purchase) => (
                          <TableRow key={`${purchase.client_ip}-${purchase.last_purchase}`}>
                            <TableCell>{purchase.client_ip}</TableCell>
                            <TableCell>{purchase.total_purchases}</TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(purchase.last_purchase), {
                                addSuffix: true,
                                locale: es,
                                includeSeconds: true
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App
