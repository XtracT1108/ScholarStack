import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Play,
  FileText,
  BarChart3,
  Table as TableIcon,
  ChevronRight,
  ChevronLeft,
  Info,
  Calculator,
  Settings,
  Copy,
  FileSpreadsheet,
  Sun,
  Moon,
  Image as ImageIcon
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Radar, Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { calculateGarrettRanking, RespondentData, GarrettResult } from '../lib/garrett';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RespondentRow = React.memo(({
  resp,
  factors,
  updateRanking
}: {
  resp: RespondentData;
  factors: string[];
  updateRanking: (id: string, f: string, r: number) => void;
}) => (
  <tr key={resp.id} className="group/row  hover:bg-slate-50/50 transition-all duration-300">
    <td className="p-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-sky-400 group-hover/row:scale-110 transition-transform">
          {resp.id}
        </div>
      </div>
    </td>
    {factors.map(f => (
      <td key={f} className="p-6">
        <input
          type="number"
          min="1"
          max={factors.length}
          value={resp.rankings[f] || ''}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) updateRanking(resp.id, f, val);
            else updateRanking(resp.id, f, 0);
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-sky-500/50 transition-all outline-none group-hover/row:bg-white"
          placeholder="--"
        />
      </td>
    ))}
  </tr>
));

export const GarrettModule = ({ initialSession }: { initialSession?: any }) => {
  const [step, setStep] = useState(1);
  const [factors, setFactors] = useState<string[]>(['Factor 1', 'Factor 2', 'Factor 3']);
  const [respondents, setRespondents] = useState<RespondentData[]>([
    { id: 'R1', rankings: { 'Factor 1': 1, 'Factor 2': 2, 'Factor 3': 3 } }
  ]);
  const [results, setResults] = useState<GarrettResult[] | null>(null);
  const [sessionName, setSessionName] = useState('New Garrett Session');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    if (initialSession) {
      if (initialSession.name) setSessionName(initialSession.name);

      const hasFactors = initialSession.factors && initialSession.factors.length > 0;
      if (hasFactors) {
        setFactors(initialSession.factors);
      }

      const hasRespondents = initialSession.respondents && initialSession.respondents.length > 0;
      if (hasRespondents) {
        setRespondents(initialSession.respondents);
      }

      const hasResults = initialSession.results && initialSession.results.length > 0;
      if (hasResults) {
        setResults(initialSession.results);
      }

      if (hasResults) {
        setStep(3);
      } else if (hasRespondents || hasFactors) {
        setStep(2);
      } else {
        setStep(1);
      }
    } else {
      setStep(1);
      setFactors(['Factor 1', 'Factor 2', 'Factor 3']);
      setRespondents([{ id: 'R1', rankings: { 'Factor 1': 1, 'Factor 2': 2, 'Factor 3': 3 } }]);
      setResults(null);
      setSessionName('New Garrett Session');
    }
  }, [initialSession]);

  const [chartType, setChartType] = useState<'bar' | 'radar' | 'pie' | 'heatmap'>('bar');
  const [isAuditExpanded, setIsAuditExpanded] = useState(false);
  const chartRef = useRef<ChartJS | null>(null);

  // Factor Management
  const addFactor = () => setFactors([...factors, `Factor ${factors.length + 1}`]);
  const removeFactor = (index: number) => {
    const newFactors = factors.filter((_, i) => i !== index);
    setFactors(newFactors);
  };
  const updateFactor = (index: number, value: string) => {
    const newFactors = [...factors];
    newFactors[index] = value;
    setFactors(newFactors);
  };

  // Respondent Management
  const addRespondent = useCallback(() => {
    setRespondents(prev => [...prev, {
      id: `R${prev.length + 1}`,
      rankings: {}
    }]);
  }, []);

  const updateRanking = useCallback((respId: string, factor: string, rank: number) => {
    setRespondents(prev => prev.map(r =>
      r.id === respId ? { ...r, rankings: { ...r.rankings, [factor]: rank } } : r
    ));
  }, []);

  // File Upload
  const processFileData = (data: any[]) => {
    if (!data || data.length === 0) return;

    // 1. Extract Factors (all columns except those that look like IDs)
    const firstRow = data[0];
    const potentialFactors = Object.keys(firstRow).filter(key =>
      !['id', 'respondent', 'name', 'sl', 'no', 's.no', 'respondent id'].includes(key.toLowerCase())
    );

    if (potentialFactors.length > 0) {
      setFactors(potentialFactors);
    }

    // 2. Map Respondents
    const newRespondents: RespondentData[] = data.map((row, index) => {
      const rankings: Record<string, number> = {};
      potentialFactors.forEach(f => {
        const val = parseInt(row[f]);
        if (!isNaN(val)) rankings[f] = val;
      });
      return {
        id: row['id'] || row['Respondent'] || row['Respondent ID'] || `R${index + 1}`,
        rankings
      };
    });

    setRespondents(newRespondents);
    setStep(2); // Automatically move to data entry step
  };

  const clearData = () => {
    setRespondents([{ id: 'R1', rankings: {} }]);
    setIsConfirmingClear(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (file.name.endsWith('.csv')) {
        Papa.parse(data as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            processFileData(results.data);
          }
        });
      } else {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        processFileData(json);
      }
    };

    if (file.name.endsWith('.csv')) reader.readAsText(file);
    else reader.readAsBinaryString(file);
  }, [factors]);

  const downloadTemplate = () => {
    const csvContent = "Respondent ID,Factor 1,Factor 2,Factor 3\nR1,1,2,3\nR2,2,1,3\nR3,3,2,1";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "garrett_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  } as any);

  // Calculation
  const handleCalculate = async () => {
    const res = calculateGarrettRanking(factors, respondents);
    setResults(res);
    setStep(3);

    // Save to Firebase if authenticated
    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'sessions'), {
          uid: auth.currentUser.uid,
          name: sessionName,
          createdAt: serverTimestamp(),
          factors,
          respondentData: respondents,
          results: res
        });
      } catch (error) {
        console.error("Error saving session:", error);
      }
    }
  };

  // Export Options
  const exportToCSV = () => {
    if (!results) return;
    const csvData = results.map(r => ({
      Rank: r.rank,
      Factor: r.factor,
      'Total Score': r.totalScore.toFixed(2),
      'Mean Score': r.meanScore.toFixed(2)
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${sessionName}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!results) return;

    // Sheet 1: Main Results
    const mainData = results.map(res => ({
      Rank: res.rank,
      Factor: res.factor,
      'Mean Score': res.meanScore.toFixed(2)
    }));
    const ws1 = XLSX.utils.json_to_sheet(mainData);

    // Sheet 2: Methodology Audit (Detailed Calculations)
    const auditData: any[] = [];
    results.forEach(res => {
      res.audit.forEach(entry => {
        auditData.push({
          Factor: res.factor,
          'Respondent ID': entry.respondentId,
          'Assigned Rank (Rij)': entry.rank,
          'Number of Factors (Nj)': entry.numberOfFactors,
          'Percent Position': entry.percentPosition.toFixed(2),
          'Garrett Value': entry.garrettValue.toFixed(2)
        });
      });
    });
    const ws2 = XLSX.utils.json_to_sheet(auditData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Final Ranking");
    XLSX.utils.book_append_sheet(wb, ws2, "Methodology Audit");

    XLSX.writeFile(wb, `${sessionName.replace(/\s+/g, '_')}_Garrett_Analysis.xlsx`);
  };

  const copyAPATable = () => {
    if (!results) return;
    const title = `Table 1\nResults of Garrett's Ranking Analysis for ${sessionName}\n\n`;
    const header = `Rank\tFactor\tMean Score\n`;
    const separator = `--------------------------------------------------\n`;
    const rows = results.map(res => `${res.rank}\t${res.factor}\t${res.meanScore.toFixed(2)}`).join('\n');
    const footer = `\nNote. Higher mean scores indicate a higher priority assigned by respondents. N = ${respondents.length}.`;

    const table = title + separator + header + separator + rows + separator + footer;
    navigator.clipboard.writeText(table);
    alert('APA Style Table copied to clipboard!');
  };

  const downloadChart = () => {
    if (!chartRef.current) return;
    const url = (chartRef.current as any).toBase64Image('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `${sessionName.replace(/\s+/g, '_')}_Chart.png`;
    link.href = url;
    link.click();
  };

  const copyReport = () => {
    if (!results) return;
    const reportText = `Garrett Ranking Analysis: ${sessionName}\n\n` +
      `Methodology: Garrett's Ranking Technique was used to convert ordinal scales into numerical scores. ` +
      `The ranks assigned by ${respondents.length} respondents were converted into percent positions.\n\n` +
      `Results:\n` +
      results.map(r => `${r.rank}. ${r.factor} - Mean Score: ${r.meanScore.toFixed(2)}`).join('\n');

    navigator.clipboard.writeText(reportText);
    alert("Report copied to clipboard!");
  };


  // Frequency Distribution for Heatmap
  const getFrequencyData = () => {
    const distribution: Record<string, Record<number, number>> = {};
    factors.forEach(f => {
      distribution[f] = {};
      for (let i = 1; i <= factors.length; i++) distribution[f][i] = 0;
    });

    respondents.forEach(r => {
      Object.entries(r.rankings).forEach(([f, rank]) => {
        const rnk = rank as number;
        if (distribution[f] && distribution[f][rnk] !== undefined) {
          distribution[f][rnk]++;
        }
      });
    });

    return distribution;
  };

  // Chart Data
  const chartData = {
    labels: results?.map(r => r.factor) || [],
    datasets: [
      {
        label: 'Mean Score',
        data: results?.map(r => r.meanScore) || [],
        backgroundColor: chartType === 'pie'
          ? [
            'rgba(56, 189, 248, 0.8)', // sky-400
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ]
          : 'rgba(56, 189, 248, 0.8)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
        borderRadius: chartType === 'bar' ? 8 : 0,
      }
    ]
  };

  const radarData = {
    labels: results?.map(r => r.factor) || [],
    datasets: [
      {
        label: 'Mean Score Profile',
        data: results?.map(r => r.meanScore) || [],
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: 'rgba(56, 189, 248, 1)',
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        pointBorderColor: '#020617', // slate-950
        pointHoverBackgroundColor: '#020617',
        pointHoverBorderColor: 'rgba(56, 189, 248, 1)'
      }
    ]
  };

  const frequencyDist = getFrequencyData();

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-100">
      {/* Clear Data Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingClear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className=" rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Clear All Data?</h3>
                <p className="text-slate-400 text-sm">This will remove all respondent rankings from the current session. This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmingClear(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-200 transition-colors duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={clearData}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Garrett Ranking Module</h1>
          <p className="text-slate-400 mt-1">Professional statistical analysis for academic research.</p>
        </div>
        <div className="flex items-center gap-2  p-1 rounded-xl border border-slate-700 shadow-sm">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out",
                step === s ? "bg-sky-500 text-white shadow-md" : "text-slate-400"
              )}
            >
              Step {s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Factors & Setup */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-800 border border-slate-700 p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] -mr-32 -mt-32 transition-colors group-hover:bg-sky-500/10" />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-900/20 flex items-center justify-center text-sky-400">
                        <FileText size={22} />
                      </div>
                      Variable Synthesis
                    </h2>
                    <p className="text-slate-400 text-sm ml-13">Define the core factors for your ranking analysis.</p>
                  </div>
                  <button
                    onClick={addFactor}
                    className="p-3 bg-slate-800 text-white rounded-2xl hover:scale-105 transition-all shadow-xl shadow-slate-200 active:scale-95"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {factors.map((factor, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-4 p-2 pl-4 bg-slate-900 border border-slate-700 rounded-[1.5rem] transition-all duration-300 ease-in-out hover:border-sky-500 hover:shadow-subtle group"
                      >
                        <span className="w-6 h-6 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-tighter transition-colors group-hover:text-sky-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <input
                          value={factor}
                          onChange={(e) => updateFactor(index, e.target.value)}
                          className="flex-1 bg-transparent border-none px-2 py-3 text-lg font-medium text-slate-100 focus:ring-0 placeholder:text-slate-500 outline-none"
                          placeholder="What factor are we ranking?"
                        />
                        <button
                          onClick={() => removeFactor(index)}
                          className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            <div className="bg-slate-800 p-12 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] -mr-64 -mt-64" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/5 blur-[60px]" />

              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-4xl font-display font-bold leading-tight">Ready to engage<br />your respondents?</h3>
                  <p className="text-slate-400 text-lg max-w-md">Once factors are synthesized, proceed to the data entry terminal.</p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className=" text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95 group/btn"
                >
                  Enter Data Lab
                  <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              <Calculator size={240} className="absolute -right-12 -bottom-12 text-white/5 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-[2rem] space-y-6 shadow-xl">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings size={18} className="text-sky-400" />
                Session Architecture
              </h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] ml-1">Identity</label>
                  <input
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-sky-500/50 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-8 rounded-[2rem] space-y-6 shadow-xl">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Upload size={18} className="text-sky-400" />
                Cloud Intake
              </h3>
              <div {...getRootProps()} className={cn(
                "p-10 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all flex flex-col items-center gap-4 text-center group",
                isDragActive ? "border-sky-500 bg-sky-900/20 text-sky-400" : "border-slate-700 hover:border-sky-500 hover:bg-slate-900/50"
              )}>
                <input {...getInputProps()} />
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center text-slate-400 shadow-subtle group-hover:text-sky-400 transition-colors duration-300 ease-in-out">
                  <Upload size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Transmit CSV / Excel</p>
                  <p className="text-[10px] text-sky-400 mt-1 uppercase tracking-widest font-black">Fast-track Synthesis</p>
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-sky-400 hover:text-sky-300 transition-colors duration-300 ease-in-out cursor-pointer"
              >
                <Download size={14} />
                Acquire Blueprint Template
              </button>
            </div>

            <div className="bg-sky-900/20/50 border border-sky-800/50 p-8 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-3 text-sky-100 font-bold">
                <div className="w-8 h-8 rounded-xl  flex items-center justify-center shadow-subtle">
                  <Info size={16} className="text-sky-400" />
                </div>
                Methodology
              </div>
              <p className="text-sm text-sky-100/60 leading-relaxed font-medium">
                Garrett's Ranking Technique transforms qualitative ordinal data into quantitative significance.
                Our engine ensures 100.0% precision in percent-position mapping.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Data Entry */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <button
              onClick={() => setStep(1)}
              className="group flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-sky-400 transition-all duration-300 ease-in-out"
            >
              <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-sky-700 transition-colors duration-300 ease-in-out">
                <ChevronLeft size={16} />
              </div>
              Synthesis Node
            </button>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsConfirmingClear(true)}
                className="px-6 py-3 text-slate-400 font-bold hover:text-red-500 transition-colors text-sm"
              >
                Clear Data
              </button>

              <div {...getRootProps()} className={cn(
                "px-6 py-3 border border-slate-700 rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-sm font-bold text-slate-300",
                isDragActive ? "border-sky-500 bg-sky-900/20" : "hover:border-sky-700 hover:bg-slate-50 shadow-subtle"
              )}>
                <input {...getInputProps()} />
                <Upload size={18} className="text-sky-400" />
                Inject Dataset
              </div>

              <button
                onClick={handleCalculate}
                className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95 group/calc"
              >
                <Play size={18} className="text-sky-400 group-hover/calc:text-sky-300" />
                Calculate Significance
              </button>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border-slate-700/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-white/5">
                    <th className="p-6 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Subject Node</th>
                    {factors.map(f => (
                      <th key={f} className="p-6 font-black text-white text-[10px] uppercase tracking-[0.2em] min-w-[160px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-sky-400">{f}</span>
                          <span className="text-[9px] font-medium opacity-40 lowercase tracking-normal">Ordinal Rank [1-{factors.length}]</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {respondents.map((resp) => (
                    <RespondentRow
                      key={resp.id}
                      resp={resp}
                      factors={factors}
                      updateRanking={updateRanking}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-10 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-700/50">
              <div className="flex items-center gap-6">
                <button
                  onClick={addRespondent}
                  className="flex items-center gap-3 text-sky-400 font-bold hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <div className="w-10 h-10 rounded-xl  shadow-subtle flex items-center justify-center">
                    <Plus size={20} />
                  </div>
                  Add Single Subject
                </button>
                <div className="h-8 w-px bg-slate-700 hidden md:block" />
                <button
                  onClick={() => {
                    const newResps = Array.from({ length: 10 }).map((_, i) => ({
                      id: `R${respondents.length + i + 1}`,
                      rankings: {}
                    }));
                    setRespondents([...respondents, ...newResps]);
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors duration-300 ease-in-out"
                >
                  + Append 10 Subjects
                </button>
              </div>

              <div className="flex items-center gap-4 px-6 py-3  rounded-2xl shadow-subtle border border-slate-700/50">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-200">{respondents.length} Active Nodes</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Results */}
      {step === 3 && results && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-400 font-medium hover:text-sky-400 transition-colors duration-300 ease-in-out">
              <ChevronLeft size={20} />
              Back to Data
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={copyReport}
                className="flex items-center gap-2  border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-50 transition-colors duration-300 ease-in-out"
              >
                <Copy size={18} />
                Copy Report
              </button>
              <button
                onClick={copyAPATable}
                className="flex items-center gap-2  border border-sky-700 px-4 py-2 rounded-xl text-sm font-bold text-sky-400 hover:bg-sky-900/20 transition-colors duration-300 ease-in-out"
              >
                <TableIcon size={18} />
                APA Table
              </button>
              <button
                onClick={downloadChart}
                className="flex items-center gap-2  border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-50 transition-colors duration-300 ease-in-out"
              >
                <ImageIcon size={18} />
                Save Chart
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2  border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-50 transition-colors duration-300 ease-in-out"
              >
                <FileText size={18} />
                CSV
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2  border border-slate-700 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-50 transition-colors duration-300 ease-in-out"
              >
                <FileSpreadsheet size={18} />
                Excel
              </button>

            </div>
          </div>

          <div id="garrett-report" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className=" p-6 rounded-2xl border border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 size={22} className="text-sky-400" />
                    Visual Analysis
                  </h3>
                  <div className="flex bg-slate-800 p-1 rounded-lg no-print">
                    {(['bar', 'radar', 'pie', 'heatmap'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          "px-3 py-1 text-xs font-bold rounded-md transition-all capitalize",
                          chartType === type ? " text-sky-400 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div id="chart-capture-area" className="h-[350px] w-full flex items-center justify-center  p-4">
                  {chartType === 'bar' && (
                    <Bar
                      ref={chartRef as any}
                      data={chartData}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { color: 'rgba(51, 65, 85, 0.5)' }, border: { display: false }, min: 0, max: 100, ticks: { color: '#94a3b8' } },
                          y: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8' } }
                        }
                      }}
                    />
                  )}
                  {chartType === 'radar' && (
                    <Radar
                      ref={chartRef as any}
                      data={radarData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            min: 0,
                            max: 100,
                            ticks: { display: false },
                            grid: { color: 'rgba(51, 65, 85, 0.5)' },
                            angleLines: { color: 'rgba(51, 65, 85, 0.5)' },
                            pointLabels: { color: '#94a3b8' }
                          }
                        }
                      }}
                    />
                  )}
                  {chartType === 'pie' && (
                    <Pie
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
                      }}
                    />
                  )}
                  {chartType === 'heatmap' && (
                    <div className="w-full h-full flex flex-col gap-4">
                      <div className="flex-1 overflow-auto">
                        <div className="min-w-[600px] space-y-2 p-2">
                          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(40px,1fr))] gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                            <div className="text-left">Factor</div>
                            {Array.from({ length: factors.length }).map((_, i) => (
                              <div key={i} className="py-2 border-b border-slate-50">Rank {i + 1}</div>
                            ))}
                          </div>
                          {factors.map(f => (
                            <div key={f} className="grid grid-cols-[160px_repeat(auto-fit,minmax(40px,1fr))] gap-1 items-center group">
                              <div className="text-xs font-bold text-slate-200 truncate pr-2 group-hover:text-sky-400 transition-colors duration-300 ease-in-out">{f}</div>
                              {Array.from({ length: factors.length }).map((_, i) => {
                                const count = frequencyDist[f][i + 1] || 0;
                                const intensity = Math.min(count / respondents.length, 1);
                                return (
                                  <div
                                    key={i}
                                    className="h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-105 hover:shadow-md cursor-default"
                                    style={{
                                      backgroundColor: `rgba(56, 189, 248, ${0.05 + intensity * 0.95})`,
                                      color: intensity > 0.4 ? '#020617' : '#38bdf8',
                                      border: intensity > 0 ? '1px solid rgba(56, 189, 248, 0.2)' : '1px dashed rgba(51, 65, 85, 0.5)'
                                    }}
                                    title={`${count} respondents ranked ${f} as #${i + 1}`}
                                  >
                                    {count > 0 ? count : ''}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-3 px-4 py-2 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Intensity Legend</span>
                        <div className="flex items-center gap-1">
                          {[0.1, 0.3, 0.5, 0.7, 0.9].map((lvl, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-sm"
                              style={{ backgroundColor: `rgba(56, 189, 248, ${lvl})` }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">Low → High</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className=" p-6 rounded-2xl border border-slate-700 shadow-sm space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TableIcon size={22} className="text-sky-400" />
                  Final Mean Scores
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-700/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800 border-b border-slate-700/50">
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase">Rank</th>
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase">Factor</th>
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase text-right">Mean Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res) => (
                        <tr key={res.factor} className="border-b border-slate-50 last:border-0">
                          <td className="p-4">
                            <span className={cn(
                              "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                              res.rank === 1 ? "bg-amber-100 text-amber-700" :
                                res.rank === 2 ? "bg-slate-800 text-slate-300" :
                                  res.rank === 3 ? "bg-orange-100 text-orange-700" : "text-slate-400"
                            )}>
                              {res.rank}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-200">{res.factor}</td>
                          <td className="p-4 text-right font-bold text-sky-400">{res.meanScore.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className=" p-8 rounded-2xl border border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                <div>
                  <h3 className="text-xl font-bold">Methodology Audit</h3>
                  <p className="text-slate-400 text-sm">Verify step-by-step calculations for academic transparency</p>
                </div>
                <button
                  onClick={() => setIsAuditExpanded(!isAuditExpanded)}
                  className="flex items-center gap-2 text-sky-400 font-bold text-sm hover:bg-sky-900/20 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out"
                >
                  <ChevronRight size={18} className={cn("transition-transform", isAuditExpanded ? "rotate-90" : "")} />
                  {isAuditExpanded ? "Hide Audit" : "Show Audit"}
                </button>
              </div>

              <AnimatePresence>
                {isAuditExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6">
                      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 font-serif text-slate-200 leading-relaxed italic">
                        "To determine the relative importance of the factors, Garrett's Ranking Technique was employed.
                        The ranks assigned by {respondents.length} respondents were converted into percent positions using the formula
                        100(Rij - 0.5)/Nj. These positions were then transformed into scores using Garrett's table,
                        and the mean scores were calculated for each factor. Higher mean scores indicate a higher priority
                        assigned by the respondents."
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-800 border-b border-slate-700/50">
                              <th className="p-3 font-bold text-slate-400 uppercase text-[10px]">Factor</th>
                              <th className="p-3 font-bold text-slate-400 uppercase text-[10px]">Resp ID</th>
                              <th className="p-3 font-bold text-slate-400 uppercase text-[10px] text-center">Rank (Rij)</th>
                              <th className="p-3 font-bold text-slate-400 uppercase text-[10px] text-center">Factors (Nj)</th>
                              <th className="p-3 font-bold text-slate-400 uppercase text-[10px] text-center">Percent Position</th>
                              <th className="p-3 font-bold text-slate-400 uppercase text-[10px] text-right">Garrett Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map(res =>
                              res.audit.slice(0, 10).map((entry, idx) => (
                                <tr key={`${res.factor}-${entry.respondentId}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                  {idx === 0 && (
                                    <td rowSpan={Math.min(res.audit.length, 10)} className="p-3 font-bold text-white align-top border-r border-slate-50">
                                      {res.factor}
                                    </td>
                                  )}
                                  <td className="p-3 text-slate-300">{entry.respondentId}</td>
                                  <td className="p-3 text-center font-medium">{entry.rank}</td>
                                  <td className="p-3 text-center text-slate-400">{entry.numberOfFactors}</td>
                                  <td className="p-3 text-center text-slate-400">{entry.percentPosition.toFixed(2)}%</td>
                                  <td className="p-3 text-right font-bold text-sky-400">{entry.garrettValue.toFixed(2)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        <div className="p-4 bg-sky-900/20/50 text-center">
                          <p className="text-xs text-sky-400 font-medium">
                            Showing first 10 responses per factor. Export to Excel for the full methodology audit trail.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
